const mongoose = require("mongoose");

const OrderDetailSchema = new mongoose.Schema(
  {
    nameO: String,
    source: String,
    destination: String,
    date: String,
    weight: String,
    noofitems: String,
    price: String,
    placedBy: Object,
    acceptedBy: Object,
    status: { type: String, default: 0 },
  },
  { collection: "OrderInfo" }
);

mongoose.model("OrderInfo", OrderDetailSchema);
