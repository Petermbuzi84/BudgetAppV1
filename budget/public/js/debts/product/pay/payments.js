import Table from "../../../common/table.js";

export default class ProductPaymentsTable extends Table {
  constructor(last_payments) {
    super();
    this.last_payments = last_payments;
  }

  tableContents(element) {
    this.last_payments.forEach((payment) => {
      const options = [
        payment.date,
        payment.amount,
        payment.transaction.method,
        payment.transaction.id,
        payment.transaction.name,
        payment.transaction.cost == 0 && payment.transaction.method === "cash"
          ? ""
          : `${payment.transaction.cost}.00`,
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
