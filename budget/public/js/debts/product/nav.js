export default class ProductDebtsNav {
  searchBar() {
    const search_bar = document.createElement("div");
    search_bar.classList = "search-bar";
    const search_input = document.createElement("input");
    search_input.type = "text";
    search_input.name = "search_debts";
    search_input.placeholder = "search product debts";
    search_bar.append(search_input);
    return search_bar;
  }

  addDebtsButtonStyle(add_debts_button) {
    const color = "brown";
    add_debts_button.style.border = `2px solid ${color}`;
    add_debts_button.style.color = "white";
    add_debts_button.style.backgroundColor = color;
  }

  buttons() {
    const button_container = document.createElement("div");
    button_container.classList = "debts-buttons";
    const add_debt_button = document.createElement("button");
    add_debt_button.classList = "add-debt";
    add_debt_button.textContent = "add product";
    add_debt_button.addEventListener("click", () => {
      location = "/add_product_debt";
    });
    this.addDebtsButtonStyle(add_debt_button);
    button_container.append(add_debt_button);
    return button_container;
  }

  render() {
    const debt_nav = document.createElement("div");
    debt_nav.classList = "debts-nav";
    debt_nav.append(this.searchBar(), this.buttons());
    return debt_nav;
  }
}
