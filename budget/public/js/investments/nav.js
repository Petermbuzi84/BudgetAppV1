export default class InvestmentsNav {
  searchBar() {
    const search_bar = document.createElement("div");
    search_bar.classList = "search-bar";
    const search_input = document.createElement("input");
    search_input.type = "text";
    search_input.name = "search_investments";
    search_input.placeholder = "search investments";
    search_bar.append(search_input);
    return search_bar;
  }

  addInvestmentsButtonStyle(add_investments_button) {
    const color = "brown";
    add_investments_button.style.border = `2px solid ${color}`;
    add_investments_button.style.color = "white";
    add_investments_button.style.backgroundColor = color;
  }

  buttons() {
    const button_container = document.createElement("div");
    button_container.classList = "investments-buttons";
    const add_investment_button = document.createElement("button");
    add_investment_button.classList = "add-investment";
    add_investment_button.textContent = "add investment";
    add_investment_button.addEventListener("click", () => {
      location = "/add_investment";
    });
    this.addInvestmentsButtonStyle(add_investment_button);
    button_container.append(add_investment_button);
    return button_container;
  }

  render() {
    const investment_nav = document.createElement("div");
    investment_nav.classList = "investments-nav";
    investment_nav.append(this.searchBar(), this.buttons());
    return investment_nav;
  }
}
