const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticate: isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title: title,
    description: description,
    price: price,
    imageUrl: imageUrl,
    userId: req.session.user
  });

  product.save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticate: isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
 
  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle,
      product.description = updatedDesc,
      product.imageUrl = updatedImageUrl,
      product.price = updatedPrice
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn

  Product.find()
    .select()
    .populate('userId', 'username')
    .then(products => {
      console.log(products)
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticate: isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(result => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
