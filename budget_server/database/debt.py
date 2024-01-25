from pymongo.database import Database
from pymongo.collection import Collection
from database.mongodb import MongoDB


class MongoDebtDB(MongoDB):
    def __init__(self, category: str):
        super().__init__()
        self.__debt_collection: Collection = self.__set_debt_collection(category)

    def __set_debt_collection(self, category: str) -> Collection:
        cluster_path: str = f"budget_{self._year}"
        collection_path: str = f"{category}_debts"
        db: Database = self._client[cluster_path]
        return db[collection_path]

    def add_debt(self, debt: dict) -> None:
        self.__debt_collection.insert_one(debt)

    def retrieve_debt(self, debt_id: str) -> dict:
        return dict(self.__debt_collection.find_one({"_id": debt_id}))

    def remove_debt(self, debt_id: str) -> None:
        self.__debt_collection.delete_one({"_id": debt_id})

    def update_debt(self, debt_id: str, debt: dict) -> None:
        del debt["_id"]
        self.__debt_collection.update_one({"_id": debt_id}, {"$set": debt})

    @property
    def debts(self) -> list[dict]:
        my_debts: list[dict] = list(self.__debt_collection.find())
        my_debts.reverse()
        return my_debts
