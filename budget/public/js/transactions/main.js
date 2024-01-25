import navbarRender from "../common/navbar.js";
import { connectToServer } from "../common/server.js";
import sideBarLinks from "../common/side_bar.js";
import MPesaTransactions from "./mpesa/main.js";

function main() {
  navbarRender();
  sideBarLinks("transactions");
  const main = document.querySelector("main");
  const mpesa = new MPesaTransactions();
  connectToServer("transactions", (transactions) => {
    main.append(mpesa.render(transactions));
  });
}
main();
