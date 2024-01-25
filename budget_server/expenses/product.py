from database import MongoExpenseDB
from revenues import Revenues
from utilities import generated_id, Timer


class ProductExpense:
    def __init__(self, revenues: Revenues):
        self.__revenues: Revenues = revenues
        self.__db: MongoExpenseDB = MongoExpenseDB("product")
        self.__midnight: str = "00:00:00"

    @property
    def product_expenses(self) -> list[dict]:
        my_expenses: list[dict] = self.__db.expenses
        my_expenses.sort(key=lambda bill: Timer.convert_datetime_to_seconds(
            Timer.convert_string_to_datetime(f"{bill['purchased']} {self.__midnight}")
        ), reverse=True)
        return my_expenses

    @property
    def total_product_expenses(self) -> int:
        total: int = 0
        for expense in self.product_expenses:
            total += expense["price"]["total"]
        return total

    @staticmethod
    def __product_total_price(expense: dict) -> int | float:
        if expense["quantity"]["unit"] == "piece(s)" or expense["quantity"]["unit"] == "cup(s)" \
                or expense["quantity"]["unit"] == "packet(s)" or expense["quantity"]["unit"] == "plate(s)" \
                or expense["quantity"]["unit"] == "pair(s)" or expense["quantity"]["unit"] == "liter(s)":
            return expense["price"]["unit"] * expense["quantity"]["value"]
        return expense["price"]["unit"]

    def __account_transaction_costs(self, expense: dict) -> None:
        if expense["payment"]["method"] == "mpesa":
            self.__revenues.reduce(expense["payment"]["transaction"]["cost"])

    def __remove_transaction_costs(self, expense: dict) -> None:
        if expense["payment"]["method"] == "mpesa":
            self.__revenues.increase(expense["payment"]["transaction"]["cost"])

    def add(self, expense: dict) -> str:
        price: int | float = self.__product_total_price(expense)
        if price <= self.__revenues.balance:
            expense["_id"] = generated_id()
            expense["timestamp"] = Timer.current_datetime_seconds()
            expense["price"]["total"] = price
            self.__db.add_expense(expense)
            self.__revenues.reduce(price)
            self.__account_transaction_costs(expense)
            return "added"
        return "insufficient"

    def update(self, expense_id: str, expense: dict) -> None:
        price: int | float = self.__product_total_price(expense)
        expense["price"]["total"] = price
        self.__db.update_expense(expense_id, expense)

    def remove(self, expense_id: str) -> None:
        expense: dict = self.__db.retrieve_expense(expense_id)
        self.__revenues.increase(expense["price"]["total"])
        self.__remove_transaction_costs(expense)
        self.__db.remove_expense(expense_id)
