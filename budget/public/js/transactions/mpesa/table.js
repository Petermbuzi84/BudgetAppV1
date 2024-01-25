import Table, { TablePages, max_count } from "../../common/table.js";
import EditMPesaTransactions from "../edit/mpesa/main.js";

const original_max_count = 9;

export default class MPesaTransactionsTable extends Table {
  constructor(transactions) {
    super();
    this.transactions = transactions;
  }

  removeTableContainer() {
    const table_container = document.querySelector(".table-container");
    if (table_container) {
      table_container.remove();
    }
  }

  tableContents(element) {
    let start = 0;
    let end = this.transactions.length;
    const difference = max_count - original_max_count;
    if (difference >= 0) {
      start = difference;
      end = max_count;
    }
    for (let i = start; i < end; i++) {
      if (i === this.transactions.length) {
        break;
      }
      const transaction = this.transactions[i];
      const options = [
        transaction._id,
        transaction.category,
        transaction.amount,
        transaction.period.date,
        `${transaction.period.hour}:${transaction.period.minute} ${transaction.period.meridian}`,
        transaction.agent.name,
        transaction.agent.till,
        transaction.agent.store,
        transaction.cost,
        transaction.balance,
      ];
      const row = this.tableRow(options);
      row.setAttribute("data-row", i);
      this.tableItemActions(
        row,
        i,
        () => {},
        { data: this.transactions, edit_form: EditMPesaTransactions },
        { action: "edit_transactions", redirect: "transactions" }
      );
      element.append(row);
    }
  }

  tableContainer(element) {
    const table_container = document.createElement("div");
    table_container.classList = "table-container";
    const headings = [
      "id",
      "category",
      "amount",
      "date",
      "time",
      "name",
      "till",
      "store",
      "cost",
      "balance",
      "actions",
    ];
    this.tableHeadings(table_container, headings);
    this.tableContents(table_container);
    element.append(table_container);
  }

  render() {
    const table_pages = new TablePages("transactions", MPesaTransactionsTable);
    const transactions_table = document.createElement("div");
    transactions_table.classList = "transactions-table";
    if (this.transactions.length > original_max_count) {
      const wrapper = this.tableWrapper();
      transactions_table.append(
        wrapper,
        table_pages.render(this.transactions, original_max_count)
      );
      this.tableContainer(wrapper);
    } else {
      this.tableContainer(transactions_table);
    }
    return transactions_table;
  }
}
