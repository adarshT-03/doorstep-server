const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const PORT = process.env.PORT || 4000;

const mongoUri =
  "mongodb+srv://adarsh:adarsh@cluster0.gbtc5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "jhuguiy(*@(*&*(#$8u49579434759847)(!*)(&)(&!$xquyeriuhkj&*(&*#fhgfjkghjhalkhjhfg";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((e) => console.log(e));

app.use(express.json());
app.get("/", async (req, res) => {
  res.send("OOOHHHHOOO");
});

//////////////////////////////////////////////////////////////////////////////////

require("./userDetails");
const User = mongoose.model("UserInfo");

app.post("/register-new-user", async (req, res) => {
  console.log(req.body);
  const {
    name,
    email,
    encryptedPassword,
    userType,
    ifsc,
    accountNumber,
    aadhar,
    licenseId,
    taxiNumber,
    status,
  } = req.body;
  console.log(req.body);

  const password = await bcrypt.hash(encryptedPassword, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.json({
        error: "User already exists with same email",
      });
    }
    const user = await User.create({
      status,
      name,
      email,
      password,
      userType,
      ifsc,
      accountNumber,
      aadhar,
      licenseId,
      taxiNumber,
    });
    console.log(user, "uuu");
  } catch (error) {
    console.log(error, "new user cannot be created");
    res.json({ status: "error" });
  }
  res.json({ status: "ok" });
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email,
  }).lean();

  if (!user) {
    return res.json({ status: "error", error: "User Not found" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        email: user.email,
      },
      JWT_SECRET
    );
    console.log(user.status, "stat");

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({
        status: "warning",
        data: { userStatus: user.status, userType: user.type },
      });
    }
  }
  res.json({ status: "error", error: "Invalid mobile/password" });
});

app.post("/user-details", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(JSON.parse(token), JWT_SECRET);
    console.log(user);

    const useremail = user.email;

    User.findOne({ email: useremail })
      .then((data) => {
        console.log(data, "dat");
        return res.json({ status: "ok", data: data });
      })
      .catch((err) => {
        return res.json({ status: "error", error: err });
      });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: error });
  }
});

app.post("/get-user-details", async (req, res) => {
  const { userType } = req.body;
  console.log(req.body);
  try {
    User.find({ userType: userType }).then((data) => {
      console.log(data);
      res.json({ status: "ok", data: data });
    });
  } catch (error) {
    res.json({ status: "error", error: error });
  }
});
app.post("/update-user-details", async (req, res) => {
  const { id, status } = req.body;
  console.log(req.body);
  try {
    User.findOne({ _id: id }).then((data) => {
      console.log(data);
      User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            status: status,
          },
        },
        { overwrite: false, new: true },
        function (err, res) {
          console.log(res, err);
        }
      );
      res.json({ status: "ok", data: "updated" });
    });
  } catch (error) {
    res.json({ status: "error", error: error });
  }
});

/////////////////////////////////////////////////////////////////////////////////

require("./orderDetails");
const Order = mongoose.model("OrderInfo");

app.post("/add-order", async (req, res) => {
  const {
    nameO,
    source,
    destination,
    date,
    weight,
    noofitems,
    price,
    placedBy,
    distance,
  } = req.body;
  try {
    const order = await Order.create({
      nameO,
      source,
      destination,
      date,
      weight,
      noofitems,
      price,
      placedBy,
      distance,
    });

    console.log(placedBy, "usOrder");
    try {
      User.findOne({ _id: placedBy.userid }).then((data) => {
        console.log(data);
        var totalOrdersPlaced = new Array();

        if (data.orderPlaced == undefined || data.orderPlaced == "") {
          totalOrdersPlaced.push(order._id.toString());
        } else {
          totalOrdersPlaced = [...data.orderPlaced, order._id.toString()];
          console.log(totalOrdersPlaced, "yesss");
        }
        User.updateOne(
          {
            _id: placedBy.userid,
          },
          {
            $set: {
              orderPlaced: totalOrdersPlaced,
            },
          },
          { overwrite: false, new: true },
          function (err, res) {
            console.log(res, err);
          }
        );
      });
    } catch (error) {}
  } catch (error) {
    console.log(error, "new order cannot be created");
    res.json({ status: "error" });
  }
  res.json({ status: "ok" });
});

app.post("/accept-order", async (req, res) => {
  const { status, orderId, acceptedBy } = req.body;
  try {
    Order.updateOne(
      { _id: orderId },
      {
        $set: {
          acceptedBy,
          status,
        },
      },
      { overwrite: false, new: true },
      function (err, res) {
        console.log(res, err);
      }
    );

    User.findOne({ _id: acceptedBy.driverId }).then((data) => {
      console.log(data.orderAccepted, "oA");
      var totalOrdersPlaced = new Array();

      if (data.orderAccepted == undefined || data.orderAccepted == "") {
        totalOrdersPlaced.push(orderId.toString());
        console.log(totalOrdersPlaced, "y");
      } else {
        totalOrdersPlaced = [...data.orderAccepted, orderId.toString()];
        console.log(totalOrdersPlaced, "yesss");
      }
      User.updateOne(
        {
          _id: acceptedBy.driverId,
        },
        {
          $set: {
            orderAccepted: totalOrdersPlaced,
          },
        },
        { overwrite: false, new: true },
        function (err, res) {
          console.log(res, err);
        }
      );
    });
  } catch (error) {
    res.json({ error: "error" });
  }
  res.json({ status: "ok" });
});

app.post("/get-user-orders", async (req, res) => {
  const { orderId } = req.body;
  console.log(orderId, "ddd");
  try {
    Order.find({ _id: { $in: orderId } }).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    res.send(error);
  }
});

app.post("/get-order-details", async (req, res) => {
  const { status } = req.body;
  if (status == "all") {
    Order.find({})
      .then((data) => {
        res.json({ status: "ok", data: data });
      })
      .catch((err) => {
        res.json({ status: "ok", error: err });
      });
  } else {
    Order.find({ status: status })
      .then((data) => {
        res.json({ status: "ok", data: data });
      })
      .catch((err) => {
        res.json({ status: "ok", error: err });
      });
  }
});

app.listen(PORT, () => {
  console.log(`Connected to database on ${PORT} `);
});
