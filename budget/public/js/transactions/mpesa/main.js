import MPesaTransactionsNav from "./nav.js";
import MPesaTransactionsTable from "./table.js";

export default class MPesaTransactions {
  render(transactions) {
    const transactions_element = document.createElement("div");
    transactions_element.classList = "transactions";
    const transactions_nav = new MPesaTransactionsNav();
    transactions_element.append(transactions_nav.render());
    const transactions_table = new MPesaTransactionsTable(transactions);
    transactions_element.append(transactions_table.render());
    return transactions_element;
  }
}
