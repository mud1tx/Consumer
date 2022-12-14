const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageName: {
    type: [String],
    required: true,
  },
  imageType: {
    type: [String],
    required: true,
  },
  image: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  borrowed: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
