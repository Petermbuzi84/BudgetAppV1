from uuid import uuid4
from utilities.timer import Timer


def generated_id() -> str:
    return str(uuid4())[24:] + str(uuid4())[:8]
