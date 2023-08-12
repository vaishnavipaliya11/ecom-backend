const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

// nc
const session = require("express-session");
const SequelizeStore = require("express-session-sequelize")(session.Store);
// nc

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.use(cors({
  origin: '*'
}));


// app.use((req,res,next) =>{
//   res.setHeader('Access-Control-Allow-Origin','*')
//   res.setHeader('Access-Control-Allow-Method','GET,POST,PATCH,DELETE,PUT')
//   // res.setHeader('Access-Control-Allow-Headers','Content-type , Authorization')
//   next()
// })
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const Port = 3001
// nc

app.use(express.json())
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize, // Use your Sequelize instance here
    }),
  })
);
// nc

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(2)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(2);
    // console.log(result);
  })
  .then(user => {
    if (!user) {
      return User.create({  email: 'test1@test.com', password:"t" });
    }
    return user;
  })
  .then(user => {
    console.log(user);
    return user.createCart();
  })
  .then(cart => {
    app.listen(process.env.PORT || 3000);
  })

  .catch(err => {
    console.log(err);
  });


  // 'svKT3DmGocy3SiIoJ5P3nfX2dqEhQpfC', '2023-08-11 06:57:34', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"expires\":\"2023-08-11T06:57:34.107Z\"}', '2023-08-10 06:57:34', '2023-08-10 06:57:34'
