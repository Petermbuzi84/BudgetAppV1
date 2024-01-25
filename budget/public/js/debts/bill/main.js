import DebtsTab from "../tabs.js";
import BillDebtsNav from "./nav.js";
import BillDebtsTable from "./table.js";

export default class BillDebts {
  render(debts) {
    const debts_element = document.createElement("div");
    debts_element.classList = "debts";
    const debts_tab = new DebtsTab("bill", debts);
    debts_element.append(debts_tab.render());
    const debts_nav = new BillDebtsNav();
    debts_element.append(debts_nav.render());
    const debts_table = new BillDebtsTable(debts);
    debts_element.append(debts_table.render());
    return debts_element;
  }
}
