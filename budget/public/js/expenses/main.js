import navbarRender from "../common/navbar.js";
import { connectToServer } from "../common/server.js";
import sideBarLinks from "../common/side_bar.js";
import ProductExpenses from "./products/main.js";
import TravelExpenses from "./travel/main.js";

function main() {
  navbarRender();
  sideBarLinks("expenses");
  const main = document.querySelector("main");
  const expense_category = localStorage.getItem("expense_category");
  if (expense_category === "travel") {
    const travel_expenses = new TravelExpenses();
    connectToServer("expenses/travels", (expenses) => {
      main.append(travel_expenses.render(expenses));
    });
  } else {
    const product_expenses = new ProductExpenses();
    connectToServer("expenses/products", (expenses) => {
      main.append(product_expenses.render(expenses));
    });
  }
}
main();
