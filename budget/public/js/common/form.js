export default class Form {
  userInput(form_name, form_id, input_type) {
    const input = document.createElement("input");
    input.type = input_type;
    input.name = form_name;
    input.id = form_id;
    return input;
  }

  optionElement(element, value) {
    const option = document.createElement("option");
    option.value = value;
    option.text = value;
    element.append(option);
  }

  selectElement(options, name, title) {
    const select = document.createElement("select");
    select.name = name;
    select.id = title;
    options.forEach((value) => {
      this.optionElement(select, value);
    });
    return select;
  }

  selectElementWithActive(options, name, title) {
    const select = document.createElement("select");
    select.name = name;
    select.id = title;
    options.forEach((option) => {
      this.optionElement(select, option.name);
      if (option.active) {
        select.value = option.name;
      }
    });
    return select;
  }

  labelElement(label_target, title) {
    const label = document.createElement("label");
    label.for = label_target;
    label.textContent = title;
    return label;
  }

  checkboxElement(name, title, content) {
    const checkbox_container = document.createElement("div");
    checkbox_container.classList = "checkbox-container";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = name;
    checkbox.id = title;
    const checkbox_text = document.createElement("span");
    checkbox_text.classList = "checkbox-title";
    checkbox_text.textContent = content;
    checkbox_container.append(checkbox, checkbox_text);
    return checkbox_container;
  }

  formTitle(title) {
    const form_title = document.createElement("div");
    form_title.classList = "form-title";
    form_title.textContent = title;
    return form_title;
  }

  formSubmit(submit_id, title) {
    const add_form_container = document.createElement("div");
    add_form_container.classList = "add-form-container";
    const add_form_button = document.createElement("button");
    add_form_button.id = submit_id;
    add_form_button.textContent = title;
    add_form_container.append(add_form_button);
    return add_form_container;
  }

  formSubmitWithEvent(submit_id, title, eventCallback) {
    const add_form_container = document.createElement("div");
    add_form_container.classList = "add-form-container";
    const add_form_button = document.createElement("button");
    add_form_button.id = submit_id;
    add_form_button.textContent = title;
    add_form_button.addEventListener("click", eventCallback);
    add_form_container.append(add_form_button);
    return add_form_container;
  }

  formContainer(handler) {
    const form_container = document.createElement("form");
    form_container.classList = "form-container";
    form_container.addEventListener("submit", (e) => {
      e.preventDefault();
      handler(e);
    });
    return form_container;
  }

  formWrapper() {
    const wrapper = document.createElement("div");
    wrapper.classList = "form-wrapper";
    const error_wrapper = document.createElement("div");
    error_wrapper.classList = "error-wrapper";
    wrapper.append(error_wrapper);
    return wrapper;
  }
}
