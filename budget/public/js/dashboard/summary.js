export default class SummaryCard {
  constructor(title) {
    this.title = title;
  }

  summarySpecialTitle(element) {
    const summary_title = document.createElement("div");
    summary_title.classList = "summary-special-title";
    summary_title.textContent = this.title;
    element.append(summary_title);
  }

  summaryAmountTitle(element) {
    const summary_title = document.createElement("div");
    summary_title.classList = "summary-amount-title";
    summary_title.textContent = this.title;
    element.append(summary_title);
  }

  summaryBalanceTitle(element) {
    const summary_title = document.createElement("div");
    summary_title.classList = "summary-balance-title";
    summary_title.textContent = "balance";
    element.append(summary_title);
  }

  summaryTitle(element) {
    const summary_title = document.createElement("div");
    summary_title.classList = "summary-title";
    this.summarySpecialTitle(summary_title);
    this.summaryBalanceTitle(summary_title);
    element.append(summary_title);
  }

  summaryAmount(element, amount) {
    const summary_amount = document.createElement("div");
    summary_amount.classList = "summary-amount";
    summary_amount.textContent = `KSh ${amount}`;
    element.append(summary_amount);
  }

  summaryAmountBalance(element, balance) {
    const summary_balance = document.createElement("div");
    summary_balance.classList = "summary-balance";
    summary_balance.textContent = `KSh ${balance}`;
    element.append(summary_balance);
  }

  summaryMoney(element, amount, balance) {
    const summary_money = document.createElement("div");
    summary_money.classList = "summary-money";
    this.summaryAmount(summary_money, amount);
    this.summaryAmountBalance(summary_money, balance);
    element.append(summary_money);
  }

  render() {
    const summary_card = document.createElement("div");
    summary_card.classList = "summary-card";
    return summary_card;
  }
}
