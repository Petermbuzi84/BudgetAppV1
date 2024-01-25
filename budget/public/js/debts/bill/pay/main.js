import Form from "../../../common/form.js";
import { connectToServerWithArguments } from "../../../common/server.js";
import { dateToday } from "../../../common/utilities.js";
import BillPaymentsTable from "./payment.js";

function formHandler(e, debt_balance, debt_id) {
  const amount = e.target.debt_payment.value;
  const paid = e.target.debt_paid.value;
  const payment_method = e.target.payment_method.value;
  const transaction_id = e.target.transaction_id;
  const transaction_name = e.target.transaction_name;
  const transaction_cost = e.target.transaction_cost;
  if (amount == "") {
    alert("please enter the amount to pay");
  } else if (parseInt(amount) > debt_balance) {
    alert("set an amount less or equal to the balance");
  } else if (paid === "") {
    alert("please enter the date of payment");
  } else if (payment_method === "mpesa" && transaction_id.value === "") {
    alert("please enter the transaction id");
  } else if (payment_method === "mpesa" && transaction_name.value === "") {
    alert("please enter the transaction name");
  } else if (payment_method === "mpesa" && transaction_cost.value === "") {
    alert("please enter transaction cost");
  } else {
    const payment = {
      debt_id,
      date: paid,
      amount: parseInt(amount),
      transaction: {
        method: payment_method,
        id: transaction_id ? transaction_id.value : "",
        name: transaction_name ? transaction_name.value : "",
        cost: transaction_cost ? parseInt(transaction_cost.value) : 0,
      },
    };
    connectToServerWithArguments(
      `pay/bill/${debt_id}`,
      payment,
      ({ status }) => {
        if (status === "paid") {
          location = "/debts";
        } else {
          alert("there is insufficient funds to complete the transaction");
        }
      }
    );
  }
}

export default class PayBillDebt extends Form {
  constructor() {
    super();
  }

  debtDetails(element, debt) {
    const container = document.createElement("div");
    container.classList = "pay-debt-container";
    const service_name = document.createElement("div");
    service_name.classList = "debt-service-name";
    service_name.textContent = debt.service;
    const provider = document.createElement("div");
    provider.classList = "debt-provider";
    provider.textContent = debt.provider;
    const amount = document.createElement("div");
    amount.classList = "debt-amount";
    container.append(service_name, provider);
    if (debt.payment.status === "pending") {
      amount.textContent = `KSh ${debt.payment.balance}`;
      container.append(amount);
    } else if (debt.payment.status === "completed") {
      amount.textContent = `KSh ${debt.amount}`;
      container.append(amount);
    }
    element.append(container);
  }

  debtNextPayment(element, debt) {
    const container = document.createElement("div");
    container.classList = "input-container";
    container.style.paddingTop = "10px";
    const label = this.labelElement("debt-payment", "Amount");
    const input = this.userInput("debt_payment", "debt-payment", "number");
    input.value = debt.amount;
    container.append(label, input);
    element.append(container);
  }

  debtTransactionID(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-id";
    container.style.paddingTop = "10px";
    const label = this.labelElement("debt-transaction-id", "Transaction ID");
    const input = this.userInput("transaction_id", "transaction-id", "text");
    input.placeholder = "e.g. EF56TGYH78";
    container.append(label, input);
    element.append(container);
  }

  debtTransactionName(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-name";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "debt-transaction-name",
      "Transaction Name"
    );
    const input = this.userInput(
      "transaction_name",
      "debt-transaction-name",
      "text"
    );
    container.append(label, input);
    element.append(container);
  }

  debtTransactionCost(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-cost";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "debt-transaction-cost",
      "Transaction Cost"
    );
    const input = this.userInput(
      "transaction_cost",
      "debt-transaction-cost",
      "text"
    );
    container.append(label, input);
    element.append(container);
  }

  debtPaymentMethod(element) {
    const payment = document.createElement("div");
    payment.classList = "debt-payment-method-container";
    const options = ["cash", "mpesa"];
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("payment method", "Payment Method");
    const select = this.selectElement(
      options,
      "payment_method",
      "debt-payment-method"
    );
    select.addEventListener("change", (e) => {
      const mode = e.target.value;
      if (mode === "mpesa") {
        const payment_method = document.querySelector(
          ".debt-payment-method-container"
        );
        this.debtTransactionID(payment_method);
        this.debtTransactionName(payment_method);
        this.debtTransactionCost(payment_method);
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
    payment.append(container);
    element.append(payment);
  }

  debtPaid(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-paid", "Paid");
    const input = this.userInput("debt_paid", "debt-paid", "date");
    input.value = dateToday();
    container.append(label, input);
    element.append(container);
  }

  debtSubmit(element) {
    element.append(this.formSubmit("submit-debt", "Pay"));
  }

  styleFormWrapper(wrapper) {
    wrapper.style.height = "100vh";
    wrapper.style.justifyContent = "center";
  }

  debtLastPayments(element, debt) {
    const payments_table = new BillPaymentsTable(debt.payment.last_payment);
    const last_payment_container = document.createElement("div");
    last_payment_container.classList = "last-payment-container";
    if (debt.payment.status === "completed") {
      last_payment_container.style.width = "100%";
    }
    const last_payment_title = document.createElement("div");
    last_payment_title.classList = "last-payment-title";
    last_payment_title.textContent = "Payment History";
    const last_payment_list = document.createElement("div");
    last_payment_list.classList = "last-payment-list";
    last_payment_list.append(payments_table.render());
    last_payment_container.append(last_payment_title, last_payment_list);
    element.append(last_payment_container);
  }

  debtForm(element, debt) {
    const payment_form = document.createElement("div");
    payment_form.classList = "debt-payment-form";
    this.debtNextPayment(payment_form, debt);
    this.debtPaymentMethod(payment_form);
    this.debtPaid(payment_form);
    this.debtSubmit(payment_form);
    element.append(payment_form);
  }

  debtPaymentForm(element, debt) {
    const payment_form = document.createElement("div");
    payment_form.classList = "debt-payment-form-container";
    this.debtLastPayments(payment_form, debt);
    if (debt.payment.status === "pending") {
      this.debtForm(payment_form, debt);
    }
    element.append(payment_form);
  }

  render(debt) {
    const edit_wrapper = document.createElement("div");
    edit_wrapper.classList = "debt-edit-wrapper";
    const wrapper = this.formWrapper();
    this.styleFormWrapper(wrapper);
    const close_wrapper = document.createElement("img");
    close_wrapper.src = "images/close.png";
    close_wrapper.alt = "";
    close_wrapper.addEventListener("click", () => {
      edit_wrapper.remove();
    });
    const container = this.formContainer((e) =>
      formHandler(e, debt.payment.balance, debt._id)
    );
    container.append(this.formTitle("Debt Payment"));
    this.debtDetails(container, debt);
    this.debtPaymentForm(container, debt);
    wrapper.append(container, close_wrapper);
    edit_wrapper.append(wrapper);
    return edit_wrapper;
  }
}
