const mongoose = require("mongoose");

const OrderDetailSchema = new mongoose.Schema(
  {
    nameO: String,
    source: Object,
    destination: Object,
    date: String,
    weight: String,
    noofitems: String,
    price: String,
    placedBy: Object,
    acceptedBy: Object,
    distance: String,
    status: { type: String, default: 0 },
  },
  { collection: "OrderInfo" }
);

mongoose.model("OrderInfo", OrderDetailSchema);
