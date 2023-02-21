import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  image: { type: String, required: true },
  discount: { type: Number, required: true },
  countInStock: { type: Number, required: true },
  description: { type: String, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, default: "verified" },
  createdAt: { type: mongoose.Schema.Types.Date, required: true },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
