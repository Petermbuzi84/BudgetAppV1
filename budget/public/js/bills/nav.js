export default class BillsNav {
  searchBar() {
    const search_bar = document.createElement("div");
    search_bar.classList = "search-bar";
    const search_input = document.createElement("input");
    search_input.type = "text";
    search_input.name = "search_bills";
    search_input.placeholder = "search bills";
    search_bar.append(search_input);
    return search_bar;
  }

  addBillsButtonStyle(add_bills_button) {
    const color = "brown";
    add_bills_button.style.border = `2px solid ${color}`;
    add_bills_button.style.color = "white";
    add_bills_button.style.backgroundColor = color;
  }

  buttons() {
    const button_container = document.createElement("div");
    button_container.classList = "bills-buttons";
    const add_bill_button = document.createElement("button");
    add_bill_button.classList = "add-bill";
    add_bill_button.textContent = "add bill";
    add_bill_button.addEventListener("click", () => {
      location = "/add_bill";
    });
    this.addBillsButtonStyle(add_bill_button);
    button_container.append(add_bill_button);
    return button_container;
  }

  render() {
    const bill_nav = document.createElement("div");
    bill_nav.classList = "bills-nav";
    bill_nav.append(this.searchBar(), this.buttons());
    return bill_nav;
  }
}
