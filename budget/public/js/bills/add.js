import Form from "../common/form.js";
import navbarRender from "../common/navbar.js";
import {
  connectToServer,
  connectToServerWithArguments,
} from "../common/server.js";
import { dateToday } from "../common/utilities.js";

let active_bill = "";

function formHandler(e) {
  const service = e.target.add_service
    ? e.target.add_service.value
    : e.target.service.value;
  const provider = e.target.provider.value;
  const paid = e.target.paid.value;
  const expired = e.target.expired.value;
  const amount = e.target.amount.value;
  const payment_method = e.target.payment_method.value;
  const transaction_id = e.target.transaction_id;
  const transaction_name = e.target.transaction_name;
  const transaction_cost = e.target.transaction_cost;
  if (service === "") {
    alert("please enter service");
  } else if (provider === "") {
    alert("please enter service provider");
  } else if (paid === "") {
    alert("please enter date service was paid");
  } else if (amount === "") {
    alert("please enter amount paid for the service");
  } else if (payment_method === "mpesa" && transaction_id.value === "") {
    alert("please enter mpesa transaction id");
  } else if (payment_method === "mpesa" && transaction_name.value === "") {
    alert("please enter mpesa transaction name");
  } else if (payment_method === "mpesa" && transaction_cost.value === "") {
    alert("please enter mpesa transaction cost");
  } else {
    const bill = {
      service,
      provider,
      amount: parseInt(amount),
      paid,
      expired: {
        status: false,
        details: expired === "" ? "in progress" : expired,
      },
      payment: {
        method: payment_method,
        transaction: {
          id: transaction_id ? transaction_id.value : "",
          name: transaction_name ? transaction_name.value : "",
          cost: transaction_cost ? parseInt(transaction_cost.value) : 0,
        },
      },
    };
    connectToServerWithArguments("add_bill", bill, () => {
      location = "/bills";
    });
  }
}

class AddBill extends Form {
  constructor(bills) {
    super();
    this.bills = bills;
  }

  serviceBill(element) {
    const container = document.createElement("div");
    container.classList = "input-container input-service";
    container.style.paddingTop = "10px";
    const label = this.labelElement("service-bill", "Add service");
    const input = this.userInput("add_service", "service-bill", "text");
    container.append(label, input);
    element.append(container);
  }

  getServices(local_bills) {
    const services = [];
    local_bills.forEach((bill) => {
      let found = false;
      for (let i = 0; i < services.length; i++) {
        const service = services[i];
        if (service == bill.service) {
          found = true;
          break;
        }
      }
      if (!found) {
        services.push(bill.service);
      }
    });
    return services;
  }

  services(element) {
    const container = document.createElement("div");
    container.classList = "input-container services";
    const label = this.labelElement("service", "Service");
    this.bills.push({ service: "New service" });
    active_bill = this.bills[0];
    const service_names = this.getServices(this.bills);
    const select = this.selectElement(service_names, "service", "service");
    select.addEventListener("change", (e) => {
      const input_service = document.querySelector(".input-service");
      if (e.target.value === "New service") {
        if (!input_service) {
          const service_details = document.querySelector(".services");
          this.serviceBill(service_details);
        }
      } else {
        this.bills.forEach((bill) => {
          if (bill.service === e.target.value) {
            active_bill = bill;
          }
        });
        if (input_service) {
          input_service.remove();
        }
      }
    });
    container.append(label, select);
    if (select.value === "New service") {
      this.serviceBill(container);
    }
    element.append(container);
  }

  serviceProvider(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("service-provider", "Provider");
    const input = this.userInput("provider", "service-provider", "text");
    input.value = active_bill.provider;
    container.append(label, input);
    element.append(container);
  }

  billAmount(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("bill-amount", "Amount");
    const input = this.userInput("amount", "bill-amount", "number");
    input.value = active_bill.amount;
    container.append(label, input);
    element.append(container);
  }

  billTransactionID(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-id";
    container.style.paddingTop = "10px";
    const label = this.labelElement("bill-transaction-id", "Transaction ID");
    const input = this.userInput("transaction_id", "transaction-id", "text");
    input.placeholder = "e.g. EF56TGYH78";
    container.append(label, input);
    element.append(container);
  }

  billTransactionName(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-name";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "bill-transaction-name",
      "Transaction Name"
    );
    const input = this.userInput(
      "transaction_name",
      "bill-transaction-name",
      "text"
    );
    container.append(label, input);
    element.append(container);
  }

  billTransactionCost(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-cost";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "bill-transaction-cost",
      "Transaction Cost"
    );
    const input = this.userInput(
      "transaction_cost",
      "bill-transaction-cost",
      "text"
    );
    container.append(label, input);
    element.append(container);
  }

  billPaymentMethod(element) {
    const payment = document.createElement("div");
    payment.classList = "bill-payment-method-container";
    const options = ["cash", "mpesa"];
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("payment method", "Payment Method");
    const select = this.selectElement(
      options,
      "payment_method",
      "bill-payment-method"
    );
    select.addEventListener("change", (e) => {
      const mode = e.target.value;
      if (mode === "mpesa") {
        const payment_method = document.querySelector(
          ".bill-payment-method-container"
        );
        this.billTransactionID(payment_method);
        this.billTransactionName(payment_method);
        this.billTransactionCost(payment_method);
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

  servicePaid(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("service-paid", "Paid");
    const input = this.userInput("paid", "service-paid", "date");
    input.value = dateToday();
    container.append(label, input);
    element.append(container);
  }

  serviceExpired(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("service-expired", "Expired");
    const input = this.userInput("expired", "service-expired", "date");
    container.append(label, input);
    element.append(container);
  }

  billSubmit(element) {
    element.append(this.formSubmit("submit-bill", "Add bill"));
  }

  render() {
    const wrapper = this.formWrapper();
    const container = this.formContainer(formHandler);
    container.append(this.formTitle("Add Bill"));
    this.services(container);
    this.serviceProvider(container);
    this.billAmount(container);
    this.servicePaid(container);
    this.serviceExpired(container);
    this.billPaymentMethod(container);
    this.billSubmit(container);
    wrapper.append(container);
    return wrapper;
  }
}

function main() {
  navbarRender();
  connectToServer("bills", (bills) => {
    const main = document.querySelector("main");
    const add_bill = new AddBill(bills);
    main.append(add_bill.render());
  });
}
main();
