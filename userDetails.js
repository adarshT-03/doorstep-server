const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    token: String,
    userType: String,
    orderPlaced:Array,
    orderAccepted:Array
  },
  { collection: "UserInfo" }
);

mongoose.model("UserInfo", UserDetailSchema);
