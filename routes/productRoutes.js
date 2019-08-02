const mongoose = require('mongoose');
const express = require('express');

const productRoutes = express.Router();
const Product = require('../models/products');
const User = require('../models/user');

// first product update, on the repair side

productRoutes.put('/product-status/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const {
    name,
    status,
    statusProduct,
    categories,
    path,
    brand,
    model,
    specs,
    starterPrice,
    repairPrice,
    sellingPrice,
    comission,
    totalPrice,
    clientDescription,
    repairDescription,
    companyDescription,
    finalDescription,
    onSale,
    imageUrl
  } = req.body;

  switch (status) {
    case 'FirstResponse':
      Product.update({ _id: req.params.id }, {
        $set: {
          status,
          starterPrice,
          companyDescription,
        }
      })
        .then(() => {
          res.status(200).json({ message: `Product with ${req.params.id} is updated successfully.` });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
      break;
    default:
      break;
  }
});

module.exports = productRoutes;