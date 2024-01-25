import { connectToServer } from "../common/server.js";
import BillDebtsNav from "./bill/nav.js";
import BillDebtsTable from "./bill/table.js";
import ProductDebtsNav from "./product/nav.js";
import ProductDebtsTable from "./product/table.js";

export default class DebtsTab {
  constructor(category, debts) {
    this.category = category;
    this.debts = debts;
  }

  singleTab(element, title, active, callback) {
    const tab = document.createElement("div");
    tab.classList = `tab ${active}`;
    tab.textContent = title;
    tab.addEventListener("click", callback);
    element.append(tab);
  }

  removeActiveDebt() {
    const debts_nav = document.querySelector(".debts-nav");
    if (debts_nav) {
      debts_nav.remove();
    }
    const debts_table = document.querySelector(".debts-table");
    if (debts_table) {
      debts_table.remove();
    }
  }

  removeActiveTabLink() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => {
      if (tab.classList.contains("active-tab")) {
        tab.classList.remove("active-tab");
      }
    });
  }

  debtTabs(element) {
    const tabs = [
      {
        title: "products",
        active: this.category === "products" ? "active-tab" : "",
        callback: (e) => {
          this.removeActiveDebt();
          this.removeActiveTabLink();
          e.target.classList.add("active-tab");
          localStorage.setItem("debt_category", "product");
          connectToServer("debts/products", (products) => {
            const product_nav = new ProductDebtsNav();
            const product_table = new ProductDebtsTable(products);
            const debts = document.querySelector(".debts");
            debts.append(product_nav.render(), product_table.render());
          });
        },
      },
      {
        title: "bill",
        active: this.category === "bill" ? "active-tab" : "",
        callback: (e) => {
          this.removeActiveDebt();
          this.removeActiveTabLink();
          e.target.classList.add("active-tab");
          localStorage.setItem("debt_category", "bill");
          connectToServer("debts/bills", (bills) => {
            const bill_nav = new BillDebtsNav();
            const bill_table = new BillDebtsTable(bills);
            const debts = document.querySelector(".debts");
            debts.append(bill_nav.render(), bill_table.render());
          });
        },
      },
    ];
    tabs.forEach((tab) => {
      this.singleTab(element, tab.title, tab.active, tab.callback);
    });
  }

  render() {
    const debts_tab_element = document.createElement("div");
    debts_tab_element.classList = "debts-tab";
    this.debtTabs(debts_tab_element);
    return debts_tab_element;
  }
}
