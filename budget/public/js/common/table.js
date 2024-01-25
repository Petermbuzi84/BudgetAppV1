import Form from "./form.js";
import { connectToServer } from "./server.js";

let original_max_count = 8;
export let max_count = original_max_count;

export default class Table {
  tableColumn(element, option) {
    const column = document.createElement("div");
    column.classList = "table-column";
    column.textContent = option;
    element.append(column);
  }

  tableRow(options) {
    const row = document.createElement("div");
    row.classList = "table-row";
    options.forEach((option) => {
      this.tableColumn(row, option);
    });
    return row;
  }

  tableHeadings(element, headings) {
    const row = this.tableRow(headings);
    row.classList.add("table-headings");
    element.append(row);
  }

  tableRowIcon(element, action, index) {
    const icon_container = document.createElement("div");
    icon_container.classList = "table-row-icon";
    icon_container.setAttribute(`data-${action.title}`, index);
    const icon_img = document.createElement("img");
    icon_img.src = `images/${action.title}.png`;
    icon_img.alt = "";
    icon_img.setAttribute(`data-${action.title}`, index);
    icon_container.append(icon_img);
    icon_container.addEventListener("click", action.callback);
    element.append(icon_container);
  }

  showEditForm(search_id, items, EditForm) {
    items.forEach((item) => {
      if (item._id === search_id) {
        const body = document.querySelector("body");
        const edit = new EditForm();
        body.append(edit.render(item));
      }
    });
  }

  tableEdit(edit_index, edit_action) {
    const table_rows = document.querySelectorAll(".table-row");
    table_rows.forEach((row) => {
      const index = parseInt(row.dataset.row);
      if (index === edit_index) {
        const table_columns = row.querySelectorAll(".table-column");
        const column_id = table_columns[0].textContent;
        this.showEditForm(column_id, edit_action.data, edit_action.edit_form);
      }
    });
  }

  tableDelete(delete_index, action_path, redirect_path) {
    const table_rows = document.querySelectorAll(".table-row");
    table_rows.forEach((row) => {
      const index = parseInt(row.dataset.row);
      if (index === delete_index) {
        const table_columns = row.querySelectorAll(".table-column");
        const column_id = table_columns[0].textContent;
        connectToServer(`${action_path}/${column_id}`, () => {
          location = `/${redirect_path}`;
        });
      }
    });
  }

  tableItemActions(element, index, specialAction, edit_action, delete_action) {
    // edit_action = {data: data_list, edit_form: EditForm}
    // delete_action = {action: "my_path", "redirect": "to_path"}
    const actions = [];
    specialAction(actions);
    actions.push({
      title: "edit",
      callback: (e) => {
        const target_index = parseInt(e.target.dataset.edit);
        const table_row_icons = document.querySelectorAll(".table-row-icon");
        table_row_icons.forEach((row_icons) => {
          const row_icons_index = parseInt(row_icons.dataset.edit);
          if (row_icons_index === target_index) {
            this.tableEdit(target_index, edit_action);
          }
        });
      },
    });
    actions.push({
      title: "del",
      callback: (e) => {
        const target_index = parseInt(e.target.dataset.del);
        const table_row_icons = document.querySelectorAll(".table-row-icon");
        table_row_icons.forEach((row_icons) => {
          const row_icons_index = parseInt(row_icons.dataset.del);
          if (row_icons_index === target_index) {
            this.tableDelete(
              target_index,
              delete_action.action,
              delete_action.redirect
            );
          }
        });
      },
    });
    const column = document.createElement("div");
    column.classList = "table-column table-column-actions";
    actions.forEach((action) => {
      this.tableRowIcon(column, action, index);
    });
    element.append(column);
  }

  tableWrapper() {
    const table_wrapper = document.createElement("div");
    table_wrapper.classList = "table-wrapper";
    return table_wrapper;
  }
}

export class TablePages extends Form {
  constructor(category, ItemsTable) {
    super();
    this.category = category;
    this.ItemsTable = ItemsTable;
  }

