class SideBar {
  constructor(links, title) {
    this.links = links;
    this.title = title;
  }

  addActiveLink(side_link, link_title) {
    if (link_title === this.title) {
      side_link.classList.add("active-link");
    }
  }

  sideLink(element, icon, title, callbackEvent, index) {
    const side_link = document.createElement("div");
    side_link.classList = "side-link";
    this.addActiveLink(side_link, title);
    side_link.setAttribute("data-side_link", index);
    side_link.addEventListener("click", callbackEvent);
    const img = document.createElement("img");
    img.src = icon;
    img.alt = "";
    img.setAttribute("data-side_link", index);
    const span = document.createElement("span");
    span.setAttribute("data-side_link", index);
    span.textContent = title;
    side_link.append(img, span);
    element.append(side_link);
  }

  render() {
    const side_nav_container = document.createElement("div");
    side_nav_container.classList = "side-nav-container";
    this.links.forEach((link, index) => {
      this.sideLink(
        side_nav_container,
        link.icon,
        link.title,
        link.callback,
        index
      );
    });
    return side_nav_container;
  }
}

export default function sideBarLinks(link_title) {
  const links = [
    {
      icon: "images/dashboard.png",
      title: "dashboard",
      callback: () => {
        location = "/";
      },
    },
    {
      icon: "images/revenues.png",
      title: "revenues",
      callback: () => {
        location = "/revenues";
      },
    },
    {
      icon: "images/expenses.png",
      title: "expenses",
      callback: () => {
        location = "/expenses";
      },
    },
    {
      icon: "images/credit-card.png",
      title: "bills",
      callback: () => {
        location = "/bills";
      },
    },
    {
      icon: "images/debt.png",
      title: "debts",
      callback: () => {
        location = "/debts";
      },
    },
    {
      icon: "images/investment.png",
      title: "investments",
      callback: () => {
        location = "/investments";
      },
    },
    {
      icon: "images/transaction.png",
      title: "transactions",
      callback: () => {
        location = "/transactions";
      },
    },
  ];
  const header = document.querySelector("header");
  const side_bar = new SideBar(links, link_title);
  header.append(side_bar.render());
}
