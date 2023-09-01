const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const videoUrl = req.body.videoUrl;
  const category= req.body.category;
  const highlights= req.body.highlights;
  const rating= req.body.rating;
  console.log(req.body.category,"req.body.category");
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
      videoUrl:videoUrl,
      category:category,
      highlights:highlights,
      rating:rating
    })
    .then(result => {
      console.log(result ,"RESULT");
      
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect('/');
      }
      
      console.log(product,"EDITTTT");
      res.send(product)
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  console.log(req.body,"edit body");
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedVideoUrl = req.body.videoUrl;
  const updatedCategory= req.body.category;
  const updatedHighlights= req.body.highlights;
  const updatedRating= req.body.rating;
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {
        return res.status(404).send("Product not found");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      product.videoUrl= updatedVideoUrl;
      product.rating= updatedRating,
      product.category= updatedCategory,
      product.highlights= updatedHighlights
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.send({products})
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};


exports.getFilteredCategory= (req, res, next) => {
  const category = req.params.category;

  console.log(req.params.category,"req.params.category");
  const categoryArray = category.split(',');
  // Use Sequelize's findAll method to filter products by category
  Product.findAll({
    where: {
      category: categoryArray
    }
  })
    .then(products => {
      res.status(200).json({ products });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching products.' });
    });
}

// exports.getFilteredCategory = (req, res, next) => {
//   // Get the categories from the query parameters
//   const categories = req.query.categories;

//   // Check if categories were provided
//   if (!categories) {
//     return res.status(400).json({ error: 'Please provide one or more categories.' });
//   }

//   // Split the comma-separated categories into an array
//   const categoryArray = categories.split(',');

//   // Use Sequelize's findAll method to filter products by categories
//   Product.findAll({
//     where: {
//       category: categoryArray // Use the array of categories in the query
//     }
//   })
//     .then(products => {
//       res.status(200).json({ products });
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'An error occurred while fetching products.' });
//     });
// };
