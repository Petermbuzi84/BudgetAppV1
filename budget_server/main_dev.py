from datetime import datetime, timedelta
from utilities import Timer


if __name__ == '__main__':
    timer: Timer = Timer()
    paid: str = timer.current_datetime_seconds()
    paid_datetime: datetime = timer.convert_string_to_datetime(paid)
    expired: str = "2024-02-01 00:00:00"
    expired_datetime: datetime = timer.convert_string_to_datetime(expired)
    print(paid_datetime)
    print(expired_datetime)
    difference: str = str(expired_datetime - paid_datetime)
    difference_split: list[str] = difference.split(", ")
    days: str = difference_split[0]
    time_split: list[str] = difference_split[1].split(":")
