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
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user.id)
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
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err,"user create err in app file");
  });


  // 'svKT3DmGocy3SiIoJ5P3nfX2dqEhQpfC', '2023-08-11 06:57:34', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"expires\":\"2023-08-11T06:57:34.107Z\"}', '2023-08-10 06:57:34', '2023-08-10 06:57:34'
