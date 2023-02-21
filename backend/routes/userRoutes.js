import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken, isAuth } from "../utils.js";
const userRouter = express.Router();

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user.id,
          name: user.name,
          email: user.email,
          isSuperAdmin: user.isSuperAdmin,
          isAdmin: user.isAdmin,
          isAdminUser: user.isAdminUser,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "INVALID EMAIL OR PASSWORD" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const createUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    const user = await createUser.save();
    res.send({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (User) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "USER NOT FOUND" });
    }
  })
);

userRouter.get(
  "/adminuserlist",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const adminUsers = await User.find({isAdminUser:true})
    if(adminUsers){
     const data = await adminUsers.map((x)=>({id:x._id, name:x.name}))
     res.send(data)
    }else{
      res.status(404).send({ message: "NOT FOUND ANY ADMIN USERS" });
    }
  })
);

userRouter.post("/createadminuser", isAuth, expressAsyncHandler(async(req,res)=>{
  const createAdminUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    isAdminUser: true,
  });
  const user = await createAdminUser.save();
  res.status(200).send({message: "NEW ADMIN USER CREATED SUCCESSFULLY"});
}))

userRouter.get(
  "/adminpanel",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const admins = await User.find({isAdmin:true})
    if(admins){
     const data = await admins.map((x)=>({id:x._id, name:x.name}))
     res.send(data)
    }else{
      res.status(404).send({ message: "NOT FOUND ANY ADMINS" }); 
    }
  })
);

userRouter.post("/createadmin", isAuth, expressAsyncHandler(async(req,res)=>{
  const createAdmin = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    isAdmin: true,
  });
   await createAdmin.save();
  res.status(200).send({message: "NEW ADMIN CREATED SUCCESSFULLY"});
}))

export default userRouter;
