const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cart-item");

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
  Cart.findOne({ where: { userId: req.user.id } })
    .then((cart) => {
      if (!cart) {
        return res.json({ products: [] }); // Cart doesn't exist, return an empty array
      }

      // Find all CartItems associated with the cart
      CartItem.findAll({ where: { id: cart.id } })
        .then((cartItems) => {
          // You now have an array of cartItems
          // You can further process or send these items in the response
          res.json({ cartItems });
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .json({ error: "An error occurred while fetching cart items." });
        });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the cart." });
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const userId = req.user.id;

  // Find the user's cart or create one if it doesn't exist
  Cart.findOrCreate({ where: { userId } })
    .then(([cart]) => {
      // Find the product by its ID
      return Product.findByPk(prodId)
        .then((product) => {
          if (!product) {
            return res.status(404).json({ error: "Product not found" });
          }

          // Check if the product is already in the cart by querying CartItem
          return CartItem.findOne({
            where: { id: cart.id },
          }).then((cartItem) => {
            console.log(product, "productAdded");
            if (cartItem) {
              // If the product is already in the cart, update the quantity
              cartItem.quantity += 1;
              return cartItem.save();
            } else {
              // If the product is not in the cart, create a new CartItem

              return CartItem.create({
                id: cart.id,
                id: prodId,
                quantity: 1,
                 product 
              });
            }
          });
        })
        .then(() => {
          res.status(200).json({ success: true});
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: "An error occurred while adding the product to the cart.",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "An error occurred while finding or creating the cart.",
      });
    });
};


exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const userId = req.user.id; // Assuming you have access to the user's ID

  // Find the user's cart
  Cart.findOne({ where: { userId } })
    .then((cart) => {
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Find the product by its ID within the cart
      return CartItem.findOne({ where: { id: cart.id, id: prodId } })
        .then((cartItem) => {
          if (!cartItem) {
            throw new Error('Product not found in cart');
          }

          // Check the quantity
          if (cartItem.quantity > 1) {
            // If quantity is greater than 1, decrement it by 1
            cartItem.quantity -= 1;
            return cartItem.save();
          } else {
            // If quantity is 1 or less, remove the product from the cart
            return cartItem.destroy();
          }
        });
    })
    .then(() => {
      res.status(200).json({ message: 'Quantity decreased by 1' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
};


// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts({ where: { id: prodId } });
//     })
//     .then((products) => {
//       const product = products[0];
//       const cartItem = product?.cartItem;
//       if (!cartItem) {
//         throw new Error("Product not found in cart");
//       }

//       // Check the quantity
//       if (cartItem.quantity > 1) {
//         // If quantity is greater than 1, decrement it by 1
//         return cartItem.decrement("quantity", { by: 1 });
//       } else {
//         // If quantity is 1 or less, remove the product from the cart
//         return cartItem.destroy();
//       }
//     })
//     .then((result) => {
//       res.send({ message: "Quantity decreased by 1" });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send({ error: "Something went wrong" });
//     });
// };

// exports.postOrder = (req, res, next) => {
//   let fetchedCart;

//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       console.log(cart, "cart");
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.user
//         .createOrder()
//         .then((order) => {
//           return order.addProducts(
//             products.map((product) => {
//               product.orderItem = { quantity: product.cartItem.quantity };
//               console.log(product, "orderproduct");
//               return product;
//             })
//           );
//         })
//         .then(() => {
//           // Now that the products are added to the order, let's send a response
//           res.status(201).json({ message: 'Order created successfully', products });
//         })
//         .catch((err) => console.log(err));
//     })
//     .then((result) => {
//       return fetchedCart.setProducts(null);
//     })
//     .then((result) => console.log(result))
//     .catch((err) => console.log(err));
// };


