const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../util/is-auth')

const router = express.Router();

router.get('/product/:id', shopController.getSingleProduct);
router.get('/abcd', shopController.getProducts);

router.get('/', isAuth, shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/wishlist', isAuth, shopController.getWishlist);

router.post('/add-wishlist', isAuth, shopController.postWishlist);
router.post('/delete-wishlist', isAuth, shopController.wishlistDeleteProduct);

module.exports = router;
