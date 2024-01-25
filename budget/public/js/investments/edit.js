import Form from "../common/form.js";

function formHandler(e, investment_id) {}

export default class EditInvestment extends Form {
  businessDetails(element, business) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("business", "Business");
    const input = this.userInput("business", "business", "text");
    input.value = business;
    container.append(label, input);
    element.append(container);
  }

  productDetails(element, product) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("product", "Product");
    const input = this.userInput("product", "product", "text");
    input.value = product;
    container.append(label, input);
    element.append(container);
  }

  investmentAmount(element, price) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("investment-amount", "Amount");
    const input = this.userInput("amount", "investment-amount", "number");
    input.value = price;
    container.append(label, input);
    element.append(container);
  }

  investmentTransactionID(element, id) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-id";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "investment-transaction-id",
      "Transaction ID"
    );
    const input = this.userInput("transaction_id", "transaction-id", "text");
    input.value = id;
    input.placeholder = "e.g. EF56TGYH78";
    container.append(label, input);
    element.append(container);
  }

  investmentTransactionName(element, name) {
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
    input.value = name;
    container.append(label, input);
    element.append(container);
  }

  investmentTransactionCost(element, cost) {
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
    input.value = cost;
    container.append(label, input);
    element.append(container);
  }

  investmentPaymentMethod(element, payment) {
    const payment_element = document.createElement("div");
    payment_element.classList = "investment-payment-method-container";
    const options = ["cash", "mpesa"];
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("payment method", "Payment Method");
    const select = this.selectElement(
      options,
      "payment_method",
      "investment-payment-method"
    );
    select.value = payment.method;
    select.addEventListener("change", (e) => {
      const mode = e.target.value;
      if (mode === "mpesa") {
        const payment_method = document.querySelector(
          ".investment-payment-method-container"
        );
        this.investmentTransactionID(payment_method, payment.transaction.id);
        this.investmentTransactionName(
          payment_method,
          payment.transaction.name
        );
        this.investmentTransactionCost(
          payment_method,
          payment.transaction.cost
        );
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

  investmentMade(element, date) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("investment-made", "Investment Made");
    const input = this.userInput("made", "investment-made", "date");
    input.value = date;
    container.append(label, input);
    element.append(container);
  }

  investmentSubmit(element) {
    element.append(this.formSubmit("submit-investment", "Update"));
  }

  styleFormWrapper(wrapper) {
    wrapper.style.height = "100vh";
  }

  render(investment) {
    const edit_wrapper = document.createElement("div");
    edit_wrapper.classList = "investment-edit-wrapper";
    const close_wrapper = document.createElement("img");
    close_wrapper.src = "images/close.png";
    close_wrapper.alt = "";
    close_wrapper.addEventListener("click", () => {
      edit_wrapper.remove();
    });
    const wrapper = this.formWrapper();
    this.styleFormWrapper(wrapper);
    const container = this.formContainer((e) => formHandler(e, investment._id));
    container.append(this.formTitle("Edit Investment"));
    this.businessDetails(container, investment.business);
    this.productDetails(container, investment.product);
    this.investmentSubmit(container);
    wrapper.append(container, close_wrapper);
    edit_wrapper.append(wrapper);
    return edit_wrapper;
  }
}
