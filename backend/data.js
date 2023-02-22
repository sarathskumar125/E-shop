import bcrypt from "bcrypt";

const data = {
  users: [
    {
      name: "Sarath S",
      email: "sarath@gmail.com",
      password: bcrypt.hashSync("123456", 10),
      isSuperAdmin:true,
      isAdmin: false,
      isAdminUser: false,
    },
    {
      name: "Steve Jobs",
      email: "stevejobs@gmail.com",
      password: bcrypt.hashSync("123456", 10),
      isSuperAdmin:false,
      isAdmin: true,
      isAdminUser: false,
    },
    {
      name: "Elon Musk",
      email: "elonmusk@gmail.com",
      password: bcrypt.hashSync("123456", 10),
      isSuperAdmin:false,
      isAdmin: false,
      isAdminUser: true,
    },
    {
      name: "Steve Wozniak",
      email: "stevewozniak@gmail.com",
      password: bcrypt.hashSync("123456", 10),
      isSuperAdmin:false,
      isAdmin: false,
      isAdminUser: true,
    },
    {
      name: "Bill Gates",
      email: "billgates@gmail.com",
      password: bcrypt.hashSync("123456", 10),
      isSuperAdmin:false,
      isAdmin: false,
      isAdminUser: false,
    },
  ],

};

export default data;
