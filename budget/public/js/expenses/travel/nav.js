export default class TravelExpensesNav {
  searchBar() {
    const search_bar = document.createElement("div");
    search_bar.classList = "search-bar";
    const search_input = document.createElement("input");
    search_input.type = "text";
    search_input.name = "search_expenses";
    search_input.placeholder = "search travel expenses";
    search_bar.append(search_input);
    return search_bar;
  }

  addExpensesButtonStyle(add_expenses_button) {
    const color = "brown";
    add_expenses_button.style.border = `2px solid ${color}`;
    add_expenses_button.style.color = "white";
    add_expenses_button.style.backgroundColor = color;
  }

  buttons() {
    const button_container = document.createElement("div");
    button_container.classList = "expenses-buttons";
    const add_expense_button = document.createElement("button");
    add_expense_button.classList = "add-expense";
    add_expense_button.textContent = "add travel";
    add_expense_button.addEventListener("click", () => {
      location = "/add_travel_expense";
    });
    this.addExpensesButtonStyle(add_expense_button);
    button_container.append(add_expense_button);
    return button_container;
  }

  render() {
    const expense_nav = document.createElement("div");
    expense_nav.classList = "expenses-nav";
    expense_nav.append(this.searchBar(), this.buttons());
    return expense_nav;
  }
}
