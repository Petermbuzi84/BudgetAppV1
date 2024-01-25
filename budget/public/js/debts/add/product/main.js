import {
  product_categories,
  product_units,
} from "../../../common/categories.js";
import Form from "../../../common/form.js";
import navbarRender from "../../../common/navbar.js";
import {
  connectToServer,
  connectToServerWithArguments,
} from "../../../common/server.js";
import { dateToday } from "../../../common/utilities.js";

let active_debt = "";
let active_creditor = {};

function formHandler(e) {
  const product = e.target.add_item
    ? e.target.add_item.value
    : e.target.item.value;
  const category = e.target.category.value;
  const quantity = e.target.quantity.value;
  const unit = e.target.unit.value;
  const last_payment = e.target.last_payment.checked;
  const last_amount = e.target.last_amount;
  const last_date = e.target.last_date;
  const last_payment_method = e.target.payment_method;
  const last_transaction_id = e.target.transaction_id;
  const last_transaction_name = e.target.transaction_name;
  const last_transaction_cost = e.target.transaction_cost;
  const price = e.target.price.value;
  const creditor = e.target.add_creditor
    ? e.target.add_creditor.value
    : e.target.creditor.value;
  const creditor_region = e.target.creditor_region;
  const creditor_county = e.target.creditor_county;
  const creditor_country = e.target.creditor_country;
  const taken = e.target.taken.value;
  if (product === "") {
    alert("please enter the product name");
  } else if (quantity === "") {
    alert("please enter the product quantity");
  } else if (last_payment && last_amount.value === "") {
    alert("please enter the last amount paid");
  } else if (last_payment && last_date.value === "") {
    alert("please enter the date the last amount was paid");
  } else if (
    last_payment &&
    last_payment_method.value === "mpesa" &&
    last_transaction_id.value == ""
  ) {
    alert("please enter the mpesa transaction id");
  } else if (
    last_payment &&
    last_payment_method.value === "mpesa" &&
    last_transaction_name.value == ""
  ) {
    alert("please enter the mpesa transaction name");
  } else if (
    last_payment &&
    last_payment_method.value === "mpesa" &&
    last_transaction_cost.value == ""
  ) {
    alert("please enter the mpesa transaction cost");
  } else if (price === "") {
    alert("please enter the product price");
  } else if (creditor === "") {
    alert("please enter the product creditor");
  } else if (e.target.add_creditor && creditor_region.value === "") {
    alert("please enter the creditor region");
  } else if (e.target.add_creditor && creditor_county.value === "") {
    alert("please enter the creditor county");
  } else if (e.target.add_creditor && creditor_country.value === "") {
    alert("please enter the creditor country");
  } else if (taken === "") {
    alert("please enter the date debt was taken");
  } else {
    const debt = {
      product,
      category,
      quantity: {
        value: parseInt(quantity),
        unit,
      },
      price: {
        unit: parseInt(price),
        total: 0,
      },
      creditor: {
        name: creditor,
        location: {
          region: creditor_region
            ? creditor_region.value
            : active_creditor.location.region,
          county: creditor_county
            ? creditor_county.value
            : active_creditor.location.county,
          country: creditor_country
            ? creditor_country.value
            : active_creditor.location.country,
        },
      },
      payment: {
        status: "pending",
        last_payment: {}, // date, amount, transactions
        balance: 0,
      },
      taken,
    };
    if (last_payment) {
      debt.payment.last_payment = {
        date: last_date.value,
        amount: parseInt(last_amount.value),
        transaction: {
          method: last_payment_method.value,
          id: last_transaction_id ? last_transaction_id.value : "",
          name: last_transaction_name ? last_transaction_name.value : "",
          cost: last_transaction_cost
            ? parseInt(last_transaction_cost.value)
            : 0,
        },
      };
    }
    connectToServerWithArguments("add_debt/product", debt, () => {
      location = "/debts";
    });
  }
}

class AddProductDebt extends Form {
  constructor(debts, expenses) {
    super();
    this.debts = this.combinesAllProducts(debts, expenses);
    this.today = new Date();
  }

  combinesAllProducts(debts, expenses) {
    const combined = debts;
    expenses.forEach((expense) => {
      let found = false;
      for (let i = 0; i < combined.length; i++) {
        const debt = combined[i];
        if (expense.product === debt.product) {
          found = true;
          break;
        }
      }
      if (!found) {
        expense.creditor = expense.seller;
        combined.push(expense);
      }
    });
    return combined;
  }

