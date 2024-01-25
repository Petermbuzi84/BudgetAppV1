import { connectToServerWithArguments } from "../../common/server.js";
import { dateToday } from "../../common/utilities.js";
import Form from "../../common/form.js";
import InvestmentsPaymentsTable from "./payments.js";

function formHandler(e, investment_id) {
  const amount = e.target.investment_payment.value;
  const paid = e.target.investment_paid.value;
  const payment_method = e.target.payment_method.value;
  const transaction_id = e.target.transaction_id;
  const transaction_name = e.target.transaction_name;
  const transaction_cost = e.target.transaction_cost;
  if (amount == "") {
    alert("please enter the amount to pay");
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
      amount: parseInt(amount),
      date: paid,
      payment: {
        method: payment_method,
        transaction: {
          id: transaction_id ? transaction_id.value : "",
          name: transaction_name ? transaction_name.value : "",
          cost: transaction_cost ? parseInt(transaction_cost.value) : 0,
        },
      },
    };
    connectToServerWithArguments(
      `pay/investment/${investment_id}`,
      payment,
      ({ status }) => {
        if (status === "added") {
          location = "/investments";
        } else {
          alert("there is insufficient funds to complete the transaction");
        }
      }
    );
  }
}

export default class PayInvestment extends Form {
  constructor() {
    super();
  }

  investmentDetails(element, investment) {
    const container = document.createElement("div");
    container.classList = "pay-investment-container";
    const business = document.createElement("div");
    business.classList = "investment-business";
    business.textContent = investment.business;
    const product = document.createElement("div");
    product.classList = "investment-product";
    product.textContent = investment.product;
    const amount = document.createElement("div");
    amount.classList = "investment-amount";
    amount.textContent = `KSh ${investment.total}`;
    container.append(business, product, amount);
    element.append(container);
  }

  investmentNextPayment(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    container.style.paddingTop = "10px";
    const label = this.labelElement("investment-payment", "Amount");
    const input = this.userInput(
      "investment_payment",
      "investment-payment",
      "number"
    );
    container.append(label, input);
    element.append(container);
  }

  investmentTransactionID(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-id";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "investment-transaction-id",
      "Transaction ID"
    );
    const input = this.userInput("transaction_id", "transaction-id", "text");
    input.placeholder = "e.g. EF56TGYH78";
    container.append(label, input);
    element.append(container);
  }

  investmentTransactionName(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-name";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "investment-transaction-name",
      "Transaction Name"
    );
    const input = this.userInput(
      "transaction_name",
      "investment-transaction-name",
      "text"
    );
    container.append(label, input);
    element.append(container);
  }

  investmentTransactionCost(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-cost";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "investment-transaction-cost",
      "Transaction Cost"
    );
    const input = this.userInput(
      "transaction_cost",
      "investment-transaction-cost",
      "text"
    );
    container.append(label, input);
    element.append(container);
  }

  investmentPaymentMethod(element) {
    const payment = document.createElement("div");
    payment.classList = "investment-payment-method-container";
    const options = ["cash", "mpesa"];
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("payment method", "Payment Method");
    const select = this.selectElement(
      options,
      "payment_method",
      "investment-payment-method"
    );
    select.addEventListener("change", (e) => {
      const mode = e.target.value;
      if (mode === "mpesa") {
        const payment_method = document.querySelector(
          ".investment-payment-method-container"
        );
        this.investmentTransactionID(payment_method);
        this.investmentTransactionName(payment_method);
        this.investmentTransactionCost(payment_method);
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

  investmentPaid(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("investment-paid", "Paid");
    const input = this.userInput("investment_paid", "investment-paid", "date");
    input.value = dateToday();
    container.append(label, input);
    element.append(container);
  }

  investmentSubmit(element) {
    element.append(this.formSubmit("submit-investment", "Pay"));
  }

  styleFormWrapper(wrapper) {
    wrapper.style.height = "100vh";
    wrapper.style.justifyContent = "center";
  }

  investmentLastPayments(element, investment) {
    const payments_table = new InvestmentsPaymentsTable(investment.investments);
    const last_payment_container = document.createElement("div");
    last_payment_container.classList = "last-payment-container";
    const last_payment_title = document.createElement("div");
    last_payment_title.classList = "last-payment-title";
    last_payment_title.textContent = "Payment History";
    const last_payment_list = document.createElement("div");
    last_payment_list.classList = "last-payment-list";
    last_payment_list.append(payments_table.render());
    last_payment_container.append(last_payment_title, last_payment_list);
    element.append(last_payment_container);
  }

  investmentForm(element, investment) {
    const payment_form = document.createElement("div");
    payment_form.classList = "investment-payment-form";
    this.investmentNextPayment(payment_form, investment);
    this.investmentPaymentMethod(payment_form);
    this.investmentPaid(payment_form);
    this.investmentSubmit(payment_form);
    element.append(payment_form);
  }

  investmentPaymentForm(element, investment) {
    const payment_form = document.createElement("div");
    payment_form.classList = "investment-payment-form-container";
    this.investmentLastPayments(payment_form, investment);
    this.investmentForm(payment_form, investment);
    element.append(payment_form);
  }

  render(investment) {
    const edit_wrapper = document.createElement("div");
    edit_wrapper.classList = "investment-edit-wrapper";
    const wrapper = this.formWrapper();
    this.styleFormWrapper(wrapper);
    const close_wrapper = document.createElement("img");
    close_wrapper.src = "images/close.png";
    close_wrapper.alt = "";
    close_wrapper.addEventListener("click", () => {
      edit_wrapper.remove();
    });
    const container = this.formContainer((e) => formHandler(e, investment._id));
    container.append(this.formTitle("Investment Payment"));
    this.investmentDetails(container, investment);
    this.investmentPaymentForm(container, investment);
    wrapper.append(container, close_wrapper);
    edit_wrapper.append(wrapper);
    return edit_wrapper;
  }
}
