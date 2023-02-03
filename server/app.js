const path = require("path");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const User = require("./models/user");
const Product = require("./models/products");
const stripe = require("stripe")(
  "sk_test_51LO0nNSBfCKAZDAkBeBjpCVA6hhotgxyEnPbKPTBytitrHihIop2OisbrkDeJUm6WNqXIokkhkzGvk4Oi9uQnzLt001gpYggAm"
);

const MONGODB_URI =
  "mongodb+srv://Mudit:firstbest@cluster0.e7bmssl.mongodb.net/shop";

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
app.use(
  cors({
    origin: ["http://localhost:3000"],
    method: ["GET", "POST"],
    credentials: true,
  })
);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);


User.find()
  .then((user) => {
    for (let i = 0; i < user.length; i++) {
      if (user[i].lend?.length > 0) {
        User.findOne({ _id: user[i]._id })
          .then((us) => {
            for (let i = 0; i < us.lend.length; i++) {
              if (us.lend[i].expire < Date.now()) {
                Product.findOne({ _id: us.lend[i].productId })
                  .then((prod) => {
                    prod.borrowed = false;
                    prod.save();
                    return;
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                us.lend.splice(i, 1);
              }
            }
            us.save();
          })
          .catch((err) => console.log(err));
      }
      if (user[i].borrow?.length > 0) {
        User.findOne({ _id: user[i]._id })
          .then((us) => {
            for (let i = 0; i < us.borrow.length; i++) {
              if (us.borrow[i].expire < Date.now()) {
                Product.findOne({ _id: us.borrow[i].productId })
                  .then((prod) => {
                    prod.borrowed = false;
                    prod.save();
                    return;
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                us.borrow.splice(i, 1);
              }
            }
            us.save();
          })
          .catch((err) => console.log(err));
      }
    }
    return;
  })
  .catch((err) => console.log(err));
// next();
// });

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(5000);
    console.log("listening at port 5000");
  })
  .catch((err) => {
    console.log(err);
  });
