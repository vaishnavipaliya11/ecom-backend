const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv= require('dotenv').config();


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

const Wishlist = require("./models/wishlist");
const WishlistItem = require("./models/wishlist-item");

const Address = require("./models/address");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const Port = 3001;
// nc

app.use(express.json());
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
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product);
// User.hasOne(Cart);
// User.hasMany(Cart, { foreignKey: 'userId' });

// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });
// Product.belongsToMany(Order, { through: OrderItem });
// User.hasOne(Wishlist)
// Wishlist.belongsTo(User)
// Wishlist.belongsToMany(Product,{through:WishlistItem})
// Product.belongsToMany(Wishlist, {through:WishlistItem})

// User.hasOne(Address)

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(2);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ email: "test1@test.com", password: "t" });
    }
    return user;
  })
  .then((user) => {
    console.log(user);

    // Create a cart for the user manually
    return Cart.create({ userId: user.id }) // Adjust the column name as needed
      .then((cart) => {
        // You can also create a wishlist here if needed
        // return Wishlist.create({ userId: user.id })

        // Assuming you're not creating a wishlist, you can just return the cart
        return cart;
      })
      .catch((err) => {
        console.log(err);
      });
  })

  .then(() => {
    app.listen(process.env.PORT || 3000);
  })

  .catch((err) => {
    console.log(err);
  });

// 'svKT3DmGocy3SiIoJ5P3nfX2dqEhQpfC', '2023-08-11 06:57:34', '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"expires\":\"2023-08-11T06:57:34.107Z\"}', '2023-08-10 06:57:34', '2023-08-10 06:57:34'
