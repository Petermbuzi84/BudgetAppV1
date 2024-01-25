import { connectToServer } from "./server.js";

class Navbar {
  logo() {
    const logo_element = document.createElement("a");
    logo_element.classList = "logo";
    logo_element.href = "/";
    const logo_image = document.createElement("img");
    logo_image.src = "images/logo.png";
    logo_image.alt = "";
    const logo_text = document.createElement("span");
    logo_text.textContent = "budget";
    logo_element.append(logo_image, logo_text);
    return logo_element;
  }

  profileContainer(balance_amount) {
    const profile_container = document.createElement("div");
    profile_container.classList = "profile-container";
    const balance_element = document.createElement("div");
    balance_element.classList = "balance";
    const currency = document.createElement("span");
    currency.classList = "currency";
    currency.textContent = "KSh";
    const amount = document.createElement("span");
    amount.classList = "amount";
    amount.textContent = balance_amount === 0 ? "0.00" : balance_amount;
    balance_element.append(currency, amount);
    profile_container.append(balance_element);
    return profile_container;
  }

  render(balance_amount) {
    const nav = document.createElement("div");
    nav.classList = "navbar";
    nav.append(this.logo(), this.profileContainer(balance_amount));
    return nav;
  }
}

export default function navbarRender() {
  connectToServer("balance", ({ balance }) => {
    const nav = document.querySelector("nav");
    const navbar = new Navbar();
    nav.append(navbar.render(balance));
  });
}
