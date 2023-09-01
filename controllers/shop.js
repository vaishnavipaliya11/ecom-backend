const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.send({ products });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(
    req.params.productId,
    "req.params.productId from getProduct at shop controller"
  );
  Product.findByPk(prodId)
    .then((product) => {
      console.log(
        product,
        "req.params.productId from getProduct at shop controller"
      );
      res.setHeader("Content-Type", "application/json");
      res.send(product);
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.send({ products });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.send({ products });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        console.log(product, "PRODUCTSSS");
        // return product;

        res.status(200).send({ success: true });
      }

      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then((result) => {
      // console.log(result,"RESULTTTTT");
      res.send({ result });
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      const cartItem = product?.cartItem;
      if (!cartItem) {
        throw new Error("Product not found in cart");
      }

      // Check the quantity
      if (cartItem.quantity > 1) {
        // If quantity is greater than 1, decrement it by 1
        return cartItem.decrement("quantity", { by: 1 });
      } else {
        // If quantity is 1 or less, remove the product from the cart
        return cartItem.destroy();
      }
    })
    .then((result) => {
      res.send({ message: "Quantity decreased by 1" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: "Something went wrong" });
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              console.log(product, "PRODUCTTTTT");
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err, "ERRORRRR"));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      console.log(orders, "ORDERSSSS");
      res.send({ orders });
    })
    .catch((err) => console.log(err));
};

// Controller function to filter products by multiple categories
exports.getFilteredCategories = async (req, res) => {
  try {
    // Get the categories from the query parameters
    const categories = req.query.categories;
    console.log(req.query.categories, "shop req.query.categories");
    // Check if categories were provided
    if (!categories) {
      return res
        .status(400)
        .json({ error: "Please provide one or more categories." });
    }

    // Split the comma-separated categories into an array
    const categoryArray = categories.split(",");

    // Use Sequelize's findAll method to filter products by categories
    const products = await Product.findAll({
      where: {
        category: categoryArray,
      },
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products." });
  }
};

// exports.getSingleProduct = async (req, res) => {
//   console.log(req.params.id, "getSingleProduct");
//   try {
//     const productId = req.params.id;
//     // const product = await Product?.findByPk(productId);

//     Product.findByPk(productId)
//       .then((product) => {
//         // if (!product) {
//         //   return res.status(404).json({ error: "Product not found" });
//         // }
//         res.send(product);
//       })
//       .catch((err) => console.log(err));
//     // res.send(product);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log("getSingleProductgetSingleProduct", product);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.postWishlist = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedWishlist;
  req.user
    .getWishlist()
    .then((wishlist) => {
      fetchedWishlist = wishlist;
      return wishlist.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        res.send("Already in wishlist");
      }

      return Product.findByPk(prodId)
        .then((product) => {
          console.log(product, "add wishlist prod");
          return fetchedWishlist.addProduct(product);
        })
        .then(() => {
          // Send a success response after adding to the wishlist
          res.status(200).send("Added to wishlist");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getWishlist = (req, res, next) => {
  req.user
    .getWishlist()
    .then((wishlist) => {
      return wishlist
        .getProducts()
        .then((products) => {
          console.log(products, "getwishlist");
          res.send({ products });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.wishlistDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getWishlist()
    .then((wishlist) => {
      return wishlist.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      const wishlistItem = product?.wishlistItem;
      if (!wishlistItem) {
        throw new Error("Product not found in wishlist");
      } else {
        return wishlistItem.destroy();
      }
    })
    .then((result) => {
      res.send({ message: "Deleted Wishlist Product" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: "Something went wrong" });
    });
};
