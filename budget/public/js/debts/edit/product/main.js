import { product_categories } from "../../../common/categories.js";
import Form from "../../../common/form.js";
import { connectToServerWithArguments } from "../../../common/server.js";

function formHandler(e, bill_id) {
  const expired = e.target.expired.value;
  if (expired === "") {
    alert("please enter date the bill expired");
  } else {
    const expiry = {
      bill_id,
      expired,
    };
    connectToServerWithArguments("bill_expired", expiry, () => {
      location = "/bills";
    });
  }
}

export default class ExpiredBill extends Form {
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

  billSubmit(element) {
    element.append(this.formSubmit("submit-bill", "Update Bill"));
  }

  styleFormWrapper(wrapper) {
    wrapper.style.height = "100vh";
    wrapper.style.justifyContent = "center";
  }

  render(bill) {
    const edit_wrapper = document.createElement("div");
    edit_wrapper.classList = "bill-edit-wrapper";
    const close_wrapper = document.createElement("img");
    close_wrapper.src = "images/close.png";
    close_wrapper.alt = "";
    close_wrapper.addEventListener("click", () => {
      edit_wrapper.remove();
    });
    const wrapper = this.formWrapper();
    this.styleFormWrapper(wrapper);
    const container = this.formContainer((e) => formHandler(e, bill._id));
    container.append(this.formTitle("Service Expired"));
    this.serviceExpired(container);
    this.billSubmit(container);
    wrapper.append(container, close_wrapper);
    edit_wrapper.append(wrapper);
    return edit_wrapper;
  }
}
