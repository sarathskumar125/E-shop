import express, { query } from "express";
import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";
import PendingProducts from "../models/pendingProductModel.js";
import Product from "../models/productModel.js";
import { isAuth } from "../utils.js";
var objectId = mongoose.Types.ObjectId;

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.get(
  "/adminapproval",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const data = await PendingProducts.find({ status: "pending" });
    if (data) {
      res.send(data);
    } else {
      return;
    }
  })
);
productRouter.get(
  "/superadminverify",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const data = await PendingProducts.find({ status: "approved" });
    if (data) {
      res.send(data);
    } else {
      return;
    }
  })
);

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

const PAGE_SIZE = 3;
productRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const brand = query.brand || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const ratingFilter =
      rating && rating !== "all" ? { rating: { $gte: Number(rating) } } : {};
    const priceFilter =
      price && price !== "all"
        ? {
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get("/id/:id", async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });  
  if (product) { 
    // console.log(product);
    res.send(product);
  } else {
    res.status(404).send({ message: "product not found" });
  }
});

productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    // console.log(product);
    res.send(product);
  } else {
    res.status(404).send({ message: "product not found" });
  }
});

productRouter.post(
  "/addproduct",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const create = new PendingProducts({
      name: req.body.name,
      category: req.body.category,
      subCategory: req.body.subCategory,
      brand: req.body.brand,
      price: req.body.price,
      image: req.body.image,
      discount: req.body.discount,
      countInStock: req.body.countInStock,
      description: req.body.description,
      userID: req.body.userId,
    });
    await create.save();
    res.status(200).send({ message: "Post submitted for verification" });
  })
);

productRouter.get(
  "/useradminproducts/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const userProducts = await PendingProducts.find({ userID: objectId(id) });
    const userProducts2 = await Product.find({ userID: objectId(id) });
    const merge = userProducts2.concat(userProducts)
    // console.log(merge);
    try {
      // console.log(userProducts);
      res.send(merge);
    } catch (error) {
      res.send(error);
    }
  })
);

productRouter.post(
  "/approve",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.body.ID;
    try {
      await PendingProducts.updateOne(
        { _id: productId },
        { $set: { status: "approved" } }
      );
      res.status(200).send({ message: "Approved" });
    } catch (error) {
      res.send(error);
    }
  })
);

productRouter.post(
  "/verified",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.body.ID;
    const verifiedProduct = await PendingProducts.findById(productId);
    if (verifiedProduct) {
      const discountPrice =  verifiedProduct.discount !== 0
      ? (verifiedProduct.price -
        (verifiedProduct.price * verifiedProduct.discount) / 100).toFixed(2)
      : verifiedProduct.price
      const create = new Product({
        name: verifiedProduct.name,
        category: verifiedProduct.category,
        subCategory: verifiedProduct.subCategory,
        brand: verifiedProduct.brand,
        price: verifiedProduct.price,
        discountedPrice: discountPrice,
        image: verifiedProduct.image,
        discount: verifiedProduct.discount,
        countInStock: verifiedProduct.countInStock,
        description: verifiedProduct.description,
        userID: verifiedProduct.userID,
        createdAt: verifiedProduct.createdAt,
      });
      await create.save();
      await PendingProducts.findByIdAndRemove(productId);
      res.status(200).send({ message: "verified" });
    } else {
      res.status(404).send({ message: "product not found" });
    }
  })
);
productRouter.post(
  "/reject",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.body.ID;
    try {
      await PendingProducts.updateOne(
        { _id: productId },
        { $set: { status: "rejected" } }
      );
      res.status(200).send({ message: "Rejected" });
    } catch (error) {
      res.send(error);
    }
  })
);

export default productRouter;
