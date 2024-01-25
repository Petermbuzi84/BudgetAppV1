import navbarRender from "../common/navbar.js";
import { connectToServer } from "../common/server.js";
import sideBarLinks from "../common/side_bar.js";
import InvestmentsNav from "./nav.js";
import investmentsTable from "./table.js";

class Investment {
  render(investments) {
    const investment_element = document.createElement("div");
    investment_element.classList = "investments";
    const investment_nav = new InvestmentsNav();
    investment_element.append(investment_nav.render());
    const investment_table = new investmentsTable(investments);
    investment_element.append(investment_table.render());
    return investment_element;
  }
}

function main() {
  navbarRender();
  sideBarLinks("investments");
  connectToServer("investments", (investments) => {
    const main = document.querySelector("main");
    const investment = new Investment();
    main.append(investment.render(investments));
  });
}
main();
