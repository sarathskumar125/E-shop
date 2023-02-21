import mongoose from "mongoose";

const pendingProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    discount: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    description: { type: String, required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    status:{type: String, default:"pending"}
  },
  {
    timestamps: true,
  }
);

const PendingProducts = mongoose.model("PendingProducts", pendingProductSchema);
export default PendingProducts;
