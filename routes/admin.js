const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

const isAuth = require('../util/is-auth')
const Product = require("../models/product")

// /admin/add-product => GET
router.get('/add-product',isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth,adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.post('/edit-product',isAuth, adminController.postEditProduct);

router.post('/delete-product',isAuth, adminController.postDeleteProduct);

router.get('/products/:category', async (req, res) => {
    const category = req.params.category;
  
    try {
      const products = await Product.findAll({
        where: { category: category },
      });
  
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found for this category.' });
      }
  
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



  


module.exports = router;
