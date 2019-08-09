const mongoose = require('mongoose');
const express = require('express');

const productRoutes = express.Router();
const Product = require('../models/products');
const User = require('../models/user');
const ShoppingCart = require('../models/shoppingCart');
const ensureAuthenticated = require('../configs/authenticated')

// product Updates along the selling journey, all the changes
// are made base on the status change, check the switch for ref

productRoutes.put('/product-status/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  };

  if (!req.user) {
    res.status(400).json({ message: 'Not logged' });
    return;
  };

  const {
    finalName,
    status,
    finalStatusProduct,
    brand,
    model,
    specs,
    responsePrice,
    repairPrice,
    sellingPrice,
    comission,
    totalPrice,
    repairDescription,
    companyDescription,
    finalDescription,
    onSale,
    repairImageUrl,
    repairYesNo,
  } = req.body;

  switch (status) {
    case 'FirstResponse':
      if (req.user.role === 'Admin') {
        if (!responsePrice || !companyDescription) {
          res.status(400).json({ message: 'Something is missing in the form.' });
          return;
        }

        Product.updateOne({ _id: req.params.id }, {
          $set: {
            status,
            responsePrice,
            companyDescription,
          }
        })
          .then(() => {
            res.status(200).json({ message: `Product with ${req.params.id} is updated successfully.` });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        res.status(411).json({ message: "You don't have access to update this products." });
      };
      break;

    case 'ToRepair':
      if (req.user.role === 'Customer') {
        Product.updateOne({ _id: req.params.id }, {
          $set: {
            status,
          }
        })
          .then(() => {
            res.status(200).json({ message: `Product with ${req.params.id} is updated successfully.` });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        res.status(400).json({ message: "You don't have access to update this products." });
      };
      break;

    case 'OrderRepair':
      if (req.user.role === 'Company') {
        if (!repairPrice || !repairDescription || !model || !specs || !brand || !repairImageUrl) {
          res.status(400).json({ message: 'Something is missing in the form.' });
          return;
        }

        Product.updateOne({ _id: req.params.id }, {
          $set: {
            status,
            repairPrice,
            repairDescription,
            model,
            specs,
            brand,
            repairImageUrl,
          }
        })
          .then(() => {
            res.status(200).json({ message: `Product with ${req.params.id} is updated successfully.` });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        res.status(400).json({ message: "You don't have access to update this products." });
      };
      break;

    case 'WantRepair':
      if (req.user.role === 'Admin') {
        Product.updateOne({ _id: req.params.id }, {
          $set: {
            status,
            repairYesNo,
          }
        })
          .then(() => {
            res.status(200).json({ message: `Product with ${req.params.id} is updated successfully.` });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        res.status(400).json({ message: "You don't have access to update this products." });
      };
      break;

    case 'SendCompany':
      if (req.user.role === 'Company') {
        Product.updateOne({ _id: req.params.id }, {
          $set: {
            status,
            finalStatusProduct,
          }
        })
          .then(() => {
            res.status(200).json({ message: `Product with ${req.params.id} is updated successfully.` });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        res.status(400).json({ message: "You don't have access to update this products." });
      };
      break;

    case 'toStore':
      if (req.user.role === 'Admin') {
        if (!totalPrice || !finalDescription || !comission || !sellingPrice || !finalName) {
          res.status(400).json({ message: 'Something is missing in the form.' });
          return;
        }

        Product.updateOne({ _id: req.params.id }, {
          $set: {
            finalName,
            status,
            finalDescription,
            onSale,
            sellingPrice,
            totalPrice,
            comission,
          }
        })
          .then(() => {
            res.status(200).json({ message: `Product with ${req.params.id} is updated successfully.` });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        res.status(400).json({ message: "You don't have access to update this products." });
      };
      break;

    default:
      res.status(201).json({ message: "Status don't exist, error in the system." });
      break;
  }
});


productRoutes.get('/myproducts', (req, res, next) => {
  User.findById(req.user.id)
    .populate('products')
    .then((answer) => {
      res.status(200).json(answer);
    })
    .catch(err => res.status(500).json(err));
})

// get all users, using for tests don't delete it yet

productRoutes.get('/allusers', (req, res, next) => {
  User.find()
    .populate('company')
    .then((answer) => {
      res.status(200).json(answer);
    })
    .catch(err => res.status(500).json(err));
})

// Create a shoppingCart and push to the user cart array, require the user to be loggedin
productRoutes.post('/cart', ensureAuthenticated, (req, res, next) => {
  const { total, products } = req.body;

  if (!products || !total) {
    res.status(500).json({ message: 'Your shopping cart is empty' });
    return;
  }

  const newCart = new ShoppingCart({
    user: req.user.id,
    products,
    total,
  });


  newCart.save()
    .then((answer) => {
      User.updateOne({ _id: req.user.id }, { $push: { shoppingCart: answer._id } })
        .then((answer) => { res.status(200).json(answer); })
        .catch(err => res.status(500).json(err))
    })
    .catch(err => res.status(500).json(err))
});

// edit the shoppingCart

productRoutes.put('/cart-edit/:id', ensureAuthenticated, (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const { status } = req.body;

  ShoppingCart.findById(req.params.id)
    .then((answer) => {
      answer.products.forEach((item) => {
        Product.findById(item)
          .then((product) => {
            if (product.status === 'Sold') {
              res.status(200).json({ message: 'Im sorry dave, im afraid you cant do that' })
            }
          })
          .catch()
      })
    })
    .catch()

  ShoppingCart.update({ _id: req.params.id }, { $set: { status } })
    .then(() => {
      ShoppingCart
        .findById(req.params.id)
        .populate('products')
        .then((answer) => {
          answer.products.forEach((item) => {
            Product.update({ _id: item._id }, { $set: { status: 'Sold' } })
              .then(() => {
                User.updateOne({ _id: req.user.id }, { $pullAll: { shoppingCart: [answer._id] } })
                  .then((update) => { res.status(200).json(update); })
                  .catch(err => res.status(500).json(err))
              })
              .catch(err => res.status(500).json(err))
          });
        })
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
})

// find user shoppingCart, will not display the purchased carts

productRoutes.get('/myCart', ensureAuthenticated, (req, res, next) => {
  ShoppingCart
    .find({ user: req.user.id })
    .populate('products')
    .then((answer) => {
      res.status(200).json(answer.filter(item => item.status !== 'Purchased'));
    })
    .catch(err => res.status(500).json(err));
});


// Find all the purchased products

productRoutes.get('/myPurchases', ensureAuthenticated, (req, res, next) => {
  ShoppingCart
    .find({ user: req.user.id })
    .populate('products')
    .then((answer) => {
      res.status(200).json(answer.filter(item => item.status === 'Purchased').map(item => item.products));
    })
    .catch(err => res.status(500).json(err));
});

// delete the shopping cart

productRoutes.delete('/delete-cart/:id', ensureAuthenticated, (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  ShoppingCart.findByIdAndRemove(req.params.id)
    .then((answer) => {
      User.updateOne({ _id: req.user.id }, { $pullAll: { shoppingCart: [answer._id] } })
        .then((update) => { res.status(200).json(update); })
        .catch(err => res.status(500).json(err))
    })
    .catch(err => res.status(500).json(err));
})

module.exports = productRoutes;
