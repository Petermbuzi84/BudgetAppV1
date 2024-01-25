import navbarRender from "../common/navbar.js";
import { connectToServer } from "../common/server.js";
import sideBarLinks from "../common/side_bar.js";
import SummaryCard from "./summary.js";

function summarizeRevenues(element) {
  const card = new SummaryCard("revenues");
  connectToServer("total_revenue", ({ amount, balance }) => {
    const summary = card.render();
    card.summaryTitle(summary);
    card.summaryMoney(summary, amount, balance);
    element.append(summary);
  });
}

function summarizeProductExpenses(element) {
  const card = new SummaryCard("product expenses");
  connectToServer("expenses/products/total", ({ total }) => {
    const summary = card.render();
    card.summaryAmountTitle(summary);
    card.summaryAmount(summary, total);
    element.append(summary);
  });
}

function summarizeTravelExpenses(element) {
  const card = new SummaryCard("travel expenses");
  connectToServer("expenses/travels/total", ({ total }) => {
    const summary = card.render();
    card.summaryAmountTitle(summary);
    card.summaryAmount(summary, total);
    element.append(summary);
  });
}

function summarizeBills(element) {
  const card = new SummaryCard("bills");
  connectToServer("total_bills", ({ total }) => {
    const summary = card.render();
    card.summaryAmountTitle(summary);
    card.summaryAmount(summary, total);
    element.append(summary);
  });
}

function summarizeProductDebts(element) {
  const card = new SummaryCard("product debts");
  connectToServer("debts/products/total", ({ amount, balance }) => {
    const summary = card.render();
    card.summaryTitle(summary);
    card.summaryMoney(summary, amount, balance);
    element.append(summary);
  });
}

function summarizeBillDebts(element) {
  const card = new SummaryCard("bill debts");
  connectToServer("debts/bills/total", ({ amount, balance }) => {
    const summary = card.render();
    card.summaryTitle(summary);
    card.summaryMoney(summary, amount, balance);
    element.append(summary);
  });
}

function summarizeInvestments(element) {
  const card = new SummaryCard("investments");
  connectToServer("total_investments", ({ total }) => {
    const summary = card.render();
    card.summaryAmountTitle(summary);
    card.summaryAmount(summary, total);
    element.append(summary);
  });
}

function summarizeTransactions(element) {
  const card = new SummaryCard("transactions");
  connectToServer("total_transactions", ({ total }) => {
    const summary = card.render();
    card.summaryAmountTitle(summary);
    card.summaryAmount(summary, total);
    element.append(summary);
  });
}

function main() {
  navbarRender();
  sideBarLinks("dashboard");
  const main_element = document.querySelector("main");
  const cards = document.createElement("div");
  cards.classList = "summary-cards";
  summarizeRevenues(cards);
  summarizeProductExpenses(cards);
  summarizeTravelExpenses(cards);
  summarizeBills(cards);
  summarizeProductDebts(cards);
  summarizeBillDebts(cards);
  summarizeInvestments(cards);
  summarizeTransactions(cards);
  main_element.append(cards);
}
main();
