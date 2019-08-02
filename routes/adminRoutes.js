const express = require('express');

const adminRoutes = express.Router();
const Product = require('../models/products');
const User = require('../models/user');
const Company = require('../models/company');

// get specific company

adminRoutes.get('/companies/:id', (req, res, next) => {
  Company.findOne({ _id: req.params.id })
    .populate('Products')
    .then((answer) => {
      res.status(200).json(answer);
    })
    .catch(err => console.log(err))
});

// get all companies

adminRoutes.get('/companies/all', (req, res, next) => {
  Company.find()
    .then((answer) => {
      res.status(200).json(answer);
    })
    .catch(err => res.status(500).json(err));
});

// get all products

adminRoutes.get('/products/all', (req, res, next) => {
  Product.find()
    .then((answer) => {
      res.status(200).json(answer);
    })
    .catch(err => res.status(500).json(err));
});

module.exports = adminRoutes;