from pymongo.database import Database
from pymongo.collection import Collection
from database.mongodb import MongoDB
from utilities import Timer


class MongoExpenseDB(MongoDB):
    def __init__(self, category: str):
        super().__init__()
        self.__expense_collection: Collection = self.__set_expense_collection(category)

    def __set_expense_collection(self, category: str) -> Collection:
        cluster_path: str = f"budget_{self._year}"
        collection_path: str = f"{category}_expenses"
        db: Database = self._client[cluster_path]
        return db[collection_path]

    def add_expense(self, expense: dict) -> None:
        self.__expense_collection.insert_one(expense)

    def retrieve_expense(self, expense_id: str) -> dict:
        return dict(self.__expense_collection.find_one({"_id": expense_id}))

    def remove_expense(self, expense_id: str) -> None:
        self.__expense_collection.delete_one({"_id": expense_id})

    def update_expense(self, expense_id: str, expense: dict) -> None:
        del expense["_id"]
        self.__expense_collection.update_one({"_id": expense_id}, {"$set": {
            "product": expense["product"],
            "category": expense["category"],
            "quantity": expense["quantity"],
            "price": expense["price"],
            "seller": expense["seller"],
            "payment": expense["payment"],
            "purchased": expense["purchased"]
        }})

    @property
    def expenses(self) -> list[dict]:
        my_expenses: list[dict] = list(self.__expense_collection.find())
        my_expenses.reverse()
        return my_expenses
