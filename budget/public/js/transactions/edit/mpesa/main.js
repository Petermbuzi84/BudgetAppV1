import Form from "../../../common/form.js";
import { connectToServerWithArguments } from "../../../common/server.js";

function formHandler(e) {
  const transaction_id = e.target.transaction_id.value;
  const category = e.target.category.value;
  const transaction_amount = e.target.transaction_amount.value;
  const date = e.target.date.value;
  const hour = e.target.hour.value;
  const minute = e.target.minute.value;
  const meridian = e.target.meridian.value;
  const transaction_name = e.target.transaction_name.value;
  const agent_till = e.target.till.value;
  const agent_store = e.target.store.value;
  const transaction_cost = e.target.transaction_cost.value;
  const transaction_balance = e.target.balance.value;
  if (transaction_id === "") {
    alert("please enter the mpesa transaction id");
  } else if (transaction_amount === "") {
    alert("please enter the mpesa transaction amount");
  } else if (date === "") {
    alert("please enter the date the mpesa transaction occured");
  } else if (hour === "") {
    alert("please enter the hour mpesa transaction occured");
  } else if (minute === "") {
    alert("please enter the minute mpesa transaction occured");
  } else if (meridian === "") {
    alert("please enter the meridian mpesa transaction occured");
  } else if (transaction_name === "") {
    alert("please enter the mpesa transaction amount");
  } else if (agent_till === "") {
    alert("please enter the agent till number");
  } else if (agent_store === "") {
    alert("please enter the agent store number");
  } else if (transaction_cost === "") {
    alert("please enter the mpesa transaction cost");
  } else if (transaction_balance === "") {
    alert("please enter the mpesa balance");
  } else {
    const transaction = {
      _id: transaction_id,
      category,
      amount: parseInt(transaction_amount),
      period: {
        date,
        hour,
        minute,
        meridian,
      },
      agent: {
        name: transaction_name,
        till: agent_till,
        store: agent_store,
      },
      cost: parseInt(transaction_cost),
      balance: parseFloat(transaction_balance),
    };
    connectToServerWithArguments(
      `edit_transaction/${transaction_id}`,
      transaction,
      () => {
        location = "/transactions";
      }
    );
  }
}

export default class EditMPesaTransactions extends Form {
  constructor(transactions) {
    super();
    this.transactions = transactions;
  }

  transactionID(element, id) {
    const container = document.createElement("div");
    container.classList = "input-container";
    container.style.paddingTop = "10px";
    const label = this.labelElement("transaction-id", "ID");
    const input = this.userInput("transaction_id", "transaction-id", "text");
    input.value = id;
    container.append(label, input);
    element.append(container);
  }

  transactionCategory(element, category) {
    const container = document.createElement("div");
    container.classList = "input-container transaction-category-container";
    const label = this.labelElement("category", "Category");
    const options = [
      "withdrawal",
      "paybill",
      "buy goods and services",
      "pochi la biashara",
    ];
    const select = this.selectElement(options, "category", "category");
    select.value = category;
    container.append(label, select);
    element.append(container);
  }

  transactionAmount(element, amount) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("transaction-amount", "Amount");
    const input = this.userInput(
      "transaction_amount",
      "transaction-amount",
      "number"
    );
    input.value = amount;
    container.append(label, input);
    element.append(container);
  }

  transactionAgentTillNumber(element, till) {
    const container = document.createElement("div");
    container.classList = "input-container transaction-input";
    container.style.paddingTop = "10px";
    const label = this.labelElement("transaction-till", "Till Number");
    const input = this.userInput("till", "transaction-till", "number");
    input.value = till;
    container.append(label, input);
    element.append(container);
  }

  transactionAgentStoreNumber(element, store) {
    const container = document.createElement("div");
    container.classList = "input-container transaction-input";
    container.style.paddingTop = "10px";
    const label = this.labelElement("transaction-store", "Store Number");
    const input = this.userInput("store", "transaction-store", "number");
    input.value = store;
    container.append(label, input);
    element.append(container);
  }

  removeTransactionDetails() {
    const transaction_inputs = document.querySelectorAll(".transaction-input");
    transaction_inputs.forEach((transaction) => {
      transaction.remove();
    });
  }

  transactionName(element, name) {
    const container = document.createElement("div");
    container.classList = "input-container transaction-name-container";
    const label = this.labelElement("transaction", "Name");
    const input = this.userInput(
      "transaction_name",
      "transaction-name",
      "text"
    );
    input.value = name;
    container.append(label, input);
    element.append(container);
  }

  transactionAgent(element, agent) {
    this.transactionName(element, agent.name);
    this.transactionAgentTillNumber(element, agent.till);
    this.transactionAgentStoreNumber(element, agent.store);
  }

  transactionCost(element, cost) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("transaction-cost", "Cost");
    const input = this.userInput(
      "transaction_cost",
      "transaction-cost",
      "text"
    );
    input.value = cost;
    container.append(label, input);
    element.append(container);
  }

  transactionDate(element, date) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("transaction-date", "Date");
    const input = this.userInput("date", "transaction-date", "date");
    input.value = date;
    container.append(label, input);
    element.append(container);
  }

  transactionHour(element, hour) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("transaction-hour", "Hour");
    const input = this.userInput("hour", "transaction-hour", "text");
    input.value = hour;
    container.append(label, input);
    element.append(container);
  }

  transactionMinute(element, minute) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("transaction-minute", "Minute");
    const input = this.userInput("minute", "transaction-minute", "text");
    input.value = minute;
    container.append(label, input);
    element.append(container);
  }

  transactionBalance(element, balance) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("transaction-balance", "Balance");
    const input = this.userInput("balance", "transaction-balance", "text");
    input.value = balance;
    container.append(label, input);
    element.append(container);
  }

  transactionMeridian(element, meridian) {
    const meridians = ["AM", "PM"];
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("transaction-meridian", "Meridian");
    const select = this.selectElement(meridians, "meridian", "meridian");
    select.value = meridian;
    container.append(label, select);
    element.append(container);
  }

  transactionTime(element, period) {
    this.transactionHour(element, period.hour);
    this.transactionMinute(element, period.minute);
    this.transactionMeridian(element, period.meridian);
  }

  transactionSubmit(element) {
    element.append(this.formSubmit("submit-transaction", "Update"));
  }

  render(transaction) {
    const edit_wrapper = document.createElement("div");
    edit_wrapper.classList = "transaction-edit-wrapper";
    const close_wrapper = document.createElement("img");
    close_wrapper.src = "images/close.png";
    close_wrapper.alt = "";
    close_wrapper.addEventListener("click", () => {
      edit_wrapper.remove();
    });
    const wrapper = this.formWrapper();
    wrapper.style.height = "100vh";
    const container = this.formContainer(formHandler);
    container.append(this.formTitle("Edit Transaction"));
    this.transactionID(container, transaction._id);
    this.transactionCategory(container, transaction.category);
    this.transactionAmount(container, transaction.amount);
    this.transactionDate(container, transaction.period.date);
    this.transactionTime(container, transaction.period);
    this.transactionAgent(container, transaction.agent);
    this.transactionCost(container, transaction.cost);
    this.transactionBalance(container, transaction.balance);
    this.transactionSubmit(container);
    wrapper.append(container, close_wrapper);
    edit_wrapper.append(wrapper);
    return edit_wrapper;
  }
}
