import Form from "../../common/form.js";

export default class EditBillForm extends Form {
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
    const container = this.formContainer((e) => formHandler(e, bill));
    container.append(this.formTitle("Edit bill"));
    // this.debtBillService(container, debt.service);
    // this.debtProvider(container, debt.provider);
    // this.debtBillAmount(container, debt.amount);
    // this.debtReceived(container, debt.received);
    // this.debtExpired(container, debt.expired);
    // this.debtSubmit(container);
    wrapper.append(container, close_wrapper);
    edit_wrapper.append(wrapper);
    return edit_wrapper;
  }
}
