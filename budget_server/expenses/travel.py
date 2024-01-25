from database import MongoExpenseDB
from revenues import Revenues
from utilities import generated_id, Timer


class TravelExpense:
    def __init__(self, revenues: Revenues):
        self.__revenues: Revenues = revenues
        self.__db: MongoExpenseDB = MongoExpenseDB("travel")
        self.__midnight: str = "00:00:00"

    @property
    def travel_expenses(self) -> list[dict]:
        my_expenses: list[dict] = self.__db.expenses
        my_expenses.sort(key=lambda bill: Timer.convert_datetime_to_seconds(
            Timer.convert_string_to_datetime(f"{bill['travelled']} {self.__midnight}")
        ), reverse=True)
        return my_expenses

    @property
    def total_travel_expenses(self) -> int:
        total: int = 0
        for expense in self.travel_expenses:
            total += expense["amount"]
        return total

    def __account_transaction_costs(self, expense: dict) -> None:
        if expense["payment"]["method"] == "mpesa":
            self.__revenues.reduce(expense["payment"]["transaction"]["cost"])

    def __remove_transaction_costs(self, expense: dict) -> None:
        if expense["payment"]["method"] == "mpesa":
            self.__revenues.increase(expense["payment"]["transaction"]["cost"])

    def add(self, expense: dict) -> str:
        if expense["amount"] <= self.__revenues.balance:
            expense["_id"] = generated_id()
            expense["timestamp"] = Timer.current_datetime_seconds()
            self.__db.add_expense(expense)
            self.__revenues.reduce(expense["amount"])
            self.__account_transaction_costs(expense)
            return "added"
        return "insufficient"

    def update(self, expense_id: str, expense: dict) -> None:
        self.__db.update_expense(expense_id, expense)

    def remove(self, expense_id: str) -> None:
        expense: dict = self.__db.retrieve_expense(expense_id)
        self.__revenues.increase(expense["amount"])
        self.__remove_transaction_costs(expense)
        self.__db.remove_expense(expense_id)
