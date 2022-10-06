const Product = require("../models/product");
const Order = require('../models/order');
const User = require('../models/user');

exports.getProducts = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn

  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticate: isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticate: isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticate: isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
  console.log('user: ', req.session.user )
  const ID = req.session.user._id;

  User
    .findById(ID)
    .then(user => {
      user
      .populate('cart.items.productId')
      .then((user) => {
        const products = user.cart.items
        console.log(products)
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: products,
          isAuthenticate: isLoggedIn
        });
      })
    })
    .catch((err) => console.log(err));
  };

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const ID = req.session.user._id;

  User
    .findById(ID)
    .then(user => {
      user
        .addToCart(prodId)
        .then(() => {
          res.redirect("/cart");
        })
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const ID = req.session.user._id;

  const prodId = req.body.productId;
  User.findById(ID)
    .then(user => {
      user
      .removeItemFromCart(prodId)
      .then((result) => {
        res.redirect("/cart");
      })
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  const ID = req.session.user._id;
  User.findById(ID)
    .then(user => {
      user
      .populate('cart.items.productId')
      .then(user => {
        const products = user.cart.items.map(i => {
          return { product: {...i.productId._doc }, quantity: i.quantity }
        })
        const order = new Order({
          products: products,
          user: {
            username: user.username,
            userid: user
          }
        })
        order.save()
        return user
      })
      .then((user) => {
        user
          .clearCart();
      })
      .then((result) => {
        res.redirect("/orders");
      })
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  const ID = req.session.user._id;
  const isLoggedIn = req.session.isLoggedIn

  Order.find({'user.userId': ID})
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticate: isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};
