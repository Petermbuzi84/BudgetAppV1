export default class MPesaTransactionsNav {
  searchBar() {
    const search_bar = document.createElement("div");
    search_bar.classList = "search-bar";
    const search_input = document.createElement("input");
    search_input.type = "text";
    search_input.name = "search_transactions";
    search_input.placeholder = "search mpesa transactions";
    search_bar.append(search_input);
    return search_bar;
  }

  addTransactionsButtonStyle(add_transactions_button) {
    const color = "brown";
    add_transactions_button.style.border = `2px solid ${color}`;
    add_transactions_button.style.color = "white";
    add_transactions_button.style.backgroundColor = color;
  }

  buttons() {
    const button_container = document.createElement("div");
    button_container.classList = "transactions-buttons";
    const add_transaction_button = document.createElement("button");
    add_transaction_button.classList = "add-transaction";
    add_transaction_button.textContent = "add mpesa transaction";
    add_transaction_button.addEventListener("click", () => {
      location = "/add_mpesa_transaction";
    });
    this.addTransactionsButtonStyle(add_transaction_button);
    button_container.append(add_transaction_button);
    return button_container;
  }

  render() {
    const transaction_nav = document.createElement("div");
    transaction_nav.classList = "transactions-nav";
    transaction_nav.append(this.searchBar(), this.buttons());
    return transaction_nav;
  }
}
