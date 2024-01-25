from datetime import datetime, timedelta
from time import strftime, gmtime
from pytz import timezone


class Timer:
    __reduce_day: int = 1

    @staticmethod
    def current_datetime_milliseconds() -> str:
        zone = timezone("Africa/Nairobi")
        return datetime.now(tz=zone).strftime("%Y-%m-%d %H:%M:%S.%f")

    @staticmethod
    def current_datetime_seconds() -> str:
        zone = timezone("Africa/Nairobi")
        return datetime.now(tz=zone).strftime("%Y-%m-%d %H:%M:%S")

    @staticmethod
    def current_date() -> str:
        zone = timezone("Africa/Nairobi")
        return datetime.now(tz=zone).strftime("%Y-%m-%d")

    @staticmethod
    def current_year() -> int:
        zone = timezone("Africa/Nairobi")
        return int(datetime.now(tz=zone).strftime("%Y"))

    @staticmethod
    def current_time() -> str:
        zone = timezone("Africa/Nairobi")
        return datetime.now(tz=zone).strftime("%H:%M:%S")

    @staticmethod
    def convert_string_to_datetime(date_time: str) -> datetime:
        datetime_split: list = date_time.split(" ")
        date_split: list = datetime_split[0].split("-")
        time_split: list = datetime_split[1].split(":")
        return datetime(int(date_split[0]), int(date_split[1]), int(date_split[2]),
                        int(time_split[0]), int(time_split[1]), int(time_split[2]))

    def reduce_date_by_one(self, date_time: str):
        dt: date_time = self.convert_string_to_datetime(date_time)
        reduced_date: datetime = dt - timedelta(days=self.__reduce_day)
        return reduced_date.strftime("%Y-%m-%d")

    @staticmethod
    def convert_time_to_seconds(timestamp: str) -> int:
        timestamp_split: list = timestamp.split(":")
        hours_seconds: int = int(timestamp_split[0]) * 3600
        minutes_seconds: int = int(timestamp_split[1]) * 60
        seconds: int = int(timestamp_split[2])
        return hours_seconds + minutes_seconds + seconds

    @staticmethod
    def convert_seconds_to_time(seconds: int) -> str:
        """
        converts seconds into hours, minutes and seconds
        :param seconds: time in seconds
        :return: time in hours, minutes and seconds
        """
        return strftime("%H:%M:%S", gmtime(seconds))

    @staticmethod
    def convert_datetime_to_nanoseconds(date_time: datetime) -> int:
        return int(datetime.timestamp(date_time)) * 1000000000

    @staticmethod
    def convert_datetime_to_seconds(date_time: datetime) -> int:
        return int(datetime.timestamp(date_time))

    @staticmethod
    def convert_nanoseconds_to_datetime(nanoseconds) -> str:
        date_time = datetime.fromtimestamp(nanoseconds // 1000000000)
        return date_time.strftime('%Y-%m-%d %H:%M:%S')
