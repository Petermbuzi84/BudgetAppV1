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

let active_item = "";
let active_seller = {};

function formHandler(e) {
  const product = e.target.add_item
    ? e.target.add_item.value
    : e.target.item.value;
  const category = e.target.category.value;
  const quantity = e.target.quantity.value;
  const unit = e.target.unit.value;
  const price = e.target.price.value;
  const seller = e.target.add_seller
    ? e.target.add_seller.value
    : e.target.seller.value;
  const seller_region = e.target.seller_region;
  const seller_county = e.target.seller_county;
  const seller_country = e.target.seller_country;
  const payment_method = e.target.payment_method.value;
  const transaction_id = e.target.transaction_id;
  const transaction_name = e.target.transaction_name;
  const transaction_cost = e.target.transaction_cost;
  const purchased = e.target.purchased.value;
  if (product === "") {
    alert("please enter the product name");
  } else if (quantity === "") {
    alert("please enter the product quantity");
  } else if (price === "") {
    alert("please enter the product price");
  } else if (seller === "") {
    alert("please enter the product seller");
  } else if (e.target.add_seller && seller_region.value === "") {
    alert("please enter the seller region");
  } else if (e.target.add_seller && seller_county.value === "") {
    alert("please enter the seller county");
  } else if (e.target.add_seller && seller_country.value === "") {
    alert("please enter the seller country");
  } else if (payment_method === "mpesa" && transaction_id.value === "") {
    alert("please enter the transaction id");
  } else if (payment_method === "mpesa" && transaction_name.value === "") {
    alert("please enter the transaction name");
  } else if (payment_method === "mpesa" && transaction_cost.value === "") {
    alert("please enter transaction cost");
  } else if (purchased === "") {
    alert("please enter the date of payment");
  } else {
    const expense = {
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
      seller: {
        name: seller.toUpperCase(),
        location: {
          region: seller_region
            ? seller_region.value
            : active_item.seller.location.region,
          county: seller_county
            ? seller_county.value
            : active_item.seller.location.county,
          country: seller_country
            ? seller_country.value
            : active_item.seller.location.country,
        },
      },
      payment: {
        method: payment_method,
        transaction: {
          id: transaction_id ? transaction_id.value : "",
          name: transaction_name ? transaction_name.value : "",
          cost: transaction_cost ? parseInt(transaction_cost.value) : 0,
        },
      },
      purchased,
    };
    connectToServerWithArguments(
      "add_expense/product",
      expense,
      ({ status }) => {
        if (status === "added") {
          location = "/expenses";
        } else if (status === "insufficient") {
          alert("insufficient funds to pay for the expense");
        }
      }
    );
  }
}

class AddProductExpense extends Form {
  constructor(expenses) {
    super();
    this.expenses = expenses;
  }

