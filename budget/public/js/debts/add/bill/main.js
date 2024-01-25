import Form from "../../../common/form.js";
import navbarRender from "../../../common/navbar.js";
import {
  connectToServer,
  connectToServerWithArguments,
} from "../../../common/server.js";
import { dateToday } from "../../../common/utilities.js";

let active_debt = {};

function formHandler(e) {
  const service = e.target.add_service
    ? e.target.add_service.value
    : e.target.service.value;
  const provider = e.target.provider.value;
  const amount = e.target.amount.value;
  const last_payment = e.target.last_payment.checked;
  const payment_method = e.target.payment_method;
  const transaction_id = e.target.transaction_id;
  const transaction_name = e.target.transaction_name;
  const transaction_cost = e.target.transaction_cost;
  const last_amount = e.target.last_amount;
  const last_date = e.target.last_date;
  const received = e.target.received.value;
  const expired = e.target.expired.value;
  if (service === "") {
    alert("please enter the service");
  } else if (provider === "") {
    alert("please enter the service provider");
  } else if (amount === "") {
    alert("please enter the amount");
  } else if (
    last_payment &&
    payment_method.value === "mpesa" &&
    transaction_id.value === ""
  ) {
    alert("please enter the mpesa transaction id");
  } else if (
    last_payment &&
    payment_method.value === "mpesa" &&
    transaction_name.value === ""
  ) {
    alert("please enter the mpesa transaction name");
  } else if (
    last_payment &&
    payment_method.value === "mpesa" &&
    transaction_cost.value === ""
  ) {
    alert("please enter the mpesa transaction cost");
  } else if (last_payment && last_amount.value === "") {
    alert("please enter the last amount paid");
  } else if (last_payment && last_date.value === "") {
    alert("please enter the last date payment was made");
  } else if (received === "") {
    alert("please enter the date service was received");
  } else if (expired === "") {
    alert("please enter the date the service expired");
  } else {
    const debt = {
      service,
      provider,
      amount: parseInt(amount),
      payment: {
        status: "pending",
        last_payment: {},
        balance: 0,
      },
      received,
      expired,
    };
    if (last_payment) {
      debt.payment.last_payment = {
        date: last_date.value,
        amount: parseInt(last_amount.value),
        transaction: {
          method: payment_method.value,
          id: transaction_id ? transaction_id.value : "",
          name: transaction_name ? transaction_name.value : "",
          cost: transaction_cost ? parseInt(transaction_cost.value) : 0,
        },
      };
    }
    connectToServerWithArguments("add_debt/bill", debt, () => {
      location = "/debts";
    });
  }
}

class AddBillDebt extends Form {
  constructor(debts, bills) {
    super();
    this.debts = this.combinesAllBills(debts, bills);
  }

  combinesAllBills(debts, bills) {
    const combined = debts;
    bills.forEach((bill) => {
      let found = false;
      for (let i = 0; i < combined.length; i++) {
        const debt = combined[i];
        if (bill.service === debt.service) {
          found = true;
          break;
        }
      }
      if (!found) {
        combined.push(bill);
      }
    });
    return combined;
  }

  debtAddService(element) {
    const container = document.createElement("div");
    container.classList = "input-container input-service";
    container.style.paddingTop = "10px";
    const label = this.labelElement("debt-service", "Add service");
    const input = this.userInput("add_service", "debt-service", "text");
    container.append(label, input);
    element.append(container);
  }

  debtBillService(element) {
    const container = document.createElement("div");
    container.classList = "input-container debt-services";
    const label = this.labelElement("debt", "Service");
    const local_debts = this.debts.map((debt) => debt);
    local_debts.push({ service: "New service" });
    active_debt = local_debts[0];
    const service_names = local_debts.map((debt) => debt.service);
    const select = this.selectElement(service_names, "service", "service");
    select.addEventListener("change", (e) => {
      const input_service = document.querySelector(".input-service");
      if (e.target.value === "New service") {
        if (!input_service) {
          const service_details = document.querySelector(".debt-services");
          this.debtAddService(service_details);
        }
      } else {
        if (input_item) {
          input_item.remove();
        }
        const provider = document.getElementById("debt-provider");
        provider.value = active_debt.provider;
      }
    });
    container.append(label, select);
    if (select.value === "New service") {
      this.debtAddService(container);
    }
    element.append(container);
  }

