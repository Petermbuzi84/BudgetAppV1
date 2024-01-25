from pymongo.database import Database
from pymongo.collection import Collection
from database.mongodb import MongoDB


class MongoBillDB(MongoDB):
    def __init__(self):
        super().__init__()
        self.__bill_collection: Collection = self.__set_bill_collection

    @property
    def __set_bill_collection(self) -> Collection:
        cluster_path: str = f"budget_{self._year}"
        collection_path: str = "bills"
        db: Database = self._client[cluster_path]
        return db[collection_path]

    def add_bill(self, bill: dict) -> None:
        self.__bill_collection.insert_one(bill)

    def retrieve_bill(self, bill_id: str) -> dict:
        return dict(self.__bill_collection.find_one({"_id": bill_id}))

    def remove_bill(self, bill_id: str) -> None:
        self.__bill_collection.delete_one({"_id": bill_id})

    def update_bill(self, bill_id: str, bill: dict) -> None:
        self.__bill_collection.update_one({"_id": bill_id}, {"$set": {"expired": bill["expired"]}})

    @property
    def bills(self) -> list[dict]:
        my_bills: list[dict] = list(self.__bill_collection.find())
        my_bills.reverse()
        return my_bills
