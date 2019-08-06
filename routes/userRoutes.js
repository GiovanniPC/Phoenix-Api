const express = require('express');

const userRoutes = express.Router();
const bcrypt = require('bcrypt');
const Product = require('../models/products');
const User = require('../models/user');
const Company = require('../models/company');
const transporter = require('../configs/nodemailer');
const ensureAuthenticated = require('../configs/authenticated');

// Profile
userRoutes.get('/profile/:userID', ensureAuthenticated, (req, res) => {
  const userId = req.params.userID;
  User.findById(userId).populate('product')
    .then((profile) => {
      res.status(200).json(profile);
    })
    .catch(err => console.log(err));
});

userRoutes.put('/profile/edit/:profileID', ensureAuthenticated, (req, res, next) => {
  const { profileID } = req.params;
  const {
    password, name, address, city, cep,
  } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  User.updateOne(
    { _id: profileID },
    {
 $set: {
      name, password: hashPass, address, city, cep,
    } 
},
  )
    .then((profile) => {
      res.status(200).json(profile);
    })
    .catch((error) => {
      console.log(error);
    });
});

// route for the user start his sell
userRoutes.post('/new-product', ensureAuthenticated, (req, res) => {
  const {
    name,
    statusProduct,
    categories,
    path,
    brand,
    model,
    starterPrice,
    clientDescription,
    imageUrl,
    idCompany,
  } = req.body;
  const { id } = req.user;

  if (!name || !statusProduct || !categories || !path || !brand || !starterPrice || !clientDescription) {
    res.status(400).json({ message: 'Something is missing in the form.' });
    return;
  }

  const newProduct = new Product({
    name,
    statusProduct,
    categories,
    path,
    brand,
    model,
    starterPrice,
    clientDescription,
    imageUrl,
    owner: req.user.id,
  });

  switch (path) {
    case 'Sell':
      newProduct.save()
        .then((product) => {
          User.updateOne({ _id: id }, { $push: { product: product.id } })
            .then((user) => {
              Company.updateOne({ _id: idCompany }, { $push: { products: product.id } })
                .then((user) => {
                  res.status(200).json(product);
                })
                .catch(err => res.status(500).json({ message: err }));
            })
            .catch(err => res.status(500).json({ message: err }));
        })
        .catch(err => res.status(500).json({ message: err }));

      break;

    case 'Repair':
      Company.findById(idCompany)
        .then((answer) => {
          transporter.sendMail({
            from: '"Phoenix Forge" <phixit@gin.ink>',
            to: answer.username,
            subject: `${answer.name}! Here comes a new request!`,
            text: 'Solicitation Email',
            html: `
            

            
            `,
          });
        })
        .catch();
      break;
    default:
      break;
  }
});

// route that receive a Status and return all products with that status
userRoutes.get('/status-products/:status', ensureAuthenticated, (req, res) => {
  const { status } = req.params;
  Product.find({ status })
    .then((products) => {
      res.status(200).json(products);
    })
    .catch(err => res.status(500).json({ message: 'Nothing' }));
});

// route that receive a Categorie and return all products with that categorie
userRoutes.get('/categorie/:categories', ensureAuthenticated, (req, res) => {
  const { categories } = req.params;
  Product.find({ categories, status: 'ToStore' })
    .then((products) => {
      res.status(200).json(products);
    })
    .catch(err => res.status(500).json({ message: 'Nothing' }));
});

// route that receive a IdProduct and return him
userRoutes.get('/product/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params;
  Product.findById(id)
    .then((product) => {
      res.status(200).json(product);
    })
    .catch(err => res.status(500).json({ message: 'Nothing' }));
});

userRoutes.get('/client-products', ensureAuthenticated, (req, res) => {
  if (req.user.role === 'Customer') {
    User.findById(req.user.id).populate({ path: 'product', populate: { path: 'idCompany' } })
      .then((products) => {
        res.status(200).json(products);
      })
      .catch(err => res.status(500).json({ message: 'Nothing' }));
  } else if (req.user.role === 'Company') {
    User.findById(req.user.id).populate({ path: 'company', populate: { path: 'products' } })
      .then((products) => {
        res.status(200).json(products);
      })
      .catch(err => res.status(500).json({ message: 'Nothing' }));
  }
});

module.exports = userRoutes;
