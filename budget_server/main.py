from flask import Flask, request
from flask_cors import CORS
from revenues import Revenues
from expenses import ProductExpense, TravelExpense
from bills import Bills
from debts import ProductDebts, BillDebts
from investments import Investments
from transactions import MPesaTransactions


app: Flask = Flask(__name__)
CORS(app, supports_credentials=True)
revenues: Revenues = Revenues()
products: ProductExpense = ProductExpense(revenues)
travels: TravelExpense = TravelExpense(revenues)
bills: Bills = Bills(revenues)
product_debts: ProductDebts = ProductDebts(revenues)
bill_debts: BillDebts = BillDebts(revenues)
invest: Investments = Investments(revenues)
mpesa: MPesaTransactions = MPesaTransactions(revenues)


# ================ REVENUES ================
@app.route("/add_revenue", methods=["POST"])
def add_revenue() -> dict:
    source: dict = request.get_json()
    revenues.add(source)
    return {"res": "ok"}


@app.route("/edit_revenue/<string:edit_id>", methods=["POST"])
def edit_revenue(edit_id: str) -> dict:
    updated_revenue = request.get_json()
    revenues.update(edit_id, updated_revenue)
    return {"res": "ok"}


@app.route("/remove_revenue/<string:delete_id>", methods=["GET"])
def remove_revenue(delete_id: str) -> dict:
    revenues.remove(delete_id)
    return {"res": "ok"}


@app.route("/balance")
def revenue_balance() -> dict:
    return {"balance": revenues.balance}


@app.route("/total_revenue")
def total_revenue() -> dict:
    amount, balance = revenues.total_revenues
    return {"amount": amount, "balance": balance}


@app.route("/revenues", methods=["GET"])
def handle_revenues() -> list[dict]:
    return revenues.revenues


# ================ EXPENSES ================
@app.route("/add_expense/product", methods=["POST"])
def add_product_expense() -> dict:
    product: dict = request.get_json()
    status: str = products.add(product)
    return {"status": status}


@app.route("/edit_expense/product/<string:expense_id>", methods=["POST"])
def edit_product_expense(expense_id: str) -> dict:
    expense: dict = request.get_json()
    products.update(expense_id, expense)
    return {"res": "ok"}


@app.route("/remove_expense/product/<string:expense_id>", methods=["GET"])
def remove_product_expense(expense_id: str) -> dict:
    products.remove(expense_id)
    return {"res": "ok"}


@app.route("/expenses/products", methods=["GET"])
def handle_product_expenses() -> list[dict]:
    return products.product_expenses


@app.route("/expenses/products/total", methods=["GET"])
def handle_product_expenses_total() -> dict:
    return {"total": products.total_product_expenses}


@app.route("/add_expense/travel", methods=["POST"])
def add_travel_expense() -> dict:
    travel = request.get_json()
    status: str = travels.add(travel)
    return {"status": status}


@app.route("/edit_expense/travel/<string:expense_id>", methods=["POST"])
def edit_travel_expense(expense_id: str) -> dict:
    expense: dict = request.get_json()
    travels.update(expense_id, expense)
    return {"res": "ok"}


@app.route("/remove_expense/travel/<string:expense_id>", methods=["GET"])
def remove_travel_expense(expense_id: str) -> dict:
    travels.remove(expense_id)
    return {"res": "ok"}


@app.route("/expenses/travels", methods=["GET"])
def handle_travel_expenses() -> list[dict]:
    return travels.travel_expenses


@app.route("/expenses/travels/total", methods=["GET"])
def handle_travel_expenses_total() -> dict:
    return {"total": travels.total_travel_expenses}


# ================ BILLS ================
@app.route("/add_bill", methods=["POST"])
def add_bill() -> dict:
    bill = request.get_json()
    status: str = bills.add(bill)
    return {"status": status}


@app.route("/bill_expired", methods=["POST"])
def bill_expired() -> dict:
    expiry = request.get_json()
    bills.expired(expiry)
    return {"res": "ok"}


@app.route("/edit_bill/<string:edit_id>", methods=["POST"])
def edit_bill(edit_id: str) -> dict:
    updated_bill = request.get_json()
    bills.update(edit_id, updated_bill)
    return {"res": "ok"}


@app.route("/remove_bill/<string:delete_id>", methods=["GET"])
def remove_bill(delete_id: str) -> dict:
    bills.remove(delete_id)
    return {"res": "ok"}


@app.route("/bills", methods=["GET"])
def handle_bills() -> list[dict]:
    return bills.bills


