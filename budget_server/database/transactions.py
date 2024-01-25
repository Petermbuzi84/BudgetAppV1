from pymongo.database import Database
from pymongo.collection import Collection
from database.mongodb import MongoDB


class MongoTransactionDB(MongoDB):
    def __init__(self, category: str):
        super().__init__()
        self.__transaction_collection: Collection = self.__set_transaction_collection(category)

    def __set_transaction_collection(self, category: str) -> Collection:
        cluster_path: str = f"budget_{self._year}"
        collection_path: str = f"{category}_transactions"
        db: Database = self._client[cluster_path]
        return db[collection_path]

    def add_transaction(self, transaction: dict) -> None:
        self.__transaction_collection.insert_one(transaction)

    def retrieve_transaction(self, transaction_id: str) -> dict:
        return dict(self.__transaction_collection.find_one({"_id": transaction_id}))

    def remove_transaction(self, transaction_id: str) -> None:
        self.__transaction_collection.delete_one({"_id": transaction_id})

    def update_transaction(self, transaction_id: str, transaction: dict) -> None:
        del transaction["_id"]
        self.__transaction_collection.update_one({"_id": transaction_id}, {"$set": transaction})

    @property
    def transactions(self) -> list[dict]:
        my_transactions: list[dict] = list(self.__transaction_collection.find())
        my_transactions.reverse()
        return my_transactions
