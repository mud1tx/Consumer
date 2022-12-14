const Product = require("../models/products");
const fs = require("fs");
const Order = require("../models/order");
const User = require("../models/user");
const Conversation = require("../models/conversation");
const Message = require("../models/message");

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const category = req.body.category;
  const images = req.files;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.body.userId;
  if (!images) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return next(error);
  }
  // convert images into base64 encoding
  let imgArray = images.map((file) => {
    let img = fs.readFileSync(file.path);
    return (en = img.toString("base64"));
  });
  const imageArray = [];
  const imageTypeArray = [];
  const imageNameArray = [];
  imgArray.map((src, index) => {
    imageNameArray.push(images[index].originalname);
    imageTypeArray.push(images[index].mimetype);
    imageArray.push(src);
  });
  const product = new Product({
    title: title,
    category: category,
    imageName: imageNameArray,
    imageType: imageTypeArray,
    image: imageArray,
    price: price,
    description: description,
    userId: userId,
    borrowed: false,
  });
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
  // res.json(product);
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.body.userId })
    .then((products) => {
      return res.json({ ok: true, userProducts: products });
    })
    .catch((err) => console.log(err));
};

exports.postOrderData = (req, res, next) => {
  const userId = req.body.userId;
  const productData = req.body.prodData;
  const days = Number(req.body.days);
  const currentTime = Date.now();
  const prodId = productData._id;
  console.log(userId, productData.userId, days);
  Order.findOne({ userId: userId }).then((user) => {
    if (!user) {
      const prodArray = [];
      prodArray.push({
        productId: productData._id,
        expire: currentTime + days * 24 * 60 * 60 * 1000,
      });
      const order = new Order({
        products: prodArray,
        userId: userId,
      });
      order.save();
      Product.findOne({ _id: prodId })
        .then((prod) => {
          prod.borrowed = true;
          return prod.save();
        })
        .catch((err) => {
          console.log(err);
        });
      const borrowArray = [];
      const lendArray = [];
      borrowArray.push({
        productId: productData._id,
        expire: currentTime + days * 24 * 60 * 60 * 1000,
      });
      lendArray.push({
        productId: productData._id,
        expire: currentTime + days * 24 * 60 * 60 * 1000,
      });
      User.findOne({ _id: userId })
        .then((user) => {
          // console.log("catch 1", user);
          user.borrow = borrowArray;
          return user.save();
        })
        .catch((err) => {
          console.log(err);
        });
      const productOwnerId = productData.userId;
      User.findOne({ _id: productOwnerId })
        .then((user) => {
          // console.log("catch 2", user);
          user.lend = lendArray;
          return user.save();
        })
        .catch((err) => {
          console.log(err);
        });
      return res.json({ ok: true, message: "data aa gaya yaar pehle baar" });
    } else {
      // const prodId = productData._id;
      console.log(user);
      user.products.push({
        productId: productData._id,
        expire: currentTime + days * 24 * 60 * 60 * 1000,
      });
      user.save();
      Product.findOne({ _id: prodId })
        .then((prod) => {
          prod.borrowed = true;
          return prod.save();
        })
        .catch((err) => {
          console.log(err);
        });
      User.findOne({ _id: userId })
        .then((user) => {
          user.borrow.push({
            productId: productData._id,
            expire: currentTime + days * 24 * 60 * 60 * 1000,
          });
          return user.save();
        })
        .catch((err) => {
          console.log(err);
        });
      const productOwnerId = productData.userId;
      User.findOne({ _id: productOwnerId })
        .then((user) => {
          user.lend.push({
            productId: productData._id,
            expire: currentTime + days * 24 * 60 * 60 * 1000,
          });
          return user.save();
        })
        .catch((err) => {
          console.log(err);
        });
      return res.json({ ok: true, message: "data aa gaya yaar doosre baar" });
    }
  });
  return;
};

exports.postLendData = (req, res, next) => {
  const userId = req.body.userId;
  User.findOne({ _id: userId })
    .then((user) => {
      if (user.lend.length === 0) {
        return res.json({ ok: false, msg: "No product is lended to anyone" });
      }
      return Product.find({ userId: userId, borrowed: true })
        .then((data) => {
          return res.json({ ok: true, data: data });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postBorrowData = (req, res, next) => {
  const userId = req.body.userId;
  User.findOne({ _id: userId })
    .then((user) => {
      if (user.borrow.length === 0) {
        return res.json({
          ok: false,
          msg: "No product is borrowed from anyone",
        });
      }
      const array = [];
      user.borrow.map((data) => {
        array.push(data.productId);
      });
      return Product.find({ _id: [array] })
        .then((data) => {
          return res.json({ ok: true, data: data });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getFriendId = async (req, res, next) => {
  const friendId = req.params.friendId;
  // console.log("re", req);
  User.findOne({ _id: friendId })
    .then((user) => {
      res.json({ ok: true, data: user });
    })
    .catch((err) => {
      res.json({ ok: false, err: err });
    });
};

exports.postNewConv = async (req, res, next) => {
  // console.log(req.body.senderId, req.body.receiverId);
  const senderId = req.body.senderId;
  const receiverId = req.body.receiverId;
  Conversation.findOne({
    members: [senderId, receiverId],
  })
    .then((conv) => {
      if (conv) {
        // console.log("hai yaar pehle se");
        return res.json({ ok: true, msg: "Conversation is already present" });
      }
      const newConversation = new Conversation({
        members: [senderId, receiverId],
      });
      newConversation
        .save()
        .then((result) => {
          console.log("Conv created");
          res.json({ ok: true, conversation: newConversation });
        })
        .catch((err) => {
          res.json({ ok: false, msg: err });
        });
    })
    .catch((err) => {
      res.json({ ok: false, msg: err });
    });
};

exports.getUserConv = async (req, res, next) => {
  try {
    Conversation.find({
      members: { $in: [req.params.userId] },
    }).then((data) => {
      // console.log("data", data);
      res.json({ ok: true, data: data });
    });
  } catch (err) {
    res.json({ ok: false, msg: err });
  }
};

exports.postChatData = async (req, res, next) => {
  const conversationId = req.body.message.conversationId;
  const senderId = req.body.message.senderId;
  const text = req.body.message.text;
  const newMessage = new Message({ conversationId, senderId, text });
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getChatData = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};
