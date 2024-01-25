import navbarRender from "../common/navbar.js";
import { connectToServer } from "../common/server.js";
import sideBarLinks from "../common/side_bar.js";
import BillsNav from "./nav.js";
import BillsTable from "./table.js";

class Bill {
  render(bills) {
    const bill_element = document.createElement("div");
    bill_element.classList = "bills";
    const bill_nav = new BillsNav();
    bill_element.append(bill_nav.render());
    const bill_table = new BillsTable(bills);
    bill_element.append(bill_table.render());
    return bill_element;
  }
}

function main() {
  navbarRender();
  sideBarLinks("bills");
  connectToServer("bills", (bills) => {
    const main = document.querySelector("main");
    const bill = new Bill();
    main.append(bill.render(bills));
  });
}
main();
