import Table from "../../common/table.js";

export default class InvestmentsPaymentsTable extends Table {
  constructor(investments) {
    super();
    this.investments = investments;
  }

  tableContents(element) {
    this.investments.forEach((investment) => {
      const options = [
        investment.date,
        investment.amount,
        investment.payment.method,
        investment.payment.transaction.id,
        investment.payment.transaction.name,
        investment.payment.transaction.cost == 0 &&
        investment.payment.transaction.method === "cash"
          ? ""
          : `${investment.payment.transaction.cost}.00`,
      ];
      const row = this.tableRow(options);
      element.append(row);
    });
  }

  tableContainer(element) {
    const table_container = document.createElement("div");
    table_container.classList = "table-container";
    const headings = [
      "date",
      "amount",
      "payment method",
      "transaction id",
      "transaction name",
      "transaction cost",
    ];
    this.tableHeadings(table_container, headings);
    this.tableContents(table_container);
    element.append(table_container);
  }

  render() {
    const payments_table = document.createElement("div");
    payments_table.classList = "payments-table";
    this.tableContainer(payments_table);
    return payments_table;
  }
}
