from datetime import datetime, timedelta
from database import MongoBillDB
from revenues import Revenues
from utilities import generated_id, Timer


class Bills:
    def __init__(self, revenues: Revenues):
        self.__revenues: Revenues = revenues
        self.__db: MongoBillDB = MongoBillDB()
        self.__timer: Timer = Timer()
        self.__midnight: str = "00:00:00"

    def __validate_bill_progress(self, stored_bills: list[dict]):
        for bill in stored_bills:
            if not bill["expired"]["status"] and bill["expired"]["details"] != "in progress":
                today_date: str = self.__timer.current_datetime_seconds()
                today_datetime: datetime = self.__timer.convert_string_to_datetime(today_date)
                expired_datetime: datetime = self.__timer.convert_string_to_datetime(
                    f"{bill['expired']['details']} {self.__midnight}"
                )
                if expired_datetime > today_datetime:
                    difference: timedelta = expired_datetime - today_datetime
                    bill["expired"]["details"] = f"{difference.days} days remaining"
                else:
                    bill["expired"]["details"] = self.__timer.current_date()
                    bill["expired"]["status"] = True

    @property
    def bills(self) -> list[dict]:
        my_bills: list[dict] = self.__db.bills
        self.__validate_bill_progress(my_bills)
        my_bills.sort(key=lambda bill: Timer.convert_datetime_to_seconds(
            Timer.convert_string_to_datetime(f"{bill['paid']} {self.__midnight}")
        ), reverse=True)
        return my_bills

    @property
    def total_bills(self) -> int:
        total: int = 0
        for bill in self.bills:
            total += bill["amount"]
        return total

    def __account_transaction_costs(self, bill: dict) -> None:
        if bill["payment"]["method"] == "mpesa":
            self.__revenues.reduce(bill["payment"]["transaction"]["cost"])

    def __remove_transaction_costs(self, bill: dict) -> None:
        if bill["payment"]["method"] == "mpesa":
            self.__revenues.increase(bill["payment"]["transaction"]["cost"])

    def add(self, bill: dict) -> str:
        if bill["amount"] <= self.__revenues.balance:
            bill["_id"] = generated_id()
            bill["timestamp"] = Timer.current_datetime_seconds()
            self.__db.add_bill(bill)
            self.__revenues.reduce(bill["amount"])
            self.__account_transaction_costs(bill)
            return "added"
        return "insufficient"

    def expired(self, expiry: dict) -> None:
        for bill in self.bills:
            if bill["_id"] == expiry["bill_id"]:
                bill["expired"]["status"] = True
                bill["expired"]["details"] = expiry["expired"]
                self.update(bill["_id"], bill)
                break

    def update(self, bill_id: str, bill: dict) -> None:
        self.__db.update_bill(bill_id, bill)

    def remove(self, bill_id: str) -> None:
        bill: dict = self.__db.retrieve_bill(bill_id)
        self.__revenues.increase(bill["amount"])
        self.__remove_transaction_costs(bill)
        self.__db.remove_bill(bill_id)
