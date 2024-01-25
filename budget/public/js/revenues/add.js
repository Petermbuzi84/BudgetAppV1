import Form from "../common/form.js";
import navbarRender from "../common/navbar.js";
import {
  connectToServer,
  connectToServerWithArguments,
} from "../common/server.js";
import { dateToday } from "../common/utilities.js";

let active_source = "";

function formHandler(e) {
  let source = e.target.add_source
    ? e.target.add_source.value
    : e.target.source.value;
  const category = e.target.category.value;
  const month = e.target.month;
  const year = e.target.year;
  const balance = e.target.balance;
  const amount = e.target.amount.value;
  const payment_method = e.target.payment_method.value;
  const transaction_id = e.target.transaction_id;
  const transaction_name = e.target.transaction_name;
  const received =
    e.target.received.value === "" ? dateToday() : e.target.received.value;
  if (source === "") {
    alert("please enter the source name");
  } else if (category === "job" && month.value === "") {
    alert("please enter the month of payment");
  } else if (category === "job" && year.value === "") {
    alert("please enter the year of payment");
  } else if (category === "balance" && balance.value === "") {
    alert("please enter the closing year for the balance");
  } else if (amount === "") {
    alert("please enter the amount");
  } else if (payment_method === "mpesa" && transaction_id.value === "") {
    alert("please enter the transaction id");
  } else if (payment_method === "mpesa" && transaction_name.value === "") {
    alert("please enter the transaction name");
  } else {
    let my_source = source;
    if (category === "job") {
      my_source = `${source} (salary for ${month.value} ${year.value})`;
    } else if (category === "balance") {
      my_source = `${source} - ${balance.value}`;
    }
    const revenue = {
      source: my_source,
      category,
      amount: parseFloat(amount),
      payment: {
        method: payment_method,
        transaction: {
          id: transaction_id ? transaction_id.value : "",
          name: transaction_name ? transaction_name.value : "",
        },
      },
      received,
    };
    connectToServerWithArguments("add_revenue", revenue, () => {
      location = "/revenues";
    });
  }
}

class AddRevenue extends Form {
  constructor(revenues) {
    super();
    this.revenues = revenues;
    this.today = new Date();
  }

  revenueSource(element) {
    const container = document.createElement("div");
    container.classList = "input-container input-source";
    container.style.paddingTop = "10px";
    const label = this.labelElement("revenue-source", "Add Source");
    const input = this.userInput("add_source", "revenue-source", "text");
    container.append(label, input);
    element.append(container);
  }

