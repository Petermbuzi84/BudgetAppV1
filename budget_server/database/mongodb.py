import sys
from pymongo import MongoClient
from utilities import Timer


class MongoDB:
    __route: str = "mongodb://localhost:27017"

    def __init__(self):
        self._year: int = self.__get_year
        self._client: MongoClient = MongoClient(self.__route)

    @property
    def __get_year(self) -> int:
        year: int = Timer.current_year()
        for arg in sys.argv:
            if arg.__contains__("="):
                arg_split: list[str] = arg.split("=")
                left: str = arg_split[0]
                if left == "year":
                    right: str = arg_split[1]
                    if right.isdigit():
                        year = int(right)
                        break
        return year
