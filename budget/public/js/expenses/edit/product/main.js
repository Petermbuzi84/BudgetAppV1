import {
  product_categories,
  product_units,
} from "../../../common/categories.js";
import Form from "../../../common/form.js";
import { connectToServerWithArguments } from "../../../common/server.js";

function formHandler(e, expense_id) {
  const product = e.target.product.value;
  const category = e.target.category.value;
  const quantity = e.target.quantity.value;
  const unit = e.target.unit.value;
  const price = e.target.price.value;
  const seller = e.target.seller.value;
  const seller_region = e.target.seller_region.value;
  const seller_county = e.target.seller_county.value;
  const seller_country = e.target.seller_country.value;
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
  } else if (seller_region === "") {
    alert("please enter the seller region");
  } else if (seller_county === "") {
    alert("please enter the seller county");
  } else if (seller_country === "") {
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
      _id: expense_id,
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
          region: seller_region,
          county: seller_county,
          country: seller_country,
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
      `edit_expense/product/${expense_id}`,
      expense,
      () => {
        location = "/expenses";
      }
    );
  }
}

export default class EditProductExpense extends Form {
  productName(element, name) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("product", "product");
    const input = this.userInput("product", "product", "text");
    input.value = name;
    container.append(label, input);
    element.append(container);
  }

  productCategory(element, category) {
    const container = document.createElement("div");
    container.classList = "input-container product-category-container";
    const label = this.labelElement("category", "Category");
    const options = product_categories;
    options.forEach((option) => {
      if (category === option.name) {
        option.active = true;
      }
    });
    const select = this.selectElementWithActive(
      options,
      "category",
      "category"
    );
    container.append(label, select);
    element.append(container);
  }

  expenseQuantity(element, quantity) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("expense-quantity", "Quantity");
    const input = this.userInput("quantity", "expense-quantity", "number");
    input.value = quantity;
    container.append(label, input);
    element.append(container);
  }

  expenseQuantityUnit(element, unit) {
    const container = document.createElement("div");
    container.classList = "input-container expense-unit-container";
    const label = this.labelElement("unit", "Unit");
    const options = product_units;
    options.forEach((option) => {
      if (unit === option.name) {
        option.active = true;
      }
    });
    const select = this.selectElementWithActive(options, "unit", "unit");
    container.append(label, select);
    element.append(container);
  }

  expensePrice(element, price) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("expense-price", "Unit Price");
    const input = this.userInput("price", "expense-price", "number");
    input.value = price;
    container.append(label, input);
    element.append(container);
  }

  expenseSeller(element, seller) {
    const container = document.createElement("div");
    container.classList = "input-container input-seller";
    container.style.paddingTop = "10px";
    const label = this.labelElement("expense-seller", "Seller");
    const input = this.userInput("seller", "expense-seller", "text");
    input.value = seller;
    container.append(label, input);
    element.append(container);
  }

  expenseSellerRegion(element, region) {
    const container = document.createElement("div");
    container.classList = "input-container seller-region-container";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "expense-seller-region",
      "Add Seller Region"
    );
    const input = this.userInput(
      "seller_region",
      "expense-seller-region",
      "text"
    );
    input.value = region;
    container.append(label, input);
    element.append(container);
  }

  expenseSellerCounty(element, county) {
    const container = document.createElement("div");
    container.classList = "input-container seller-county-container";
    container.style.paddingTop = "10px";
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
    select.value = county;
    container.append(label, select);
    element.append(container);
  }

  expenseSellerCountry(element, country) {
    const container = document.createElement("div");
    container.classList = "input-container seller-country-container";
    container.style.paddingTop = "10px";
    const label = this.labelElement(
      "expense-seller-country",
      "Add Seller Country"
    );
    const input = this.userInput(
      "seller_country",
      "expense-seller-country",
      "text"
    );
    input.value = country;
    container.append(label, input);
    element.append(container);
  }

  expenseSellerLocation(element, seller) {
    const container = document.createElement("div");
    container.classList = "input-container seller-location-container";
    this.expenseSellerRegion(container, seller.region);
    this.expenseSellerCounty(container, seller.county);
    this.expenseSellerCountry(container, seller.country);
    element.append(container);
  }

  expenseTransactionID(element, id) {
    const container = document.createElement("div");
    container.classList = "input-container mpesa-transaction-id";
    container.style.paddingTop = "10px";
    const label = this.labelElement("expense-transaction-id", "Transaction ID");
    const input = this.userInput("transaction_id", "transaction-id", "text");
    input.value = id;
    input.placeholder = "e.g. EF56TGYH78";
    container.append(label, input);
    element.append(container);
  }

  expenseTransactionName(element, name) {
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
    input.value = name;
    container.append(label, input);
    element.append(container);
  }

  expenseTransactionCost(element, cost) {
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
    input.value = cost;
    container.append(label, input);
    element.append(container);
  }

  expensePaymentMethod(element, payment) {
    const payment_element = document.createElement("div");
    payment_element.classList = "expense-payment-method-container";
    const options = ["cash", "mpesa"];
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("payment method", "Payment Method");
    const select = this.selectElement(
      options,
      "payment_method",
      "expense-payment-method"
    );
    select.value = payment.method;
    select.addEventListener("change", (e) => {
      const mode = e.target.value;
      if (mode === "mpesa") {
        const payment_method = document.querySelector(
          ".expense-payment-method-container"
        );
        this.expenseTransactionID(payment_method, payment.transaction.id);
        this.expenseTransactionName(payment_method, payment.transaction.name);
        this.expenseTransactionCost(payment_method, payment.transaction.cost);
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

  expensePurchased(element, purchased) {
    const container = document.createElement("div");
    container.classList = "input-container";
    const label = this.labelElement("expense-purchased", "Purchased");
    const input = this.userInput("purchased", "expense-purchased", "date");
    input.value = purchased;
    container.append(label, input);
    element.append(container);
  }

  expenseSubmit(element) {
    element.append(this.formSubmit("submit-expense", "Update expense"));
  }

  styleFormWrapper(wrapper) {
    wrapper.style.height = "100vh";
  }

  render(expense) {
    const edit_wrapper = document.createElement("div");
    edit_wrapper.classList = "expense-edit-wrapper";
    const close_wrapper = document.createElement("img");
    close_wrapper.src = "images/close.png";
    close_wrapper.alt = "";
    close_wrapper.addEventListener("click", () => {
      edit_wrapper.remove();
    });
    const wrapper = this.formWrapper();
    this.styleFormWrapper(wrapper);
    const container = this.formContainer((e) => formHandler(e, expense._id));
    container.append(this.formTitle("Edit Product Expense"));
    this.productName(container, expense.product);
    this.productCategory(container, expense.category);
    this.expenseQuantity(container, expense.quantity.value);
    this.expenseQuantityUnit(container, expense.quantity.unit);
    this.expensePrice(container, expense.price.unit);
    this.expenseSeller(container, expense.seller.name);
    this.expenseSellerLocation(container, expense.seller.location);
    this.expensePaymentMethod(container, expense.payment);
    this.expensePurchased(container, expense.purchased);
    this.expenseSubmit(container);
    wrapper.append(container, close_wrapper);
    edit_wrapper.append(wrapper);
    return edit_wrapper;
  }
}
