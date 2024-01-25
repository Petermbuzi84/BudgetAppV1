from utilities import generated_id, Timer
from database import MongoRevenueDB


class Revenues:
    def __init__(self):
        self.__db: MongoRevenueDB = MongoRevenueDB()
        self.__midnight: str = "00:00:00"

    @property
    def revenues(self) -> list[dict]:
        my_revenues: list[dict] = self.__db.revenues
        my_revenues.sort(key=lambda bill: Timer.convert_datetime_to_seconds(
            Timer.convert_string_to_datetime(f"{bill['received']} {self.__midnight}")
        ), reverse=True)
        return my_revenues

    @property
    def total_revenues(self) -> tuple:
        amount_total: int = 0
        for revenue in self.revenues:
            amount_total += revenue["amount"]
        return amount_total, self.balance

    @property
    def balance(self) -> int | float:
        return self.__db.balance

    def reduce(self, amount: int) -> None:
        my_balance: int | float = self.balance
        my_balance -= amount
        self.__db.update_balance(my_balance)

    def increase(self, amount: int) -> None:
        my_balance: int | float = self.balance
        my_balance += amount
        self.__db.update_balance(my_balance)

    def add(self, revenue: dict) -> None:
        revenue["_id"] = generated_id()
        revenue["timestamp"] = Timer.current_datetime_seconds()
        self.__db.add_revenue(revenue)

    def update(self, revenue_id: str, revenue: dict) -> None:
        self.__db.update_revenue(revenue_id, revenue)

    def remove(self, revenue_id: str) -> None:
        self.__db.remove_revenue(revenue_id)
