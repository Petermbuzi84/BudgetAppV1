import Form from "../../../common/form.js";
import navbarRender from "../../../common/navbar.js";
import {
  connectToServer,
  connectToServerWithArguments,
} from "../../../common/server.js";
import { dateToday, timeNow } from "../../../common/utilities.js";

let active_agent = {};

function formHandler(e) {
  const transaction_id = e.target.transaction_id.value;
  const category = e.target.category.value;
  const transaction_amount = e.target.transaction_amount.value;
  const date = e.target.date.value;
  const hour = e.target.hour.value;
  const minute = e.target.minute.value;
  const meridian = e.target.meridian.value;
  const transaction_name = e.target.add_name
    ? e.target.add_name.value
    : e.target.transaction_name.value;
  const agent_till = e.target.add_till
    ? e.target.add_till.value
    : active_agent.till;
  const agent_store = e.target.add_store
    ? e.target.add_store.value
    : active_agent.store;
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
      "add_transaction",
      transaction,
      ({ status }) => {
        if (status === "added") {
          location = "/transactions";
        } else {
          alert("there is insufficient funds to complete this transaction");
        }
      }
    );
  }
}

class AddMPesaTransactions extends Form {
  constructor(transactions) {
    super();
    this.transactions = transactions;
  }

  transactionID(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    container.style.paddingTop = "10px";
    const label = this.labelElement("transaction-id", "ID");
    const input = this.userInput("transaction_id", "transaction-id", "text");
    container.append(label, input);
    element.append(container);
  }

  transactionCategory(element) {
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
    container.append(label, select);
    element.append(container);
  }

  transactionAmount(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("transaction-amount", "Amount");
    const input = this.userInput(
      "transaction_amount",
      "transaction-amount",
      "number"
    );
    container.append(label, input);
    element.append(container);
  }

  transactionAddName(element) {
    const container = document.createElement("div");
    container.classList = "input-container transaction-input";
    container.style.paddingTop = "10px";
    const label = this.labelElement("add-transaction-name", "Add Name");
    const input = this.userInput("add_name", "add-transaction-name", "text");
    container.append(label, input);
    element.append(container);
  }

  transactionAgentTillNumber(element, user_input, agent = {}) {
    const container = document.createElement("div");
    container.classList = "input-container transaction-input";
    container.style.paddingTop = "10px";
    if (user_input) {
      const label = this.labelElement("add-transaction-till", "Add Till");
      const input = this.userInput("add_till", "add-transaction-till", "text");
      container.append(label, input);
    } else {
      const label = this.labelElement("transaction-till", "Till");
      const div = document.createElement("div");
      div.classList = "input-div till";
      div.textContent = agent.till;
      container.append(label, div);
    }
    element.append(container);
  }

  transactionAgentStoreNumber(element, user_input, agent) {
    const container = document.createElement("div");
    container.classList = "input-container transaction-input";
    container.style.paddingTop = "10px";
    if (user_input) {
      const label = this.labelElement("add-transaction-store", "Add Store");
      const input = this.userInput(
        "add_store",
        "add-transaction-store",
        "text"
      );
      container.append(label, input);
    } else {
      const label = this.labelElement("transaction-store", "Store");
      const div = document.createElement("div");
      div.classList = "input-div store";
      div.textContent = agent.store;
      container.append(label, div);
    }
    element.append(container);
  }

  removeTransactionDetails() {
    const transaction_inputs = document.querySelectorAll(".transaction-input");
    transaction_inputs.forEach((transaction) => {
      transaction.remove();
    });
  }

  getAgents(local_transactions) {
    const agents = [];
    local_transactions.forEach((transaction) => {
      let found = false;
      for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        if (agent.name == transaction.agent.name) {
          found = true;
          break;
        }
      }
      if (!found) {
        agents.push(transaction.agent);
      }
    });
    return agents;
  }

  transactionName(element) {
    const container = document.createElement("div");
    container.classList = "input-container transaction-name-container";
    const label = this.labelElement("transaction", "Name");
    const local_transactions = this.getAgents(this.transactions);
    local_transactions.push({ name: "New name" });
    active_agent = local_transactions[0];
    const transaction_names = local_transactions.map(
      (transaction) => transaction.name
    );
    const select = this.selectElement(
      transaction_names,
      "transaction_name",
      "transaction-name"
    );
    select.addEventListener("change", (e) => {
      this.removeTransactionDetails();
      if (e.target.value === "New name") {
        this.transactionAddName(container);
        this.transactionAgentTillNumber(container, true);
        this.transactionAgentStoreNumber(container, true);
      } else {
        local_transactions.forEach((transaction) => {
          if (transaction.name === e.target.value) {
            active_agent = transaction;
          }
        });
        this.transactionAgentTillNumber(container, false, active_agent);
        this.transactionAgentStoreNumber(container, false, active_agent);
      }
    });
    container.append(label, select);
    if (select.value === "New name") {
      this.transactionAddName(container);
      this.transactionAgentTillNumber(container, true);
      this.transactionAgentStoreNumber(container, true);
    } else {
      this.transactionAgentTillNumber(container, false, active_agent);
      this.transactionAgentStoreNumber(container, false, active_agent);
    }
    element.append(container);
  }

  transactionCost(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("transaction-cost", "Cost");
    const input = this.userInput(
      "transaction_cost",
      "transaction-cost",
      "text"
    );
    container.append(label, input);
    element.append(container);
  }

  transactionDate(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("transaction-date", "Date");
    const input = this.userInput("date", "transaction-date", "date");
    input.value = dateToday();
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

  transactionBalance(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("transaction-balance", "Balance");
    const input = this.userInput("balance", "transaction-balance", "text");
    container.append(label, input);
    element.append(container);
  }

  transactionMeridian(element) {
    const meridians = ["AM", "PM"];
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("transaction-meridian", "Meridian");
    const input = this.selectElement(meridians, "meridian", "meridian");
    container.append(label, input);
    element.append(container);
  }

  transactionTime(element) {
    const time = timeNow();
    const time_split = time.split(":");
    this.transactionHour(element, time_split[0]);
    this.transactionMinute(element, time_split[1]);
    this.transactionMeridian(element);
  }

  transactionSubmit(element) {
    element.append(this.formSubmit("submit-transaction", "Add"));
  }

  render() {
    const wrapper = this.formWrapper();
    const container = this.formContainer(formHandler);
    container.append(this.formTitle("Add Transaction"));
    this.transactionID(container);
    this.transactionCategory(container);
    this.transactionAmount(container);
    this.transactionDate(container);
    this.transactionTime(container);
    this.transactionName(container);
    this.transactionCost(container);
    this.transactionBalance(container);
    this.transactionSubmit(container);
    wrapper.append(container);
    return wrapper;
  }
}

function main() {
  navbarRender();
  const main = document.querySelector("main");
  connectToServer("transactions", (transactions) => {
    const add_transaction = new AddMPesaTransactions(transactions);
    main.append(add_transaction.render());
  });
}
main();
