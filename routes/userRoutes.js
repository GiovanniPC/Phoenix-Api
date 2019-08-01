const express = require('express');
const userRoutes = express.Router();
const Product = require('../models/products');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// const transporter = require('../configs/nodemailer');

// Profile
userRoutes.get("/profile/:userID", (req, res) => {
    const userId = req.params.userID;
    User.findById(userId)
      .then(profile => {
        res.status(200).json(profile);
      })
      .catch(err => console.log(err));
  }
);

userRoutes.put("/profile/edit/:profileID", (req, res, next) => {
  const { profileID } = req.params;
  const { password, name, address, city, cep } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  User.update(
    { _id: profileID },
    { $set: { name, hashPass, address, city, cep } }
  )
  .then(profile => {
    res.status(200).json(profile);
  })
  .catch(error => {
    console.log(error);
  });

});

// route for the user start his sell
userRoutes.post('/new-product', (req,res) => {

    const { name, statusProduct, categories, path, brand, price, description, imageUrl } = req.body;
    console.log(req.user);

    if (!name || !statusProduct || !categories || !path || !brand || !price || !description ) {
      res.status(400).json({ message: 'Something is missing in the form.' });
      return;
    }

    const newProduct = new Product({
      name,
      statusProduct,
      categories,
      path,
      brand,
      price,
      description,
      imageUrl,
      owner: req.user.id
    });

    newProduct.save()
    .then(product => {
      res.status(200).json(product);
    })
    .catch(err => res.status(500).json({ message: err }));
});

// route that receive a Status and return all products with that status
userRoutes.get('/status-products/:status', (req,res) => {
  const { status } = req.params;
  Product.find({status: status})
  .then(products => {
    res.status(200).json(products);
  })
  .catch(err => res.status(500).json({ message: "Nothing" }));
});

// route that receive a Categorie and return all products with that categorie
userRoutes.get('/categorie/:categories', (req,res) => {
  const { categories } = req.params;
  Product.find({categories: categories , status: 'ToStore'})
  .then(products => {
    res.status(200).json(products);
  })
  .catch(err => res.status(500).json({ message: "Nothing" }));
});

// route that receive a IdProduct and return him
userRoutes.get('/product/:id', (req,res) => {
  const { id } = req.params;
  Product.findById(id)
  .then(product => {
    res.status(200).json(product);
  })
  .catch(err => res.status(500).json({ message: "Nothing" }));
});

module.exports = userRoutes;