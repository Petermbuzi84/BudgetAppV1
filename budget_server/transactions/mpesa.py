from revenues import Revenues
from database import MongoTransactionDB
from utilities import generated_id, Timer


class MPesaTransactions:
    def __init__(self, revenues: Revenues):
        self.__revenues: Revenues = revenues
        self.__db: MongoTransactionDB = MongoTransactionDB("mpesa")
        self.__midnight: str = "00:00:00"

    @property
    def transactions(self) -> list[dict]:
        my_transactions: list[dict] = self.__db.transactions
        my_transactions.sort(key=lambda bill: Timer.convert_datetime_to_seconds(
            Timer.convert_string_to_datetime(f"{bill['period']['date']} {self.__midnight}")
        ), reverse=True)
        return my_transactions

    @property
    def total_cost(self) -> int:
        total: int = 0
        for transaction in self.transactions:
            total += transaction["cost"]
        return total

    def add(self, transaction: dict) -> str:
        if transaction["cost"] <= self.__revenues.balance:
            transaction["timestamp"] = Timer.current_datetime_seconds()
            self.__db.add_transaction(transaction)
            self.__revenues.reduce(transaction["cost"])
            return "added"
        return "insufficient"

    def update(self, transaction_id: str, transaction: dict) -> None:
        available: bool = False
        for db_transaction in self.transactions:
            if db_transaction["_id"] == transaction["_id"]:
                available = True
                break
        if available:
            self.__db.update_transaction(transaction_id, transaction)
        else:
            self.remove(transaction_id)
            self.add(transaction)

    def remove(self, transaction_id: str) -> None:
        transaction: dict = self.__db.retrieve_transaction(transaction_id)
        self.__revenues.increase(transaction["cost"])
        self.__db.remove_transaction(transaction_id)
