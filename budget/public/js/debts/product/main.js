import ProductDebtsTable from "../product/table.js";
import ProductDebtsNav from "../product/nav.js";
import DebtsTab from "../tabs.js";

export default class ProductDebts {
  render(debts) {
    const debts_element = document.createElement("div");
    debts_element.classList = "debts";
    const debts_tab = new DebtsTab("products", debts);
    debts_element.append(debts_tab.render());
    const debts_nav = new ProductDebtsNav();
    debts_element.append(debts_nav.render());
    const debts_table = new ProductDebtsTable(debts);
    debts_element.append(debts_table.render());
    return debts_element;
  }
}
