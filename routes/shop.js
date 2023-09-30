const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../util/is-auth')

const router = express.Router();

router.get('/product/:id', shopController.getSingleProduct);

router.get('/', isAuth, shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

// router.post('/create-order', isAuth, shopController.postOrder);

// router.get('/orders', isAuth, shopController.getOrders);

// router.get('/wishlist', isAuth, shopController.getWishlist);

// router.post('/add-wishlist', isAuth, shopController.postWishlist);
// router.post('/delete-wishlist', isAuth, shopController.wishlistDeleteProduct);

// router.get('/address', isAuth, shopController.getAllAddresses);
// router.post('/add-address', isAuth, shopController.createAddress);

// Get a specific address by ID
// router.get('/address/:id', shopController.getAddressById);

// Update a specific address by ID
// router.put('/address/:id', shopController.updateAddress);

// // Delete a specific address by ID
// router.delete('/address/:id', shopController.deleteAddress);
// router.get('/address/:id', shopController.getAddressById);
module.exports = router;
