import { connectToServer } from "../../common/server.js";
import Table from "../../common/table.js";
import PayProductDebt from "./pay/main.js";

export default class ProductDebtsTable extends Table {
  constructor(debts) {
    super();
    this.debts = debts;
    this.pay_debt = new PayProductDebt();
  }

  showPaidForm(debt_id) {
    this.debts.forEach((debt) => {
      if (debt._id === debt_id) {
        const body = document.querySelector("body");
        body.append(this.pay_debt.render(debt));
      }
    });
  }

  showHistoryForm(debt_id) {
    this.debts.forEach((debt) => {
      if (debt._id === debt_id) {
        const body = document.querySelector("body");
        body.append(this.pay_debt.render(debt));
      }
    });
  }

  tableDebtPaid(paid_index) {
    const table_rows = document.querySelectorAll(".table-row");
    table_rows.forEach((row) => {
      const debt_index = parseInt(row.dataset.debt);
      if (debt_index === paid_index) {
        const table_columns = row.querySelectorAll(".table-column");
        const column_id = table_columns[0].textContent;
        this.showPaidForm(column_id);
      }
    });
  }

  tableDebtHistory(history_index) {
    const table_rows = document.querySelectorAll(".table-row");
    table_rows.forEach((row) => {
      const debt_index = parseInt(row.dataset.debt);
      if (debt_index === history_index) {
        const table_columns = row.querySelectorAll(".table-column");
        const column_id = table_columns[0].textContent;
        this.showHistoryForm(column_id);
      }
    });
  }

  tableContents(element) {
    this.debts.forEach((debt, index) => {
      const options = [
        debt._id,
        debt.product,
        debt.category,
        `${debt.quantity.value} ${debt.quantity.unit}`,
        debt.price.unit,
        debt.price.total,
        debt.creditor.name,
        debt.creditor.location.region,
        debt.creditor.location.county,
        debt.creditor.location.country,
        debt.taken,
        debt.payment.status,
        debt.payment.balance,
        debt.payment.last_payment.length > 0
          ? debt.payment.last_payment[debt.payment.last_payment.length - 1]
              .amount
          : "",
        debt.payment.last_payment.length > 0
          ? debt.payment.last_payment[debt.payment.last_payment.length - 1].date
          : "",
        debt.payment.last_payment.length > 0
          ? debt.payment.last_payment[debt.payment.last_payment.length - 1]
              .transaction.method
          : "",
        ,
        debt.payment.last_payment.length > 0
          ? debt.payment.last_payment[debt.payment.last_payment.length - 1]
              .transaction.id
          : "",
        ,
        debt.payment.last_payment.length > 0
          ? debt.payment.last_payment[debt.payment.last_payment.length - 1]
              .transaction.name
          : "",
        ,
        debt.payment.last_payment.length > 0
          ? debt.payment.last_payment[debt.payment.last_payment.length - 1]
              .transaction.cost == 0 &&
            debt.payment.last_payment[debt.payment.last_payment.length - 1]
              .transaction.method == "cash"
            ? ""
            : `${
                debt.payment.last_payment[debt.payment.last_payment.length - 1]
                  .transaction.cost
              }.00`
          : "",
      ];
      const row = this.tableRow(options);
      row.setAttribute("data-debt", index);
      this.tableItemActions(
        row,
        index,
        (actions) => {
          if (debt.payment.status === "pending") {
            actions.push({
              title: "paid",
              callback: (e) => {
                const target_index = parseInt(e.target.dataset.paid);
                const table_row_icons =
                  document.querySelectorAll(".table-row-icon");
                table_row_icons.forEach((row_icons) => {
                  const row_icons_index = parseInt(row_icons.dataset.paid);
                  if (row_icons_index === target_index) {
                    this.tableDebtPaid(target_index);
                  }
                });
              },
            });
          } else if (debt.payment.status === "completed") {
            actions.push({
              title: "history",
              callback: (e) => {
                const target_index = parseInt(e.target.dataset.history);
                const table_row_icons =
                  document.querySelectorAll(".table-row-icon");
                table_row_icons.forEach((row_icons) => {
                  const row_icons_index = parseInt(row_icons.dataset.history);
                  if (row_icons_index === target_index) {
                    this.tableDebtHistory(target_index);
                  }
                });
              },
            });
          }
        },
        { data: this.debts, edit_form: undefined },
        { action: "remove_debt/products", redirect: "debts" }
      );
      element.append(row);
    });
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
      "creditor",
      "region",
      "county",
      "country",
      "taken",
      "paid",
      "balance",
      "last payment",
      "last paid",
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
    const debts_table = document.createElement("div");
    debts_table.classList = "debts-table";
    this.tableContainer(debts_table);
    return debts_table;
  }
}
