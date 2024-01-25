from database import MongoInvestmentDB
from revenues import Revenues
from utilities import generated_id, Timer


class Investments:
    def __init__(self, revenues: Revenues):
        self.__revenues: Revenues = revenues
        self.__db: MongoInvestmentDB = MongoInvestmentDB()
        self.__midnight: str = "00:00:00"

    @property
    def investments(self) -> list[dict]:
        my_investments: list[dict] = self.__db.investments
        for my_investment in my_investments:
            total: int = 0
            for invest in my_investment["investments"]:
                total += invest["amount"]
            my_investment["total"] = total
        return my_investments

    @property
    def total_investments(self) -> int:
        total: int = 0
        for investment in self.investments:
            for invest in investment["investments"]:
                total += invest["amount"]
                if invest["payment"]["method"] == "mpesa":
                    total += invest["payment"]["transaction"]["cost"]
        return total

    def __account_transaction_costs(self, mode: str, transaction_cost: int) -> None:
        if mode == "mpesa":
            self.__revenues.reduce(transaction_cost)

    def __remove_transaction_costs(self, mode: str, transaction_cost: int) -> None:
        if mode == "mpesa":
            self.__revenues.increase(transaction_cost)

    def add(self, investment: dict) -> str:
        initial_investment: dict = investment["investments"][0]
        amount: int = initial_investment["amount"]
        if amount <= self.__revenues.balance:
            investment["_id"] = generated_id()
            investment["timestamp"] = Timer.current_datetime_seconds()
            self.__db.add_investment(investment)
            self.__revenues.reduce(amount)
            self.__account_transaction_costs(
                initial_investment["payment"]["method"],
                initial_investment["payment"]["transaction"]["cost"]
            )
            return "added"
        return "insufficient"

    def pay(self, investment_id: str, investment: dict) -> str:
        my_investment: dict = self.__db.retrieve_investment(investment_id)
        amount: int = investment["amount"]
        if amount <= self.__revenues.balance:
            my_investment["investments"].append(investment)
            self.__db.add_investment_amount(investment_id, my_investment["investments"])
            self.__revenues.reduce(amount)
            self.__account_transaction_costs(
                investment["payment"]["method"],
                investment["payment"]["transaction"]["cost"]
            )
            return "added"
        return "insufficient"

    def update(self, investment_id: str, investment: dict) -> None:
        self.__db.update_investment(investment_id, investment)

    def remove(self, investment_id: str) -> None:
        my_investment: dict = self.__db.retrieve_investment(investment_id)
        for investment in my_investment["investments"]:
            self.__revenues.increase(investment["amount"])
            self.__remove_transaction_costs(
                investment["payment"]["method"],
                investment["payment"]["transaction"]["cost"]
            )
        self.__db.remove_investment(investment_id)
