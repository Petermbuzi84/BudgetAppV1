import navbarRender from "../common/navbar.js";
import { connectToServer } from "../common/server.js";
import sideBarLinks from "../common/side_bar.js";
import BillDebts from "./bill/main.js";
import ProductDebts from "./product/main.js";

function main() {
  navbarRender();
  sideBarLinks("debts");
  const main = document.querySelector("main");
  const debt_category = localStorage.getItem("debt_category");
  if (debt_category === "bill") {
    const bill_debts = new BillDebts();
    connectToServer("debts/bills", (debts) => {
      main.append(bill_debts.render(debts));
    });
  } else {
    const product_debts = new ProductDebts();
    connectToServer("debts/products", (debts) => {
      main.append(product_debts.render(debts));
    });
  }
}
main();
