import Form from "../common/form.js";
import { connectToServerWithArguments } from "../common/server.js";

function formHandler(e, revenue_id) {
  let source = e.target.revenue_source.value;
  const category = e.target.category.value;
  const month = e.target.month;
  const year = e.target.year;
  const amount = e.target.amount.value;
  const payment_method = e.target.payment_method.value;
  const transaction_id = e.target.transaction_id;
  const transaction_name = e.target.transaction_name;
  const received = e.target.received.value;
  if (source === "") {
    alert("please enter the source name");
  } else if (category === "job" && month.value === "") {
    alert("please enter the month of payment");
  } else if (category === "job" && year.value === "") {
    alert("please enter the year of payment");
  } else if (amount === "") {
    alert("please enter the amount");
  } else if (payment_method === "mpesa" && transaction_id.value === "") {
    alert("please enter the transaction id");
  } else if (payment_method === "mpesa" && transaction_name.value === "") {
    alert("please enter the transaction name");
  } else {
    const revenue = {
      _id: revenue_id,
      source:
        category === "job"
          ? `${source} (salary for ${month.value} ${year.value})`
          : source,
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
    connectToServerWithArguments(`edit_revenue/${revenue_id}`, revenue, () => {
      location = "/revenues";
    });
  }
}

export default class EditRevenue extends Form {
  jobSourceName(revenue) {
    const source_split_brackets = revenue.source.split("(");
    return source_split_brackets[0];
  }

  jobMonthYear(revenue) {
    const source_split_brackets = revenue.source.split("(");
    const source_dates = source_split_brackets[
      source_split_brackets.length - 1
    ].replace(")", "");
    const source_split_spaces = source_dates.split(" ");
    const job_month = source_split_spaces[source_split_spaces.length - 2];
    const job_year = source_split_spaces[source_split_spaces.length - 1];
    return { month: job_month, year: job_year };
  }

  sourceDetails(element, revenue) {
    const container = document.createElement("div");
    container.classList = "input-container source-details";
    const label = this.labelElement("revenue", "Source");
    const input = this.userInput("revenue_source", "revenue-source", "text");
    if (revenue.category === "job") {
      input.value = this.jobSourceName(revenue);
    } else {
      input.value = revenue.source;
    }
    container.append(label, input);
    element.append(container);
  }

  revenueMonthWithActive(element, revenue) {
    const months = [
      { name: "January", active: false },
      { name: "February", active: false },
      { name: "March", active: false },
      { name: "April", active: false },
      { name: "May", active: false },
      { name: "June", active: false },
      { name: "July", active: false },
      { name: "August", active: false },
      { name: "September", active: false },
      { name: "October", active: false },
      { name: "November", active: false },
      { name: "December", active: false },
    ];
    const container = document.createElement("div");
    container.classList = "input-container revenue-month-input";
    container.style.paddingTop = "10px";
    const label = this.labelElement("revenue-month", "Month");
    const active_period = this.jobMonthYear(revenue);
    months.forEach((month) => {
      if (month.name === active_period.month) {
        month.active = true;
      }
    });
    const select = this.selectElementWithActive(
      months,
      "month",
      "revenue-month"
    );
    container.append(label, select);
    element.append(container);
  }

  revenueYearWithActive(element, revenue) {
    const container = document.createElement("div");
    container.classList = "input-container revenue-year-input";
    container.style.paddingTop = "10px";
    const label = this.labelElement("revenue-year", "Year");
    const active_period = this.jobMonthYear(revenue);
    const input = this.userInput("year", "revenue-year", "number");
    input.value = active_period.year;
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
  }

  revenueCategory(element, revenue) {
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
    options.forEach((option) => {
      if (option.name === revenue.category) {
        option.active = true;
      }
    });
    const select = this.selectElementWithActive(
      options,
      "category",
      "category"
    );
    select.addEventListener("change", (e) => {
      if (e.target.value === options[1].name) {
        this.revenueMonthWithActive(container, revenue);
        this.revenueYearWithActive(container, revenue);
      } else {
        this.clearJob();
      }
    });
    container.append(label, select);
    if (revenue.category === "job") {
      this.revenueMonthWithActive(container, revenue);
      this.revenueYearWithActive(container, revenue);
    }
    element.append(container);
  }

  revenueAmount(element, amount) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("revenue-amount", "Amount");
    const input = this.userInput("amount", "revenue-amount", "number");
    input.value = amount;
    container.append(label, input);
    element.append(container);
  }

  revenueTransactionID(element, transaction_id) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-id";
    container.style.paddingTop = "10px";
    const label = this.labelElement("revenue-transaction-id", "Transaction ID");
    const input = this.userInput("transaction_id", "transaction-id", "text");
    input.placeholder = "e.g. EF56TGYH78";
    input.value = transaction_id;
    container.append(label, input);
    element.append(container);
  }

  revenueTransactionName(element, transaction_name) {
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
    input.value = transaction_name;
    container.append(label, input);
    element.append(container);
  }

  revenuePaymentMethod(element, revenue) {
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
    select.value = revenue.payment.method;
    select.addEventListener("change", (e) => {
      const mode = e.target.value;
      if (mode === "mpesa") {
        const payment_method = document.querySelector(
          ".revenue-payment-method-container"
        );
        this.revenueTransactionID(
          payment_method,
          revenue.payment.transaction.id
        );
        this.revenueTransactionName(
          payment_method,
          revenue.payment.transaction.name
        );
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
    if (revenue.payment.method === "mpesa") {
      this.revenueTransactionID(payment, revenue.payment.transaction.id);
      this.revenueTransactionName(payment, revenue.payment.transaction.name);
    }
    element.append(payment);
  }

  revenueReceived(element, received) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("revenue-received", "Received");
    const input = this.userInput("received", "revenue-received", "date");
    input.value = received;
    container.append(label, input);
    element.append(container);
  }

  revenueSubmit(element) {
    element.append(this.formSubmit("submit-revenue", "Update Revenue"));
  }

  styleFormWrapper(wrapper) {
    wrapper.style.height = "100vh";
    wrapper.style.justifyContent = "center";
  }

  render(revenue) {
    const edit_wrapper = document.createElement("div");
    edit_wrapper.classList = "revenue-edit-wrapper";
    const close_wrapper = document.createElement("img");
    close_wrapper.src = "images/close.png";
    close_wrapper.alt = "";
    close_wrapper.addEventListener("click", () => {
      edit_wrapper.remove();
    });
    const wrapper = this.formWrapper();
    this.styleFormWrapper(wrapper);
    const container = this.formContainer((e) => formHandler(e, revenue._id));
    container.append(this.formTitle("Edit Revenue"));
    this.sourceDetails(container, revenue);
    this.revenueCategory(container, revenue);
    this.revenueAmount(container, revenue.amount);
    this.revenuePaymentMethod(container, revenue);
    this.revenueReceived(container, revenue.received);
    this.revenueSubmit(container);
    wrapper.append(container, close_wrapper);
    edit_wrapper.append(wrapper);
    return edit_wrapper;
  }
}
