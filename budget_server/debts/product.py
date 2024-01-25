from database import MongoDebtDB
from revenues import Revenues
from utilities import generated_id, Timer


class ProductDebts:
    def __init__(self, revenues: Revenues):
        self.__revenues: Revenues = revenues
        self.__db: MongoDebtDB = MongoDebtDB("product")
        self.__midnight: str = "00:00:00"

    @staticmethod
    def __product_total_price(debt: dict) -> int | float:
        if debt["quantity"]["unit"] == "piece(s)" or debt["quantity"]["unit"] == "cup(s)" \
                or debt["quantity"]["unit"] == "packet(s)" or debt["quantity"]["unit"] == "plate(s)" \
                or debt["quantity"]["unit"] == "pair(s)" or debt["quantity"]["unit"] == "liter(s)":
            return debt["price"]["unit"] * debt["quantity"]["value"]
        return debt["price"]["unit"]

    @property
    def debts(self) -> list[dict]:
        my_debts: list[dict] = self.__db.debts
        my_debts.sort(key=lambda bill: Timer.convert_datetime_to_seconds(
            Timer.convert_string_to_datetime(f"{bill['taken']} {self.__midnight}")
        ), reverse=True)
        return my_debts

    @staticmethod
    def __validate_current_year(debt: dict) -> int | float:
        if debt["taken"].__contains__("2023"):
            last_payments: list[dict] = debt["payment"]["last_payment"]
            for payment in last_payments:
                if payment["date"].__contains__("2024"):
                    return payment["amount"]
        return debt["price"]["total"]

    @property
    def total_product_debt(self) -> tuple:
        total_amount: int = 0
        total_balance: int = 0
        for debt in self.debts:
            total_amount += self.__validate_current_year(debt)
            total_balance += debt["payment"]["balance"]
        return total_amount, total_balance

    def __remove_transaction_costs(self, debt: dict) -> None:
        if debt["payment"]["method"] == "mpesa":
            self.__revenues.increase(debt["payment"]["transaction"]["cost"])

    @staticmethod
    def __update_last_payment(debt: dict, price: int | float) -> None:
        debt["price"]["total"] = price
        if len(debt["payment"]["last_payment"]) > 0:
            debt["payment"]["balance"] = price - debt["payment"]["last_payment"]["amount"]
            last_payment: dict = debt["payment"]["last_payment"]
            debt["payment"]["last_payment"] = [last_payment]
        else:
            debt["payment"]["balance"] = price
            debt["payment"]["last_payment"] = []

    def add(self, debt: dict) -> None:
        debt["_id"] = generated_id()
        debt["timestamp"] = Timer.current_datetime_seconds()
        price: int | float = self.__product_total_price(debt)
        self.__update_last_payment(debt, price)
        self.__db.add_debt(debt)

    @staticmethod
    def __validate_payment_status(debt: dict) -> None:
        if debt["payment"]["balance"] == 0:
            debt["payment"]["status"] = "completed"

    @staticmethod
    def __add_payment(debt: dict, payment: dict) -> None:
        del payment["debt_id"]
        debt["payment"]["last_payment"].append(payment)

    def __account_transaction_cost(self, last_payments: list[dict], transaction: dict) -> None:
        found: bool = False
        for payment in last_payments:
            if payment["transaction"]["id"] == transaction["id"]:
                found = True
                break
        if not found:
            self.__revenues.reduce(transaction["cost"])

    def pay(self, debt_id: str, payment: dict) -> str:
        for debt in self.debts:
            amount: int | float = payment["amount"]
            if debt["_id"] == debt_id and amount <= self.__revenues.balance and amount <= debt["payment"]["balance"]:
                self.__revenues.reduce(amount)
                debt["payment"]["balance"] -= payment["amount"]
                self.__account_transaction_cost(debt["payment"]["last_payment"], payment["transaction"])
                self.__validate_payment_status(debt)
                self.__add_payment(debt, payment)
                self.update(debt_id, debt)
                return "paid"
        return "insufficient"

    def update(self, debt_id: str, debt: dict) -> None:
        self.__db.update_debt(debt_id, debt)

    def remove(self, debt_id: str) -> None:
        debt: dict = self.__db.retrieve_debt(debt_id)
        if debt["payment"]["status"] == "completed":
            self.__revenues.increase(debt["price"])
            self.__remove_transaction_costs(debt)
        self.__db.remove_debt(debt_id)