  debtBillAmount(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-amount", "Amount");
    const input = this.userInput("amount", "debt-amount", "number");
    container.append(label, input);
    element.append(container);
  }

  debtProvider(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-provider", "Provider");
    const input = this.userInput("provider", "debt-provider", "text");
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

  debtLastPaymentAmount(element) {
    const container = document.createElement("div");
    container.classList = "input-container debt-last-amount-container";
    container.style.paddingTop = "10px";
    const label = this.labelElement("debt-last-amount", "Last Payment Amount");
    const input = this.userInput("last_amount", "debt-last-amount", "number");
    container.append(label, input);
    element.append(container);
  }

  debtLastPaymentDate(element) {
    const container = document.createElement("div");
    container.classList = "input-container debt-last-date-container";
    container.style.paddingTop = "10px";
    const label = this.labelElement("debt-last-date", "Last Payment Date");
    const input = this.userInput("last_date", "debt-last-date", "date");
    container.append(label, input);
    element.append(container);
  }

  debtLastPaymentDetails(container) {
    this.debtLastPaymentAmount(container);
    this.debtPaymentMethod(container);
    this.debtLastPaymentDate(container);
  }

  debtLastPayment(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const checkbox = this.checkboxElement(
      "last_payment",
      "debt-last-payment",
      "Made Last Payment"
    );
    if (
      !active_debt.payment ||
      !active_debt.payment.paid ||
      active_debt.payment.paid.last_payment.amount === 0
    ) {
      checkbox.addEventListener("change", (e) => {
        const checked = e.target.checked;
        if (checked) {
          this.debtLastPaymentDetails(container);
        } else {
          const payment_method_container = document.querySelector(
            ".debt-payment-method-container"
          );
          if (payment_method_container) {
            payment_method_container.remove();
          }
          const last_amount_container = document.querySelector(
            ".debt-last-amount-container"
          );
          if (last_amount_container) {
            last_amount_container.remove();
          }
          const last_date_container = document.querySelector(
            ".debt-last-date-container"
          );
          if (last_date_container) {
            last_date_container.remove();
          }
        }
      });
    } else {
      this.debtLastPaymentDetails(container);
    }
    container.append(checkbox);
    element.append(container);
  }

  debtReceived(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-received", "Received");
    const input = this.userInput("received", "debt-received", "date");
    input.value = dateToday();
    container.append(label, input);
    element.append(container);
  }

  debtExpired(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-expired", "Expired");
    const input = this.userInput("expired", "debt-expired", "date");
    input.value = dateToday();
    container.append(label, input);
    element.append(container);
  }

  debtSubmit(element) {
    element.append(this.formSubmit("submit-debt", "Add Bill debt"));
  }

  render() {
    const wrapper = this.formWrapper();
    const container = this.formContainer(formHandler);
    container.append(this.formTitle("Add Bill Debt"));
    this.debtBillService(container);
    this.debtProvider(container);
    this.debtBillAmount(container);
    this.debtLastPayment(container);
    this.debtReceived(container);
    this.debtExpired(container);
    this.debtSubmit(container);
    wrapper.append(container);
    return wrapper;
  }
}

function main() {
  navbarRender();
  const main = document.querySelector("main");
  connectToServer("debts/bills", (debts) => {
    connectToServer("bills", (bills) => {
      const debt_bill = new AddBillDebt(debts, bills);
      main.append(debt_bill.render());
    });
  });
}
main();
