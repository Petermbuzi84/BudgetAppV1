import Form from "../../../common/form.js";
import { connectToServerWithArguments } from "../../../common/server.js";

function formHandler(e, debt) {
  const service = e.target.service.value;
  const provider = e.target.provider.value;
  const amount = e.target.amount.value;
  const received = e.target.received.value;
  const expired = e.target.expired.value;
  if (service === "") {
    alert("please enter the service name");
  } else if (provider === "") {
    alert("please enter the service provider");
  } else if (amount === "") {
    alert("please enter the bill amount");
  } else if (received === "") {
    alert("please enter the date the service was received");
  } else if (expired === "") {
    alert("please enter the date the service expired");
  } else {
    debt.service = service;
    debt.provider = provider;
    debt.amount = amount;
    debt.received = received;
    debt.expired = expired;
    connectToServerWithArguments(`edit_debt/bill/${debt._id}`, debt, () => {
      location = "/debts";
    });
  }
}

export default class EditBillDebt extends Form {
  debtBillService(element, service) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-service", "Service");
    const input = this.userInput("service", "debt-service", "text");
    input.value = service;
    container.append(label, input);
    element.append(container);
  }

  debtBillAmount(element, amount) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-amount", "Amount");
    const input = this.userInput("amount", "debt-amount", "number");
    input.value = amount;
    container.append(label, input);
    element.append(container);
  }

  debtProvider(element, provider) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-provider", "Provider");
    const input = this.userInput("provider", "debt-provider", "text");
    input.value = provider;
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

  debtReceived(element, received) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-received", "Received");
    const input = this.userInput("received", "debt-received", "date");
    input.value = received;
    container.append(label, input);
    element.append(container);
  }

  debtExpired(element, expired) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-expired", "Expired");
    const input = this.userInput("expired", "debt-expired", "date");
    input.value = expired;
    container.append(label, input);
    element.append(container);
  }

  debtSubmit(element) {
    element.append(this.formSubmit("submit-debt", "Add Bill debt"));
  }

  styleFormWrapper(wrapper) {
    wrapper.style.height = "100vh";
    wrapper.style.justifyContent = "center";
  }

  render(debt) {
    const edit_wrapper = document.createElement("div");
    edit_wrapper.classList = "debt-edit-wrapper";
    const close_wrapper = document.createElement("img");
    close_wrapper.src = "images/close.png";
    close_wrapper.alt = "";
    close_wrapper.addEventListener("click", () => {
      edit_wrapper.remove();
    });
    const wrapper = this.formWrapper();
    this.styleFormWrapper(wrapper);
    const container = this.formContainer((e) => formHandler(e, debt));
    container.append(this.formTitle("Edit debt"));
    this.debtBillService(container, debt.service);
    this.debtProvider(container, debt.provider);
    this.debtBillAmount(container, debt.amount);
    this.debtReceived(container, debt.received);
    this.debtExpired(container, debt.expired);
    this.debtSubmit(container);
    wrapper.append(container, close_wrapper);
    edit_wrapper.append(wrapper);
    return edit_wrapper;
  }
}
