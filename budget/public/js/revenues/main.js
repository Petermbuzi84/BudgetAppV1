import navbarRender from "../common/navbar.js";
import { connectToServer } from "../common/server.js";
import sideBarLinks from "../common/side_bar.js";
import Table, { TablePages, max_count } from "../common/table.js";
import EditRevenue from "./edit.js";

let original_max_count = 9;

class RevenuesNav {
  searchBar() {
    const search_bar = document.createElement("div");
    search_bar.classList = "search-bar";
    const search_input = document.createElement("input");
    search_input.type = "text";
    search_input.name = "search_revenues";
    search_input.placeholder = "search revenues";
    search_bar.append(search_input);
    return search_bar;
  }

  addRevenueButtonStyle(add_revenue_button) {
    const color = "green";
    add_revenue_button.style.border = `2px solid ${color}`;
    add_revenue_button.style.color = color;
  }

  buttons() {
    const button_container = document.createElement("div");
    button_container.classList = "revenues-buttons";
    const add_revenue_button = document.createElement("button");
    add_revenue_button.classList = "add-revenue";
    add_revenue_button.textContent = "add revenue";
    add_revenue_button.addEventListener("click", () => {
      location = "/add_revenue";
    });
    this.addRevenueButtonStyle(add_revenue_button);
    button_container.append(add_revenue_button);
    return button_container;
  }

  render() {
    const revenue_nav = document.createElement("div");
    revenue_nav.classList = "revenues-nav";
    revenue_nav.append(this.searchBar(), this.buttons());
    return revenue_nav;
  }
}

class RevenuesTab {
  render() {
    const revenue_tab = document.createElement("div");
    revenue_tab.classList = "revenues-tab";
    return revenue_tab;
  }
}

class RevenuesTable extends Table {
  constructor(revenues) {
    super();
    this.revenues = revenues;
  }

  removeTableContainer() {
    const table_container = document.querySelector(".table-container");
    if (table_container) {
      table_container.remove();
    }
  }

  tableContents(element) {
    for (let i = max_count - original_max_count; i < max_count; i++) {
      if (i === this.revenues.length) {
        break;
      }
      const revenue = this.revenues[i];
      const options = [
        revenue._id,
        revenue.source,
        revenue.category,
        revenue.amount,
        revenue.received,
        revenue.payment.method,
        revenue.payment.transaction.id,
        revenue.payment.transaction.name,
      ];
      const row = this.tableRow(options);
      row.setAttribute("data-row", i);
      this.tableItemActions(
        row,
        i,
        () => {},
        { data: this.revenues, edit_form: EditRevenue },
        { action: "remove_revenue", redirect: "revenues" }
      );
      element.append(row);
    }
  }

  tableContainer(element) {
    const table_container = document.createElement("div");
    table_container.classList = "table-container";
    const headings = [
      "id",
      "source",
      "category",
      "amount",
      "received",
      "payment method",
      "transaction id",
      "transaction name",
      "actions",
    ];
    this.tableHeadings(table_container, headings);
    this.tableContents(table_container);
    element.append(table_container);
  }

  render() {
    const table_pages = new TablePages("revenues", RevenuesTable);
    const revenue_table = document.createElement("div");
    revenue_table.classList = "revenues-table";
    const wrapper = this.tableWrapper();
    if (this.revenues.length > original_max_count) {
      revenue_table.append(
        wrapper,
        table_pages.render(this.revenues, original_max_count)
      );
    }
    this.tableContainer(wrapper);
    return revenue_table;
  }
}

class Revenues {
  remove() {
    const revenues = document.querySelector(".revenues");
    if (revenues) {
      revenues.remove();
    }
  }

  render(revenues) {
    const revenues_element = document.createElement("div");
    revenues_element.classList = "revenues";
    const revenues_nav = new RevenuesNav();
    revenues_element.append(revenues_nav.render());
    const revenues_tab = new RevenuesTab();
    revenues_element.append(revenues_tab.render());
    const revenues_table = new RevenuesTable(revenues);
    revenues_element.append(revenues_table.render());
    return revenues_element;
  }
}

function main() {
  navbarRender();
  sideBarLinks("revenues");
  const main = document.querySelector("main");
  const revenue = new Revenues();
  connectToServer("revenues", (revenues) => {
    main.append(revenue.render(revenues));
  });
}
main();
