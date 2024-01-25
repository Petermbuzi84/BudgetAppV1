import Table, { TablePages, max_count } from "../common/table.js";
import ExpiredBill from "./edit/expired.js";
import EditBillForm from "./edit/main.js";

const original_max_count = 9;

export default class BillsTable extends Table {
  constructor(bills) {
    super();
    this.bills = bills;
    this.expired_bill = new ExpiredBill();
  }

  removeTableContainer() {
    const table_container = document.querySelector(".table-container");
    if (table_container) {
      table_container.remove();
    }
  }

  showExpiredForm(bill_id) {
    this.bills.forEach((bill) => {
      if (bill._id === bill_id) {
        const body = document.querySelector("body");
        body.append(this.expired_bill.render(bill));
      }
    });
  }

  tableBillExpired(expire_index) {
    const table_rows = document.querySelectorAll(".table-row");
    table_rows.forEach((row) => {
      const bill_index = parseInt(row.dataset.row);
      if (bill_index === expire_index) {
        const table_columns = row.querySelectorAll(".table-column");
        const column_id = table_columns[0].textContent;
        this.showExpiredForm(column_id);
      }
    });
  }

  tableContents(element) {
    for (let i = max_count - original_max_count; i < max_count; i++) {
      if (i === this.bills.length) {
        break;
      }
      const bill = this.bills[i];
      const options = [
        bill._id,
        bill.service,
        bill.amount,
        bill.provider,
        bill.paid,
        bill.expired.details,
        bill.payment.method,
        bill.payment.transaction.id,
        bill.payment.transaction.name,
        bill.payment.transaction.cost == 0 && bill.payment.method === "cash"
          ? ""
          : `${bill.payment.transaction.cost}.00`,
      ];
      const row = this.tableRow(options);
      row.setAttribute("data-row", i);
      this.tableItemActions(
        row,
        i,
        (actions) => {
          if (bill.expired.details === "in progress") {
            actions.push({
              title: "expired",
              callback: (e) => {
                const target_index = parseInt(e.target.dataset.expired);
                const table_row_icons =
                  document.querySelectorAll(".table-row-icon");
                table_row_icons.forEach((row_icons) => {
                  const row_icons_index = parseInt(row_icons.dataset.expired);
                  if (row_icons_index === target_index) {
                    this.tableBillExpired(target_index);
                  }
                });
              },
            });
          }
        },
        { data: this.bills, edit_form: EditBillForm },
        { action: "remove_bill", redirect: "bills" }
      );
      element.append(row);
    }
  }

  tableContainer(element) {
    const table_container = document.createElement("div");
    table_container.classList = "table-container";
    const headings = [
      "id",
      "service",
      "amount",
      "provider",
      "paid",
      "expired",
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
    const table_pages = new TablePages("bills", BillsTable);
    const bills_table = document.createElement("div");
    bills_table.classList = "bills-table";
    const wrapper = this.tableWrapper();
    if (this.bills.length > original_max_count) {
      bills_table.append(
        wrapper,
        table_pages.render(this.bills, original_max_count)
      );
      this.tableContainer(wrapper);
    } else {
      this.tableContainer(bills_table);
    }
    return bills_table;
  }
}
