import Form from "../common/form.js";
import navbarRender from "../common/navbar.js";
import {
  connectToServer,
  connectToServerWithArguments,
} from "../common/server.js";
import { dateToday } from "../common/utilities.js";

let active_investment = "";

function formHandler(e) {
  const business = e.target.add_business
    ? e.target.add_business.value
    : e.target.business.value;
  const product = e.target.product.value;
  const amount = e.target.amount.value;
  const date = e.target.investment_date.value;
  const payment_method = e.target.payment_method.value;
  const transaction_id = e.target.transaction_id;
  const transaction_name = e.target.transaction_name;
  const transaction_cost = e.target.transaction_cost;
  if (business === "") {
    alert("please enter the business details");
  } else if (product === "") {
    alert("please enter the product provided by the business");
  } else if (amount === "") {
    alert("please enter the amount invested");
  } else if (date === "") {
    alert("please enter the date the investment was made");
  } else if (payment_method === "mpesa" && transaction_id.value === "") {
    alert("please enter the mpesa transaction id");
  } else if (payment_method === "mpesa" && transaction_name.value === "") {
    alert("please enter the mpesa transaction name");
  } else if (payment_method === "mpesa" && transaction_cost.value === "") {
    alert("please enter the mpesa transaction cost");
  } else {
    const investment = {
      business,
      product,
      investments: [
        {
          amount: parseInt(amount),
          date,
          payment: {
            method: payment_method,
            transaction: {
              id: transaction_id ? transaction_id.value : "",
              name: transaction_name ? transaction_name.value : "",
              cost: transaction_cost ? parseInt(transaction_cost.value) : 0,
            },
          },
        },
      ],
    };
    connectToServerWithArguments("add_investment", investment, ({ status }) => {
      if (status === "added") {
        location = "/investments";
      } else {
        alert("insufficient funds to pay for the investment");
      }
    });
  }
}

class AddInvestment extends Form {
  constructor(investments) {
    super();
    this.investments = investments;
  }

  businessInvestment(element) {
    const container = document.createElement("div");
    container.classList = "input-container input-business";
    container.style.paddingTop = "10px";
    const label = this.labelElement("business-bill", "Add Business");
    const input = this.userInput("add_business", "business-bill", "text");
    container.append(label, input);
    element.append(container);
  }

  getBusinesses(local_businesses) {
    const businesses = [];
    local_businesses.forEach((investment) => {
      let found = false;
      for (let i = 0; i < businesses.length; i++) {
        const business = businesses[i];
        if (business == investment.business) {
          found = true;
          break;
        }
      }
      if (!found) {
        businesses.push(investment.business);
      }
    });
    return businesses;
  }

  businesses(element) {
    const container = document.createElement("div");
    container.classList = "input-container businesses";
    const label = this.labelElement("business", "Business");
    this.investments.push({ business: "New investment" });
    active_investment = this.investments[0];
    const businesses = this.getBusinesses(this.investments);
    const select = this.selectElement(businesses, "business", "business");
    select.addEventListener("change", (e) => {
      const input_business = document.querySelector(".input-business");
      if (e.target.value === "New investment") {
        if (!input_business) {
          const business_details = document.querySelector(".businesses");
          this.businessInvestment(business_details);
        }
      } else {
        this.investments.forEach((investment) => {
          if (investment.service === e.target.value) {
            active_investment = investment;
          }
        });
        if (input_service) {
          input_service.remove();
        }
      }
    });
    container.append(label, select);
    if (select.value === "New investment") {
      this.businessInvestment(container);
    }
    element.append(container);
  }

  product(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("product", "Product");
    const input = this.userInput("product", "product", "text");
    input.value = active_investment.product ? active_investment.product : "";
    container.append(label, input);
    element.append(container);
  }

  investmentAmount(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("investment-amount", "Amount");
    const input = this.userInput("amount", "investment-amount", "number");
    input.value = active_investment.amount;
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

  investmentDate(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("investment-date", "Date");
    const input = this.userInput("investment_date", "investment-date", "date");
    input.value = dateToday();
    container.append(label, input);
    element.append(container);
  }

  investmentSubmit(element) {
    element.append(this.formSubmit("submit-investment", "Add"));
  }

  render() {
    const wrapper = this.formWrapper();
    const container = this.formContainer(formHandler);
    container.append(this.formTitle("Add Investment"));
    this.businesses(container);
    this.product(container);
    this.investmentAmount(container);
    this.investmentDate(container);
    this.investmentPaymentMethod(container);
    this.investmentSubmit(container);
    wrapper.append(container);
    return wrapper;
  }
}

function main() {
  navbarRender();
  connectToServer("investments", (investments) => {
    const main = document.querySelector("main");
    const add_investment = new AddInvestment(investments);
    main.append(add_investment.render());
  });
}
main();