  tableRowShowing(element, items) {
    const pages = [];
    const page_count = this.pageCount(items);
    for (let i = 0; i < page_count; i++) {
      const page = i + 1;
      pages.push(page);
    }
    const table_row_showing = document.createElement("div");
    table_row_showing.classList = "table-row-showing";
    const page_active = parseInt(
      localStorage.getItem(`${this.category}_active_page`)
    );
    max_count = page_active * original_max_count;
    const showing = document.createElement("div");
    showing.classList = "table-showing";
    showing.textContent = `Showing ${page_active} out of ${page_count} pages of ${items.length} ${this.category}`;
    const select = this.selectElement(
      pages,
      "table_row_count",
      "table-row-count"
    );
    select.value = page_active;
    select.addEventListener("change", (e) =>
      this.openSelectedPage(e.target.value, items)
    );
    const per_page = document.createElement("div");
    per_page.classList = "rows-per-page";
    per_page.textContent = "rows per page";
    table_row_showing.append(showing, select, per_page);
    element.append(table_row_showing);
  }

  pageCard(element, content, active, callback) {
    const page_card = document.createElement("div");
    page_card.classList = `page-card ${active ? "active-page" : ""}`;
    page_card.textContent = content;
    page_card.addEventListener("click", callback);
    element.append(page_card);
  }

  pageCount(items) {
    return Math.ceil(items.length / original_max_count);
  }

  updateTableShowing(items, page_active) {
    const table_showing = document.querySelector(".table-showing");
    const page_count = this.pageCount(items);
    table_showing.textContent = `Showing ${page_active} out of ${page_count} pages of ${items.length} ${this.category}`;
  }

  updatePageNumber(items, page) {
    const page_cards = document.querySelectorAll(".page-card");
    page_cards.forEach((card) => {
      if (card.classList.contains("active-page") && card.textContent != page) {
        card.classList.remove("active-page");
      }
      if (card.textContent == page) {
        card.classList.add("active-page");
        localStorage.setItem(`${this.category}_active_page`, card.textContent);
        const table_row_count = document.getElementById("table-row-count");
        table_row_count.value = card.textContent;
        this.updateTableShowing(items, card.textContent);
      }
    });
  }

  openSelectedPage(page, items) {
    const number = parseInt(page);
    const expense_table = new this.ItemsTable(items);
    max_count = original_max_count * number;
    expense_table.removeTableContainer();
    const table_wrapper = document.querySelector(".table-wrapper");
    expense_table.tableContainer(table_wrapper);
    this.updatePageNumber(items, page);
  }

  pageNumbers(element, items) {
    const pages = this.pageCount(items);
    this.pageCard(element, "<", false, ({ target }) => {});
    for (let i = 0; i < pages; i++) {
      const page = i + 1;
      const active_page = localStorage.getItem(`${this.category}_active_page`);
      if (active_page && parseInt(active_page) === page) {
        this.pageCard(element, page, true, (e) =>
          this.openSelectedPage(e.target.textContent, items)
        );
      } else if (!active_page) {
        this.pageCard(element, page, true, (e) =>
          this.openSelectedPage(e.target.textContent, items)
        );
        localStorage.setItem(`${this.category}_active_page`, page);
      } else {
        this.pageCard(element, page, false, (e) =>
          this.openSelectedPage(e.target.textContent, items)
        );
      }
    }
    this.pageCard(element, ">", false, ({ target }) => {});
  }

  removeTableContainer() {
    const table_container = document.querySelector(".table-container");
    if (table_container) {
      table_container.remove();
    }
  }

  tablePages(element, items) {
    const table_pages = document.createElement("div");
    table_pages.classList = "table-pages";
    this.pageNumbers(table_pages, items);
    element.append(table_pages);
  }

  render(items, in_max_count) {
    original_max_count = in_max_count;
    max_count = in_max_count;
    const table_navigations = document.createElement("div");
    table_navigations.classList = "table-navigations";
    this.tableRowShowing(table_navigations, items);
    this.tablePages(table_navigations, items);
    return table_navigations;
  }
}
