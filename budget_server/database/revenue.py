from pymongo.database import Database
from pymongo.collection import Collection
from database.mongodb import MongoDB


class MongoRevenueDB(MongoDB):
    def __init__(self):
        super().__init__()
        self.__revenue_collection: Collection = self.__set_revenue_collection
        self.__balance_collection: Collection = self.__set_revenue_balance_collection

    @property
    def __set_revenue_collection(self) -> Collection:
        cluster_path: str = f"budget_{self._year}"
        collection_path: str = "revenues"
        db: Database = self._client[cluster_path]
        return db[collection_path]

    @property
    def __set_revenue_balance_collection(self) -> Collection:
        cluster_path: str = f"budget_{self._year}"
        collection_path: str = "balance"
        db: Database = self._client[cluster_path]
        return db[collection_path]

    @property
    def balance(self) -> int | float:
        balances: list[dict] = list(self.__balance_collection.find())
        if len(balances) == 0:
            return 0
        return balances[0]["balance"]

    def __add_balance(self, amount: int | float) -> None:
        my_balance: int | float = self.balance
        my_balance += amount
        self.update_balance(my_balance)

    def __reduce_balance(self, amount: int | float) -> None:
        my_balance: int | float = self.balance
        my_balance -= amount
        self.update_balance(my_balance)

    def update_balance(self, my_balance: int | float) -> None:
        balances: list[dict] = list(self.__balance_collection.find())
        if len(balances) > 0:
            balance: dict = balances[0]
            self.__balance_collection.update_one({"_id": balance["_id"]}, {"$set": {"balance": my_balance}})
        else:
            self.__balance_collection.insert_one({"balance": my_balance})

    def __remove_balance(self) -> None:
        self.__balance_collection.drop()

    def add_revenue(self, revenue: dict) -> None:
        self.__revenue_collection.insert_one(revenue)
        self.__add_balance(revenue["amount"])

    def retrieve_revenue(self, revenue_id: str) -> dict:
        return dict(self.__revenue_collection.find_one({"_id": revenue_id}))

    def remove_revenue(self, revenue_id: str) -> None:
        revenue: dict = self.retrieve_revenue(revenue_id)
        self.__reduce_balance(revenue["amount"])
        self.__revenue_collection.delete_one({"_id": revenue_id})

    def __update_revenue_balance(self, revenue: dict, my_revenue: dict) -> None:
        if revenue["amount"] > my_revenue["amount"]:
            my_amount: int | float = self.balance
            difference: int | float = revenue["amount"] - my_revenue["amount"]
            my_amount += difference
            self.update_balance(my_amount)
        elif revenue["amount"] < my_revenue["amount"]:
            my_amount: int | float = self.balance
            difference: int | float = my_revenue["amount"] - revenue["amount"]
            my_amount -= difference
            self.update_balance(my_amount)

    def update_revenue(self, revenue_id: str, revenue: dict) -> None:
        my_revenue: dict = self.retrieve_revenue(revenue_id)
        self.__update_revenue_balance(revenue, my_revenue)
        self.__revenue_collection.update_one({"_id": revenue_id}, {"$set": {
            "source": revenue["source"],
            "category": revenue["category"],
            "amount": revenue["amount"],
            "payment": revenue["payment"],
            "received": revenue["received"],
        }})

    @property
    def revenues(self) -> list[dict]:
        my_revenues: list[dict] = list(self.__revenue_collection.find())
        my_revenues.reverse()
        return my_revenues
