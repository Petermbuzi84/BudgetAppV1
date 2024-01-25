import ExpensesTab from "../tabs.js";
import TravelExpensesNav from "./nav.js";
import TravelExpensesTable from "./table.js";

export default class TravelExpenses {
  render(expenses) {
    const expenses_element = document.createElement("div");
    expenses_element.classList = "expenses";
    const expenses_tab = new ExpensesTab("travel", expenses);
    expenses_element.append(expenses_tab.render());
    const expenses_nav = new TravelExpensesNav();
    expenses_element.append(expenses_nav.render());
    const expenses_table = new TravelExpensesTable(expenses);
    expenses_element.append(expenses_table.render());
    return expenses_element;
  }
}
