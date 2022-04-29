const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    token: String,
    userType: String,
    taxiNumber: String,
    licenseId: String,
    aadhar: String,
    accountNumber: String,
    ifsc: String,
    orderPlaced: Array,
    orderAccepted: Array,
    status: { type: Number, default: 0 },
  },
  { collection: "UserInfo" }
);

mongoose.model("UserInfo", UserDetailSchema);
