import Table from "../common/table.js";
import EditInvestment from "./edit.js";
import PayInvestment from "./pay/main.js";

export default class investmentsTable extends Table {
  constructor(investments) {
    super();
    this.investments = investments;
    this.pay_investment = new PayInvestment();
  }

  showInvestForm(investment_id) {
    this.investments.forEach((investment) => {
      if (investment._id === investment_id) {
        const body = document.querySelector("body");
        body.append(this.pay_investment.render(investment));
      }
    });
  }

  tableInvest(investment_index) {
    const table_rows = document.querySelectorAll(".table-row");
    table_rows.forEach((row) => {
      const invest_index = parseInt(row.dataset.row);
      if (invest_index === investment_index) {
        const table_columns = row.querySelectorAll(".table-column");
        const column_id = table_columns[0].textContent;
        this.showInvestForm(column_id);
      }
    });
  }

  tableContents(element) {
    this.investments.forEach((investment, index) => {
      const investments = investment.investments;
      const options = [
        investment._id,
        investment.business,
        investment.product,
        investments[investments.length - 1].amount,
        investments[investments.length - 1].date,
        investments[investments.length - 1].payment.method,
        investments[investments.length - 1].payment.transaction.id,
        investments[investments.length - 1].payment.transaction.name,
        investments[investments.length - 1].payment.transaction.cost == 0 &&
        investments[investments.length - 1].payment.method === "cash"
          ? ""
          : `${
              investments[investments.length - 1].payment.transaction.cost
            }.00`,
      ];
      const row = this.tableRow(options);
      row.setAttribute("data-row", index);
      this.tableItemActions(
        row,
        index,
        (actions) => {
          actions.push({
            title: "invest",
            callback: (e) => {
              const target_index = parseInt(e.target.dataset.invest);
              const table_row_icons =
                document.querySelectorAll(".table-row-icon");
              table_row_icons.forEach((row_icons) => {
                const row_icons_index = parseInt(row_icons.dataset.invest);
                if (row_icons_index === target_index) {
                  this.tableInvest(target_index);
                }
              });
            },
          });
        },
        { data: this.investments, edit_form: EditInvestment },
        { action: "remove_investment", redirect: "investments" }
      );
      element.append(row);
    });
  }

  tableContainer(element) {
    const table_container = document.createElement("div");
    table_container.classList = "table-container";
    const headings = [
      "id",
      "business",
      "product",
      "recent amount",
      "recent date",
      "recent payment method",
      "recent transaction id",
      "recent transaction name",
      "recent transaction cost",
      "actions",
    ];
    this.tableHeadings(table_container, headings);
    this.tableContents(table_container);
    element.append(table_container);
  }

  render() {
    const investments_table = document.createElement("div");
    investments_table.classList = "investments-table";
    this.tableContainer(investments_table);
    return investments_table;
  }
}