@app.route("/total_bills", methods=["GET"])
def total_bills() -> dict:
    return {"total": bills.total_bills}


# ================ DEBTS ================
@app.route("/add_debt/product", methods=["POST"])
def add_product_debt() -> dict:
    debt = request.get_json()
    product_debts.add(debt)
    return {"status": "ok"}


@app.route("/add_debt/bill", methods=["POST"])
def add_bill_debt() -> dict:
    debt = request.get_json()
    bill_debts.add(debt)
    return {"status": "ok"}


@app.route("/edit_debt/product/<string:edit_id>", methods=["POST"])
def edit_product_debt(edit_id: str) -> dict:
    updated_debt = request.get_json()
    product_debts.update(edit_id, updated_debt)
    return {"res": "ok"}


@app.route("/edit_debt/bill/<string:edit_id>", methods=["POST"])
def edit_bill_debt(edit_id: str) -> dict:
    updated_debt = request.get_json()
    bill_debts.update(edit_id, updated_debt)
    return {"res": "ok"}


@app.route("/remove_debt/product/<string:delete_id>", methods=["GET"])
def remove_product_debt(delete_id: str) -> dict:
    product_debts.remove(delete_id)
    return {"res": "ok"}


@app.route("/remove_debt/bill/<string:delete_id>", methods=["GET"])
def remove_bill_debt(delete_id: str) -> dict:
    bill_debts.remove(delete_id)
    return {"res": "ok"}


@app.route("/debts/products", methods=["GET"])
def handle_product_debts() -> list[dict]:
    return product_debts.debts


@app.route("/debts/products/total", methods=["GET"])
def handle_product_debts_total() -> dict:
    amount, balance = product_debts.total_product_debt
    return {"amount": amount, "balance": balance}


@app.route("/debts/bills", methods=["GET"])
def handle_bill_debts() -> list[dict]:
    return bill_debts.debts


@app.route("/debts/bills/total", methods=["GET"])
def handle_bill_debts_total() -> dict:
    amount, balance = bill_debts.total_bill_debt
    return {"amount": amount, "balance": balance}


@app.route("/pay/product/<string:debt_id>", methods=["POST"])
def pay_product_debt(debt_id: str) -> dict:
    payment: dict = request.get_json()
    status: str = product_debts.pay(debt_id, payment)
    return {"status": status}


@app.route("/pay/bill/<string:debt_id>", methods=["POST"])
def pay_bill_debt(debt_id: str) -> dict:
    payment: dict = request.get_json()
    status: str = bill_debts.pay(debt_id, payment)
    return {"status": status}


# ================ INVESTMENTS ================
@app.route("/investments", methods=["GET"])
def investments() -> list[dict]:
    return invest.investments


@app.route("/total_investments", methods=["GET"])
def handle_total_investments() -> dict:
    return {"total": invest.total_investments}


@app.route("/add_investment", methods=["POST"])
def add_investment() -> dict:
    investment: dict = request.get_json()
    status: str = invest.add(investment)
    return {"status": status}


@app.route("/edit_investment/<string:investment_id>", methods=["POST"])
def edit_investment(investment_id: str) -> dict:
    investment: dict = request.get_json()
    invest.update(investment_id, investment)
    return {"res": "ok"}


@app.route("/remove_investment/<string:investment_id>", methods=["GET"])
def remove_investment(investment_id: str) -> dict:
    invest.remove(investment_id)
    return {"res": "ok"}


@app.route("/pay/investment/<string:investment_id>", methods=["POST"])
def pay_investment(investment_id: str) -> dict:
    investment: dict = request.get_json()
    status: str = invest.pay(investment_id, investment)
    return {"status": status}


# ================ TRANSACTIONS ================
@app.route("/transactions", methods=["GET"])
def handle_transactions() -> list[dict]:
    return mpesa.transactions


@app.route("/total_transactions", methods=["GET"])
def handle_total_transactions() -> dict:
    return {"total": mpesa.total_cost}


@app.route("/add_transaction", methods=["POST"])
def add_transaction() -> dict:
    transaction: dict = request.get_json()
    status: str = mpesa.add(transaction)
    return {"status": status}


@app.route("/edit_transaction/<string:transaction_id>", methods=["POST"])
def edit_transaction(transaction_id: str) -> dict:
    transaction: dict = request.get_json()
    mpesa.update(transaction_id, transaction)
    return {"res": "ok"}


@app.route("/remove_transaction/<string:transaction_id>", methods=["GET"])
def remove_transaction(transaction_id: str) -> dict:
    mpesa.remove(transaction_id)
    return {"res": "ok"}


if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
