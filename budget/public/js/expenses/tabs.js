import { connectToServer } from "../common/server.js";
import ProductExpensesNav from "./products/nav.js";
import ProductExpensesTable from "./products/table.js";
import TravelExpensesNav from "./travel/nav.js";
import TravelExpensesTable from "./travel/table.js";

export default class ExpensesTab {
  constructor(category, expenses) {
    this.category = category;
    this.expenses = expenses;
  }

  singleTab(element, title, active, callback) {
    const tab = document.createElement("div");
    tab.classList = `tab ${active}`;
    tab.textContent = title;
    tab.addEventListener("click", callback);
    element.append(tab);
  }

  removeActiveExpense() {
    const expenses_nav = document.querySelector(".expenses-nav");
    if (expenses_nav) {
      expenses_nav.remove();
    }
    const expenses_table = document.querySelector(".expenses-table");
    if (expenses_table) {
      expenses_table.remove();
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

  expenseTabs(element) {
    const tabs = [
      {
        title: "products",
        active: this.category === "products" ? "active-tab" : "",
        callback: (e) => {
          this.removeActiveExpense();
          this.removeActiveTabLink();
          e.target.classList.add("active-tab");
          localStorage.setItem("expense_category", "product");
          connectToServer("expenses/products", (products) => {
            const product_nav = new ProductExpensesNav();
            const product_table = new ProductExpensesTable(products);
            const expenses = document.querySelector(".expenses");
            expenses.append(product_nav.render(), product_table.render());
          });
        },
      },
      {
        title: "travel",
        active: this.category === "travel" ? "active-tab" : "",
        callback: (e) => {
          this.removeActiveExpense();
          this.removeActiveTabLink();
          e.target.classList.add("active-tab");
          localStorage.setItem("expense_category", "travel");
          connectToServer("expenses/travels", (travels) => {
            const travel_nav = new TravelExpensesNav();
            const travel_table = new TravelExpensesTable(travels);
            const expenses = document.querySelector(".expenses");
            expenses.append(travel_nav.render(), travel_table.render());
          });
        },
      },
    ];
    tabs.forEach((tab) => {
      this.singleTab(element, tab.title, tab.active, tab.callback);
    });
  }

  render() {
    const expenses_tab_element = document.createElement("div");
    expenses_tab_element.classList = "expenses-tab";
    this.expenseTabs(expenses_tab_element);
    return expenses_tab_element;
  }
}
