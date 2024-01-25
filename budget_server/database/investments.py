from pymongo.database import Database
from pymongo.collection import Collection
from database.mongodb import MongoDB


class MongoInvestmentDB(MongoDB):
    def __init__(self):
        super().__init__()
        self.__investment_collection: Collection = self.__set_investment_collection

    @property
    def __set_investment_collection(self) -> Collection:
        cluster_path: str = f"budget_{self._year}"
        collection_path: str = "investments"
        db: Database = self._client[cluster_path]
        return db[collection_path]

    def add_investment(self, investment: dict) -> None:
        self.__investment_collection.insert_one(investment)

    def retrieve_investment(self, investment_id: str) -> dict:
        return dict(self.__investment_collection.find_one({"_id": investment_id}))

    def remove_investment(self, investment_id: str) -> None:
        self.__investment_collection.delete_one({"_id": investment_id})

    def add_investment_amount(self, investment_id: str, investments: list[dict]) -> None:
        self.__investment_collection.update_one({"_id": investment_id}, {"$set": {"investments": investments}})

    def update_investment(self, investment_id: str, investment: dict) -> None:
        del investment["_id"]
        self.__investment_collection.update_one({"_id": investment_id}, {"$set": investment})

    @property
    def investments(self) -> list[dict]:
        my_investments: list[dict] = list(self.__investment_collection.find())
        my_investments.reverse()
        return my_investments
