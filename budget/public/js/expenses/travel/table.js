import Table, { TablePages, max_count } from "../../common/table.js";
import EditTavelExpense from "../edit/travel/main.js";

const original_max_count = 8;

export default class TravelExpensesTable extends Table {
  constructor(expenses) {
    super();
    this.expenses = expenses;
  }

  removeTableContainer() {
    const table_container = document.querySelector(".table-container");
    if (table_container) {
      table_container.remove();
    }
  }

  tableContents(element) {
    for (let i = max_count - original_max_count; i < max_count; i++) {
      if (i === this.expenses.length) {
        break;
      }
      const expense = this.expenses[i];
      const options = [
        expense._id,
        expense.travel_from,
        expense.travel_to,
        expense.travelled,
        expense.amount,
        expense.provider,
        expense.payment.method,
        expense.payment.transaction.id,
        expense.payment.transaction.name,
        expense.payment.transaction.cost == 0
          ? ""
          : expense.payment.transaction.cost,
      ];
      const row = this.tableRow(options);
      row.setAttribute("data-expense", i);
      this.tableItemActions(
        row,
        i,
        () => {},
        {
          data: this.expenses,
          edit_form: EditTavelExpense,
        },
        { action: "remove_expense/travel", redirect: "expenses" }
      );
      element.append(row);
    }
  }

  tableContainer(element) {
    const table_container = document.createElement("div");
    table_container.classList = "table-container";
    const headings = [
      "id",
      "from",
      "to",
      "travelled",
      "amount",
      "provider",
      "payment method",
      "transaction id",
      "transaction name",
      "transaction cost",
      "actions",
    ];
    this.tableHeadings(table_container, headings);
    this.tableContents(table_container);
    element.append(table_container);
  }

  render() {
    const table_pages = new TablePages("expenses", TravelExpensesTable);
    const expenses_table = document.createElement("div");
    expenses_table.classList = "expenses-table";
    const wrapper = this.tableWrapper();
    if (this.expenses.length > original_max_count) {
      expenses_table.append(
        wrapper,
        table_pages.render(this.expenses, original_max_count)
      );
      this.tableContainer(wrapper);
    } else {
      this.tableContainer(expenses_table);
    }
    return expenses_table;
  }
}
