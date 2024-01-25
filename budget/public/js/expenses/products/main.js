import ExpensesTab from "../tabs.js";
import ProductExpensesNav from "./nav.js";
import ProductExpensesTable from "./table.js";

export default class ProductExpenses {
  render(expenses) {
    const expenses_element = document.createElement("div");
    expenses_element.classList = "expenses";
    const expenses_tab = new ExpensesTab("products", expenses);
    expenses_element.append(expenses_tab.render());
    const expenses_nav = new ProductExpensesNav();
    expenses_element.append(expenses_nav.render());
    const expenses_table = new ProductExpensesTable(expenses);
    expenses_element.append(expenses_table.render());
    return expenses_element;
  }
}