  debtItem(element) {
    const container = document.createElement("div");
    container.classList = "input-container input-item";
    container.style.paddingTop = "10px";
    const label = this.labelElement("debt-item", "Add product");
    const input = this.userInput("add_item", "debt-item", "text");
    container.append(label, input);
    element.append(container);
  }

  itemDetails(element) {
    const container = document.createElement("div");
    container.classList = "input-container item-details";
    const label = this.labelElement("debt", "Product");
    const local_debts = this.debts.map((debt) => debt);
    local_debts.push({ product: "New product" });
    active_debt = local_debts[0];
    active_creditor = active_debt.creditor;
    const item_names = local_debts.map((debt) => debt.product);
    const select = this.selectElement(item_names, "item", "item");
    select.addEventListener("change", (e) => {
      const input_item = document.querySelector(".input-item");
      if (e.target.value === "New product") {
        if (!input_item) {
          const item_details = document.querySelector(".item-details");
          this.debtItem(item_details);
        }
      } else {
        local_debts.forEach((debt) => {
          if (debt.product === e.target.value) {
            active_debt = debt;
          }
        });
        if (input_item) {
          input_item.remove();
        }
        const category = document.getElementById("category");
        category.value = active_debt.category;
      }
    });
    container.append(label, select);
    if (select.value === "New product") {
      this.debtItem(container);
    }
    element.append(container);
  }

  debtCategory(element) {
    const container = document.createElement("div");
    container.classList = "input-container debt-category-container";
    const label = this.labelElement("category", "Category");
    const options = product_categories;
    if (active_debt.product !== "New product") {
      options.forEach((option) => {
        if (active_debt.category === option.name) {
          option.active = true;
        }
      });
    }
    const select = this.selectElementWithActive(
      options,
      "category",
      "category"
    );
    container.append(label, select);
    element.append(container);
  }

  debtQuantity(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-quantity", "Quantity");
    const input = this.userInput("quantity", "debt-quantity", "number");
    input.value = 1;
    container.append(label, input);
    element.append(container);
  }

  debtQuantityUnit(element) {
    const container = document.createElement("div");
    container.classList = "input-container debt-unit-container";
    const label = this.labelElement("unit", "Unit");
    const options = product_units;
    if (active_debt.item !== "New product") {
      options.forEach((option) => {
        if (active_debt.category === option.name) {
          option.active = true;
        }
      });
    }
    const select = this.selectElementWithActive(options, "unit", "unit");
    container.append(label, select);
    element.append(container);
  }