  getSources() {
    const sources = [];
    this.revenues.forEach((revenue) => {
      let found = false;
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        if (source == revenue.source) {
          found = true;
          break;
        }
      }
      if (!found) {
        sources.push(revenue.source);
      }
    });
    return sources;
  }

  sourceDetails(element) {
    const container = document.createElement("div");
    container.classList = "input-container source-details";
    const label = this.labelElement("revenue", "Source");
    this.revenues.push({ source: "New source" });
    active_source = this.revenues[0];
    const source_names = this.getSources();
    const select = this.selectElement(source_names, "source", "source");
    select.addEventListener("change", (e) => {
      const input_source = document.querySelector(".input-source");
      if (e.target.value === "New source") {
        if (!input_source) {
          const source_details = document.querySelector(".source-details");
          this.revenueSource(source_details);
        }
      } else {
        this.revenues.forEach((revenue) => {
          if (revenue.source === e.target.value) {
            active_source = revenue;
          }
        });
        if (input_source) {
          input_source.remove();
        }
        if (active_source.category && active_source.category === "job") {
          const category = document.getElementById("category");
          category.value = active_source.category;
          const revenue_category_container = document.querySelector(
            ".revenue-category-container"
          );
          this.revenueMonth(revenue_category_container);
          this.revenueYear(revenue_category_container);
        }
      }
    });
    container.append(label, select);
    if (select.value === "New source") {
      this.revenueSource(container);
    }
    element.append(container);
  }

  revenueMonth(element) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month_index = this.today.getMonth();
    const container = document.createElement("div");
    container.classList = "input-container revenue-month-input";
    container.style.paddingTop = "10px";
    const label = this.labelElement("revenue-month", "Month");
    const select = this.selectElement(months, "month", "revenue-month");
    select.value = months[month_index];
    container.append(label, select);
    element.append(container);
  }

  revenueYear(element) {
    const container = document.createElement("div");
    container.classList = "input-container revenue-year-input";
    container.style.paddingTop = "10px";
    const label = this.labelElement("revenue-year", "Year");
    const input = this.userInput("year", "revenue-year", "number");
    input.value = this.today.getFullYear();
    container.append(label, input);
    element.append(container);
  }

  balanceYear(element) {
    const container = document.createElement("div");
    container.classList = "input-container balance-year-input";
    container.style.paddingTop = "10px";
    const label = this.labelElement("balance-year", "Year");
    const input = this.userInput("balance", "balance-year", "number");
    input.value = this.today.getFullYear();
    container.append(label, input);
    element.append(container);
  }

  clearJob() {
    const revenue_month = document.querySelector(".revenue-month-input");
    const revenue_year = document.querySelector(".revenue-year-input");
    if (revenue_month && revenue_year) {
      revenue_month.remove();
      revenue_year.remove();
    }
    const balance_year = document.querySelector(".balance-year-input");
    if (balance_year) {
      balance_year.remove();
    }
  }

  revenueCategory(element) {
    const container = document.createElement("div");
    container.classList = "input-container revenue-category-container";
    const label = this.labelElement("category", "Category");
    const options = [
      { name: "gift", active: false },
      { name: "job", active: false },
      { name: "balance", active: false },
      { name: "loan", active: false },
      { name: "investment", active: false },
    ];
    if (active_source.source !== "New source") {
      options.forEach((option) => {
        if (active_source.category === option.name) {
          option.active = true;
        }
      });
    }
    const select = this.selectElementWithActive(
      options,
      "category",
      "category"
    );
    select.addEventListener("change", (e) => {
      if (e.target.value === "job") {
        this.revenueMonth(container);
        this.revenueYear(container);
      } else if (e.target.value === "balance") {
        this.balanceYear(container);
      } else {
        this.clearJob();
      }
    });
    container.append(label, select);
    if (active_source.category && active_source.category === "job") {
      this.revenueMonth(container);
      this.revenueYear(container);
    } else if (active_source.category && active_source.category === "balance") {
      this.balanceYear(container);
    }
    element.append(container);
  }

  revenueAmount(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("revenue-amount", "Amount");
    const input = this.userInput("amount", "revenue-amount", "number");
    container.append(label, input);
    element.append(container);
  }

  revenueTransactionID(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-id";
    container.style.paddingTop = "10px";
    const label = this.labelElement("revenue-transaction-id", "Transaction ID");
    const input = this.userInput("transaction_id", "transaction-id", "text");
    input.placeholder = "e.g. EF56TGYH78";
    container.append(label, input);
    element.append(container);
  }

  revenueTransactionName(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-name";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "revenue-transaction-name",
      "Transaction Name"
    );
    const input = this.userInput(
      "transaction_name",
      "revenue-transaction-name",
      "text"
    );
    container.append(label, input);
    element.append(container);
  }

  revenuePaymentMethod(element) {
    const payment = document.createElement("div");
    payment.classList = "revenue-payment-method-container";
    const options = ["cash", "mpesa"];
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("payment method", "Payment Method");
    const select = this.selectElement(
      options,
      "payment_method",
      "revenue-payment-method"
    );
    select.addEventListener("change", (e) => {
      const mode = e.target.value;
      if (mode === "mpesa") {
        const payment_method = document.querySelector(
          ".revenue-payment-method-container"
        );
        this.revenueTransactionID(payment_method);
        this.revenueTransactionName(payment_method);
      } else if (mode === "cash") {
        const transaction_id = document.querySelector(".mpesa-transaction-id");
        const transaction_name = document.querySelector(
          ".mpesa-transaction-name"
        );
        if (transaction_id && transaction_name) {
          transaction_id.remove();
          transaction_name.remove();
        }
      }
    });
    container.append(label, select);
    payment.append(container);
    element.append(payment);
  }

  revenueReceived(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("revenue-received", "Received");
    const input = this.userInput("received", "revenue-received", "date");
    input.value = dateToday();
    container.append(label, input);
    element.append(container);
  }

  revenueSubmit(element) {
    element.append(this.formSubmit("submit-revenue", "Add Revenue"));
  }

  render() {
    const wrapper = this.formWrapper();
    const container = this.formContainer(formHandler);
    container.append(this.formTitle("Add Revenue"));
    this.sourceDetails(container);
    this.revenueCategory(container);
    this.revenueAmount(container);
    this.revenuePaymentMethod(container);
    this.revenueReceived(container);
    this.revenueSubmit(container);
    wrapper.append(container);
    return wrapper;
  }
}

function main() {
  const root = document.getElementById("root");
  navbarRender();
  connectToServer("revenues", (revenues) => {
    const add_revenue = new AddRevenue(revenues);
    root.append(add_revenue.render());
  });
}
main();
