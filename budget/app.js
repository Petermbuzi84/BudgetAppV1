const express = require("express");
const port = 3000;
const app = express();

app.use(express.static(`${__dirname}/public`));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/views/dashboard/index.html`);
});

app.get("/revenues", (req, res) => {
  res.sendFile(`${__dirname}/views/revenues/index.html`);
});

app.get("/add_revenue", (req, res) => {
  res.sendFile(`${__dirname}/views/revenues/add.html`);
});

app.get("/expenses", (req, res) => {
  res.sendFile(`${__dirname}/views/expenses/index.html`);
});

app.get("/add_product_expense", (req, res) => {
  res.sendFile(`${__dirname}/views/expenses/add_product.html`);
});

app.get("/add_travel_expense", (req, res) => {
  res.sendFile(`${__dirname}/views/expenses/add_travel.html`);
});

app.get("/bills", (req, res) => {
  res.sendFile(`${__dirname}/views/bills/index.html`);
});

app.get("/add_bill", (req, res) => {
  res.sendFile(`${__dirname}/views/bills/add.html`);
});

app.get("/debts", (req, res) => {
  res.sendFile(`${__dirname}/views/debts/index.html`);
});

app.get("/add_product_debt", (req, res) => {
  res.sendFile(`${__dirname}/views/debts/add_product.html`);
});

app.get("/add_bill_debt", (req, res) => {
  res.sendFile(`${__dirname}/views/debts/add_bill.html`);
});

app.get("/investments", (req, res) => {
  res.sendFile(`${__dirname}/views/investments/index.html`);
});

app.get("/add_investment", (req, res) => {
  res.sendFile(`${__dirname}/views/investments/add.html`);
});

app.get("/transactions", (req, res) => {
  res.sendFile(`${__dirname}/views/transactions/index.html`);
});

app.get("/add_mpesa_transaction", (req, res) => {
  res.sendFile(`${__dirname}/views/transactions/add_mpesa.html`);
});

app.listen(port, console.log(`Budget App listening on port ${port}`));