  debtPrice(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-price", "Unit Price");
    const input = this.userInput("price", "debt-price", "number");
    container.append(label, input);
    element.append(container);
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
    this.debtLastPaymentDate(container);
    this.debtPaymentMethod(container);
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
      !active_debt.payment.paid ||
      active_debt.payment.paid.last_payment.amount === 0
    ) {
      checkbox.addEventListener("change", (e) => {
        const checked = e.target.checked;
        if (checked) {
          this.debtLastPaymentDetails(container);
        } else {
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

  debtAddCreditor(element) {
    const container = document.createElement("div");
    container.classList = "input-container input-creditor";
    container.style.paddingTop = "10px";
    const label = this.labelElement("debt-creditor", "Add Creditor");
    const input = this.userInput("add_creditor", "debt-creditor", "text");
    container.append(label, input);
    element.append(container);
  }

  getCreditors(local_debts) {
    const creditors = [];
    local_debts.forEach((debt) => {
      let found = false;
      for (let i = 0; i < creditors.length; i++) {
        const creditor = creditors[i];
        if (creditor == debt.creditor.name) {
          found = true;
          break;
        }
      }
      if (!found) {
        creditors.push(debt.creditor.name);
      }
    });
    return creditors;
  }

  removeDebtCreditorContainer() {
    const creditor_location_container = document.querySelector(
      ".creditor-location-container"
    );
    if (creditor_location_container) {
      creditor_location_container.remove();
    }
  }

  debtCreditorRegion(element, user_input, creditor) {
    const container = document.createElement("div");
    container.classList = "input-container creditor-region-container";
    container.style.paddingTop = "10px";
    if (user_input) {
      const label = this.labelElement(
        "expense-creditor-region",
        "Add Creditor Region"
      );
      const input = this.userInput(
        "creditor_region",
        "expense-creditor-region",
        "text"
      );
      container.append(label, input);
    } else {
      const label = this.labelElement(
        "expense-creditor-region",
        "Creditor Region"
      );
      const creditor_region = document.createElement("div");
      creditor_region.classList = "input-div creditor-region";
      creditor_region.textContent = creditor;
      container.append(label, creditor_region);
    }
    element.append(container);
  }

  debtCreditorCounty(element, user_input, creditor) {
    const container = document.createElement("div");
    container.classList = "input-container creditor-county-container";
    container.style.paddingTop = "10px";
    if (user_input) {
      const counties = ["Nyeri", "Nairobi", "Nakuru", "Mombasa", "Kisumu"];
      const label = this.labelElement(
        "expense-creditor-county",
        "Add Creditor County"
      );
      const select = this.selectElement(
        counties,
        "creditor_county",
        "expense-creditor-county"
      );
      container.append(label, select);
    } else {
      const label = this.labelElement(
        "expense-creditor-county",
        "Creditor County"
      );
      const creditor_county = document.createElement("div");
      creditor_county.classList = "input-div creditor-county";
      creditor_county.textContent = creditor;
      container.append(label, creditor_county);
    }
    element.append(container);
  }

  debtCreditorCountry(element, user_input, creditor) {
    const container = document.createElement("div");
    container.classList = "input-container creditor-country-container";
    container.style.paddingTop = "10px";
    if (user_input) {
      const label = this.labelElement(
        "expense-creditor-country",
        "Add Creditor Country"
      );
      const input = this.userInput(
        "creditor_country",
        "expense-creditor-country",
        "text"
      );
      input.value = "Kenya";
      container.append(label, input);
    } else {
      const label = this.labelElement(
        "expense-creditor-country",
        "Creditor Country"
      );
      const creditor_country = document.createElement("div");
      creditor_country.classList = "input-div creditor-country";
      creditor_country.textContent = creditor;
      container.append(label, creditor_country);
    }
    element.append(container);
  }

  debtCreditorLocation(element, user_input, creditor = "") {
    const container = document.createElement("div");
    container.classList = "input-container creditor-location-container";
    this.debtCreditorRegion(container, user_input, creditor.region);
    this.debtCreditorCounty(container, user_input, creditor.county);
    this.debtCreditorCountry(container, user_input, creditor.country);
    element.append(container);
  }

  debtCreditor(element) {
    const container = document.createElement("div");
    container.classList = "input-container creditor-container";
    const label = this.labelElement("creditor", "Creditor");
    const local_creditors = this.debts.map((debt) => debt);
    local_creditors.push({ creditor: { name: "New creditor" } });
    const creditor_names = this.getCreditors(local_creditors);
    const select = this.selectElement(creditor_names, "creditor", "creditor");
    select.addEventListener("change", (e) => {
      const input_creditor = document.querySelector(".input-creditor");
      if (e.target.value === "New creditor") {
        if (!input_creditor) {
          this.removeDebtCreditorContainer();
          this.debtAddCreditor(container);
          this.debtCreditorLocation(container, true);
        }
      } else {
        local_creditors.forEach((expense) => {
          if (expense.creditor.name === e.target.value) {
            active_creditor = expense.creditor;
          }
        });
        if (input_creditor) {
          input_creditor.remove();
        }
        this.removeDebtCreditorContainer();
        this.debtCreditorLocation(container, false, active_creditor.location);
      }
    });
    container.append(label, select);
    this.removeDebtCreditorContainer();
    if (select.value === "New creditor") {
      this.debtAddCreditor(container);
      this.debtCreditorLocation(container, true);
    } else {
      this.debtCreditorLocation(container, false, active_creditor.location);
    }
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
    payment.style.paddingTop = "10px";
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

  debtTaken(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("debt-taken", "Taken");
    const input = this.userInput("taken", "debt-taken", "date");
    input.value = dateToday();
    container.append(label, input);
    element.append(container);
  }

  debtSubmit(element) {
    element.append(this.formSubmit("submit-debt", "Add Product debt"));
  }

  render() {
    const wrapper = this.formWrapper();
    const container = this.formContainer(formHandler);
    container.append(this.formTitle("Add Product debt"));
    this.itemDetails(container);
    this.debtCategory(container);
    this.debtQuantity(container);
    this.debtQuantityUnit(container);
    this.debtLastPayment(container);
    this.debtPrice(container);
    this.debtCreditor(container);
    this.debtTaken(container);
    this.debtSubmit(container);
    wrapper.append(container);
    return wrapper;
  }
}

function main() {
  navbarRender();
  connectToServer("debts/products", (debts) => {
    connectToServer("expenses/products", (expenses) => {
      const main = document.querySelector("main");
      const product_debt = new AddProductDebt(debts, expenses);
      main.append(product_debt.render());
    });
  });
}
main();
