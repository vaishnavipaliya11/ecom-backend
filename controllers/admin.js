const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const videoUrl = req.body.videoUrl;
  const category = req.body.category;
  const highlights = req.body.highlights;
  const rating = req.body.rating;
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    videoUrl: videoUrl,
    category: category,
    highlights: highlights,
    rating: rating,
  })
    .then((createdProduct) => {
      console.log(createdProduct, "createdProduct");

      console.log("Created Product");
      res.status(201).json({ product: createdProduct });
    })
    .catch((err) => {
      console.log(err, "product err");
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findByPk({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }

      console.log(product, "EDITTTT");
      res.send({ product });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedProduct = {
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    videoUrl: req.body.videoUrl,
    category: req.body.category,
    highlights: req.body.highlights,
    rating: req.body.rating,
  };
  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.status(404).send("Product not found");
      }

      return product.update(updatedProduct);
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.send({ products });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("DESTROYED PRODUCT");
      // res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getFilteredCategory = (req, res, next) => {
  const category = req.params.category;

  console.log(req.params.category, "req.params.category");
  const categoryArray = category.split(",");
  // Use Sequelize's findAll method to filter products by category
  Product.findAll({
    where: {
      category: categoryArray,
    },
  })
    .then((products) => {
      res.status(200).json({ products });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching products." });
    });
};
