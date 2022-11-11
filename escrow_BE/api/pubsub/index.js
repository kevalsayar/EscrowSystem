const events = require("events");
const { sendEmail } = require("./../common/helpers");
const em = new events.EventEmitter();

em.on("welcome", function (data) {
  data.subject = "Deal created";
  data.sendToEmail = data.buyer_email;
  sendEmail(data, "welcome");
});

em.on("register", function (data) {
  console.log("User registered");
});

em.on("deal-funded", function (data) {
  data.subject = "Deal funded";
  data.sendToEmail = data.buyer_email;
  data.message = " Check your deal status!";
  sendEmail(data, "deal-funded");
  data.sendToEmail = data.seller_email;
  data.message = " Accept or reject deal!";
  sendEmail(data, "deal-funded");
});

em.on("deal-accepted", function (data) {
  data.subject = "Deal accepted";
  sendEmail(data, "deal-accepted");
});

em.on("deal-fund-released", function () {
  sendEmail(data, "fund-released");
});

module.exports = { em };
