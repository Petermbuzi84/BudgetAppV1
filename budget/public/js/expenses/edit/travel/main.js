import Form from "../../../common/form.js";
import { connectToServerWithArguments } from "../../../common/server.js";
import { dateToday } from "../../../common/utilities.js";

function formHandler(e, travel_id) {
  const travel_from = e.target.travel_from.value;
  const travel_to = e.target.travel_to.value;
  const amount = e.target.amount.value;
  const provider = e.target.provider.value;
  const payment_method = e.target.payment_method.value;
  const transaction_id = e.target.transaction_id;
  const transaction_name = e.target.transaction_name;
  const transaction_cost = e.target.transaction_cost;
  const travelled = e.target.travelled.value;
  if (travel_from === "") {
    alert("please enter destination travelled from");
  } else if (travel_to === "") {
    alert("please enter the destination travelled to");
  } else if (amount === "") {
    alert("please enter the amount paid for the travel");
  } else if (payment_method === "mpesa" && transaction_id.value === "") {
    alert("please enter the transaction id");
  } else if (payment_method === "mpesa" && transaction_name.value === "") {
    alert("please enter transaction name");
  } else if (payment_method === "mpesa" && transaction_cost.value === "") {
    alert("please enter transaction cost");
  } else if (travelled === "") {
    alert("please enter the date travelled");
  } else {
    const expense = {
      _id: travel_id,
      travel_from,
      travel_to,
      amount: parseInt(amount),
      provider: provider.toUpperCase(),
      payment: {
        method: payment_method,
        transaction: {
          id: transaction_id ? transaction_id.value : "",
          name: transaction_name ? transaction_name.value : "",
          cost: transaction_cost ? transaction_cost.value : "",
        },
      },
      travelled,
    };
    connectToServerWithArguments(
      "add_expense/travel",
      expense,
      ({ status }) => {
        if (status === "added") {
          location = "/expenses";
        } else if (status === "insufficient") {
          alert("insufficient funds to pay for the expense");
        }
      }
    );
  }
}

export default class EditTavelExpense extends Form {
  constructor(expenses) {
    super();
    this.expenses = expenses;
  }

  expenseTravelFrom(element, travel_from) {
    const container = document.createElement("div");
    container.classList = "input-container expense-travel-from-container";
    const label = this.labelElement("travel_from", "Travel From");
    const input = this.userInput("travel_from", "travel-from", "text");
    input.value = travel_from;
    container.append(label, input);
    element.append(container);
  }

  expenseTravelTo(element, travel_to) {
    const container = document.createElement("div");
    container.classList = "input-container expense-travel-to-container";
    const label = this.labelElement("travel_to", "Travel To");
    const input = this.userInput("travel_to", "travel-to", "text");
    input.value = travel_to;
    container.append(label, input);
    element.append(container);
  }

  expenseTravelAmount(element, amount) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("expense-amount", "Amount");
    const input = this.userInput("amount", "expense-amount", "number");
    input.value = amount;
    container.append(label, input);
    element.append(container);
  }

  expenseProvider(element, provider) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("expense-provider", "Provider");
    const input = this.userInput("provider", "expense-provider", "text");
    input.value = provider;
    container.append(label, input);
    element.append(container);
  }

  expenseTransactionID(element, id) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-id";
    container.style.paddingTop = "10px";
    const label = this.labelElement("expense-transaction-id", "Transaction ID");
    const input = this.userInput("transaction_id", "transaction-id", "text");
    input.placeholder = "e.g. EF56TGYH78";
    input.value = id;
    container.append(label, input);
    element.append(container);
  }

  expenseTransactionName(element, name) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-name";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "expense-transaction-name",
      "Transaction Name"
    );
    const input = this.userInput(
      "transaction_name",
      "expense-transaction-name",
      "text"
    );
    input.value = name;
    container.append(label, input);
    element.append(container);
  }

  expenseTransactionCost(element, cost) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-cost";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "expense-transaction-cost",
      "Transaction Cost"
    );
    const input = this.userInput(
      "transaction_cost",
      "expense-transaction-cost",
      "number"
    );
    input.value = cost;
    container.append(label, input);
    element.append(container);
  }

  expensePaymentMethod(element, payment) {
    const payment_element = document.createElement("div");
    payment_element.classList = "expense-payment-method-container";
    const options = ["cash", "mpesa"];
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("payment method", "Payment Method");
    const select = this.selectElement(
      options,
      "payment_method",
      "expense-payment-method"
    );
    select.value = payment.method;
    select.addEventListener("change", (e) => {
      const mode = e.target.value;
      if (mode === "mpesa") {
        const payment_method = document.querySelector(
          ".expense-payment-method-container"
        );
        this.expenseTransactionID(payment_method, payment.transaction.id);
        this.expenseTransactionName(payment_method, payment.transaction.name);
        this.expenseTransactionCost(payment_method, payment.transaction.cost);
      } else if (mode === "cash") {
        const transaction_id = document.querySelector(".mpesa-transaction-id");
        const transaction_name = document.querySelector(
          ".mpesa-transaction-name"
        );
        const transaction_cost = document.querySelector(
          ".mpesa-transaction-cost"
        );
        if (transaction_id) {
          transaction_id.remove();
          transaction_name.remove();
          transaction_cost.remove();
        }
      }
    });
    container.append(label, select);
    payment_element.append(container);
    element.append(payment_element);
  }

  expensePaid(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("expense-paid", "Paid");
    const input = this.userInput("travelled", "expense-paid", "date");
    input.value = dateToday();
    container.append(label, input);
    element.append(container);
  }

  expenseSubmit(element) {
    element.append(this.formSubmit("submit-expense", "Add Travel Expense"));
  }

  render(travel) {
    const wrapper = this.formWrapper();
    const container = this.formContainer((e) => formHandler(e, travel._id));
    container.append(this.formTitle("Edit Travel Expense"));
    this.expenseTravelFrom(container, travel.travel_from);
    this.expenseTravelTo(container, travel.travel_to);
    this.expenseTravelAmount(container, travel.amount);
    this.expenseProvider(container, travel.provider);
    this.expensePaymentMethod(container, travel.payment);
    this.expensePaid(container, travel.paid);
    this.expenseSubmit(container);
    wrapper.append(container);
    return wrapper;
  }
}