  getProducts(local_expenses) {
    const products = [];
    local_expenses.forEach((expense) => {
      let found = false;
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product == expense.product) {
          found = true;
          break;
        }
      }
      if (!found) {
        products.push(expense.product);
      }
    });
    return products;
  }

  expenseItem(element) {
    const container = document.createElement("div");
    container.classList = "input-container input-item";
    container.style.paddingTop = "10px";
    const label = this.labelElement("expense-item", "Add product");
    const input = this.userInput("add_item", "expense-item", "text");
    container.append(label, input);
    element.append(container);
  }

  expenseDetails(element) {
    const container = document.createElement("div");
    container.classList = "input-container item-details";
    const label = this.labelElement("expense", "Product");
    const local_expenses = this.expenses.map((expense) => expense);
    local_expenses.push({ product: "New product" });
    active_item = local_expenses[0];
    active_seller = active_item.seller;
    const item_names = this.getProducts(local_expenses);
    const select = this.selectElement(item_names, "item", "item");
    select.addEventListener("change", (e) => {
      const input_item = document.querySelector(".input-item");
      if (e.target.value === "New product") {
        if (!input_item) {
          const item_details = document.querySelector(".item-details");
          this.expenseItem(item_details);
        }
      } else {
        local_expenses.forEach((expense) => {
          if (expense.product === e.target.value) {
            active_item = expense;
          }
        });
        if (input_item) {
          input_item.remove();
        }
        const category = document.getElementById("category");
        category.value = active_item.category;
      }
    });
    container.append(label, select);
    if (select.value === "New product") {
      this.expenseItem(container);
    }
    element.append(container);
  }

  expenseCategory(element) {
    const container = document.createElement("div");
    container.classList = "input-container expense-category-container";
    const label = this.labelElement("category", "Category");
    const options = product_categories;
    if (active_item.product !== "New product") {
      options.forEach((option) => {
        if (active_item.category === option.name) {
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

  expenseQuantity(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("expense-quantity", "Quantity");
    const input = this.userInput("quantity", "expense-quantity", "number");
    input.value = 1;
    container.append(label, input);
    element.append(container);
  }

  expenseQuantityUnit(element) {
    const container = document.createElement("div");
    container.classList = "input-container expense-unit-container";
    const label = this.labelElement("unit", "Unit");
    const options = product_units;
    if (active_item.item !== "New product") {
      options.forEach((option) => {
        if (active_item.category === option.name) {
          option.active = true;
        }
      });
    }
    const select = this.selectElementWithActive(options, "unit", "unit");
    container.append(label, select);
    element.append(container);
  }

  expensePrice(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("expense-price", "Unit Price");
    const input = this.userInput("price", "expense-price", "number");
    container.append(label, input);
    element.append(container);
  }

  removeExpenseSellerContainer() {
    const seller_location_container = document.querySelector(
      ".seller-location-container"
    );
    if (seller_location_container) {
      seller_location_container.remove();
    }
  }

  expenseAddSeller(element) {
    const container = document.createElement("div");
    container.classList = "input-container input-seller";
    container.style.paddingTop = "10px";
    const label = this.labelElement("expense-seller", "Add seller");
    const input = this.userInput("add_seller", "expense-seller", "text");
    container.append(label, input);
    element.append(container);
  }

  getSellers(local_expenses) {
    const sellers = [];
    local_expenses.forEach((expense) => {
      let found = false;
      for (let i = 0; i < sellers.length; i++) {
        const seller = sellers[i];
        if (seller == expense.seller.name) {
          found = true;
          break;
        }
      }
      if (!found) {
        sellers.push(expense.seller.name);
      }
    });
    return sellers;
  }

  expenseSellerRegion(element, user_input, seller) {
    const container = document.createElement("div");
    container.classList = "input-container seller-region-container";
    container.style.paddingTop = "10px";
    if (user_input) {
      const label = this.labelElement(
        "expense-seller-region",
        "Add Seller Region"
      );
      const input = this.userInput(
        "seller_region",
        "expense-seller-region",
        "text"
      );
      container.append(label, input);
    } else {
      const label = this.labelElement("expense-seller-region", "Seller Region");
      const seller_region = document.createElement("div");
      seller_region.classList = "input-div seller-region";
      seller_region.textContent = seller;
      container.append(label, seller_region);
    }
    element.append(container);
  }

  expenseSellerCounty(element, user_input, seller) {
    const container = document.createElement("div");
    container.classList = "input-container seller-county-container";
    container.style.paddingTop = "10px";
    if (user_input) {
      const counties = ["Nyeri", "Nairobi", "Nakuru", "Mombasa", "Kisumu"];
      const label = this.labelElement(
        "expense-seller-county",
        "Add Seller County"
      );
      const select = this.selectElement(
        counties,
        "seller_county",
        "expense-seller-county"
      );
      container.append(label, select);
    } else {
      const label = this.labelElement("expense-seller-county", "Seller County");
      const seller_county = document.createElement("div");
      seller_county.classList = "input-div seller-county";
      seller_county.textContent = seller;
      container.append(label, seller_county);
    }
    element.append(container);
  }

  expenseSellerCountry(element, user_input, seller) {
    const container = document.createElement("div");
    container.classList = "input-container seller-country-container";
    container.style.paddingTop = "10px";
    if (user_input) {
      const label = this.labelElement(
        "expense-seller-country",
        "Add Seller Country"
      );
      const input = this.userInput(
        "seller_country",
        "expense-seller-country",
        "text"
      );
      input.value = "Kenya";
      container.append(label, input);
    } else {
      const label = this.labelElement(
        "expense-seller-country",
        "Seller Country"
      );
      const seller_country = document.createElement("div");
      seller_country.classList = "input-div seller-country";
      seller_country.textContent = seller;
      container.append(label, seller_country);
    }
    element.append(container);
  }

  expenseSellerLocation(element, user_input, seller = "") {
    const container = document.createElement("div");
    container.classList = "input-container seller-location-container";
    this.expenseSellerRegion(container, user_input, seller.region);
    this.expenseSellerCounty(container, user_input, seller.county);
    this.expenseSellerCountry(container, user_input, seller.country);
    element.append(container);
  }

  expenseSeller(element) {
    const container = document.createElement("div");
    container.classList = "input-container seller-container";
    const label = this.labelElement("seller", "Seller");
    const local_expenses = this.expenses.map((expense) => expense);
    local_expenses.push({ seller: { name: "New seller" } });
    const seller_names = this.getSellers(local_expenses);
    const select = this.selectElement(seller_names, "seller", "seller");
    select.addEventListener("change", (e) => {
      const input_seller = document.querySelector(".input-seller");
      if (e.target.value === "New seller") {
        if (!input_seller) {
          const seller_container = document.querySelector(".seller-container");
          this.removeExpenseSellerContainer();
          this.expenseAddSeller(seller_container);
          this.expenseSellerLocation(seller_container, true);
        }
      } else {
        local_expenses.forEach((expense) => {
          if (expense.seller.name === e.target.value) {
            active_seller = expense;
          }
        });
        if (input_seller) {
          input_seller.remove();
        }
        this.removeExpenseSellerContainer();
        this.expenseSellerLocation(
          container,
          false,
          active_seller.seller.location
        );
      }
    });
    container.append(label, select);
    this.removeExpenseSellerContainer();
    if (select.value === "New seller") {
      this.expenseAddSeller(container);
      this.expenseSellerLocation(container, true);
    } else {
      this.expenseSellerLocation(container, false, active_item.seller.location);
    }
    element.append(container);
  }

  expenseTransactionID(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-id";
    container.style.paddingTop = "10px";
    const label = this.labelElement("expense-transaction-id", "Transaction ID");
    const input = this.userInput("transaction_id", "transaction-id", "text");
    input.placeholder = "e.g. EF56TGYH78";
    container.append(label, input);
    element.append(container);
  }

  expenseTransactionName(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-name";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "expense-transaction-name",
      "Transaction Name"
    );
    const input = this.userInput(
      "transaction_name",
      "expense-transaction-name",
      "text"
    );
    container.append(label, input);
    element.append(container);
  }

  expenseTransactionCost(element) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-cost";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "expense-transaction-cost",
      "Transaction Cost"
    );
    const input = this.userInput(
      "transaction_cost",
      "expense-transaction-cost",
      "text"
    );
    container.append(label, input);
    element.append(container);
  }

  expensePaymentMethod(element) {
    const payment = document.createElement("div");
    payment.classList = "expense-payment-method-container";
    const options = ["cash", "mpesa"];
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("payment method", "Payment Method");
    const select = this.selectElement(
      options,
      "payment_method",
      "expense-payment-method"
    );
    select.addEventListener("change", (e) => {
      const mode = e.target.value;
      if (mode === "mpesa") {
        const payment_method = document.querySelector(
          ".expense-payment-method-container"
        );
        this.expenseTransactionID(payment_method);
        this.expenseTransactionName(payment_method);
        this.expenseTransactionCost(payment_method);
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

  expensePurchased(element) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("expense-purchased", "Purchased");
    const input = this.userInput("purchased", "expense-purchased", "date");
    input.value = dateToday();
    container.append(label, input);
    element.append(container);
  }

  expenseSubmit(element) {
    element.append(this.formSubmit("submit-expense", "Add Product Expense"));
  }

  render() {
    const wrapper = this.formWrapper();
    const container = this.formContainer(formHandler);
    container.append(this.formTitle("Add Product Expense"));
    this.expenseDetails(container);
    this.expenseCategory(container);
    this.expenseQuantity(container);
    this.expenseQuantityUnit(container);
    this.expensePrice(container);
    this.expenseSeller(container);
    this.expensePaymentMethod(container);
    this.expensePurchased(container);
    this.expenseSubmit(container);
    wrapper.append(container);
    return wrapper;
  }
}

function main() {
  navbarRender();
  connectToServer("expenses/products", (expenses) => {
    const main = document.querySelector("main");
    const product_expense = new AddProductExpense(expenses);
    main.append(product_expense.render());
  });
}
main();
