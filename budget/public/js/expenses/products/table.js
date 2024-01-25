import Table, { TablePages, max_count } from "../../common/table.js";
import EditProductExpense from "../edit/product/main.js";

const original_max_count = 8;

export default class ProductExpensesTable extends Table {
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
        expense.product,
        expense.category,
        `${expense.quantity.value} ${expense.quantity.unit}`,
        expense.price.unit,
        expense.price.total,
        expense.purchased,
        expense.seller.name,
        expense.seller.location.region,
        expense.seller.location.county,
        expense.seller.location.country,
        expense.payment.method,
        expense.payment.transaction.id,
        expense.payment.transaction.name,
        expense.payment.transaction.cost == 0 &&
        expense.payment.method === "cash"
          ? ""
          : `${expense.payment.transaction.cost}.00`,
      ];
      const row = this.tableRow(options);
      row.setAttribute("data-row", i);
      this.tableItemActions(
        row,
        i,
        () => {},
        {
          data: this.expenses,
          edit_form: EditProductExpense,
        },
        { action: "remove_expense/product", redirect: "expenses" }
      );
      element.append(row);
    }
  }

  tableContainer(element) {
    const table_container = document.createElement("div");
    table_container.classList = "table-container";
    const headings = [
      "id",
      "product",
      "category",
      "quantity",
      "unit price",
      "total price",
      "purchased",
      "seller",
      "region",
      "county",
      "country",
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
    const table_pages = new TablePages("expenses", ProductExpensesTable);
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
      this.tableContainer(wrapper);
    }
    return expenses_table;
  }
}
