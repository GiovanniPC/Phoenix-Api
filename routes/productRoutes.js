const mongoose = require('mongoose');
const express = require('express');

const productRoutes = express.Router();
const Product = require('../models/products');
const User = require('../models/user');

// product Updates along the selling journey, all the changes
// are made base on the status change, check the switch for ref

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

  // need corrections and improvements to correctly represent the state changes

  switch (status) {
    case 'FirstResponse':

      if (!starterPrice || !companyDescription) {
        res.status(400).json({ message: 'Something is missing in the form.' });
        return;
      }

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
    case 'ToRepair':

      Product.update({ _id: req.params.id }, {
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
      break;
    case 'OrderRepair':

      if (!repairPrice || !repairDescription || !model || !specs) {
        res.status(400).json({ message: 'Something is missing in the form.' });
        return;
      }

      Product.update({ _id: req.params.id }, {
        $set: {
          status,
          repairPrice,
          repairDescription,
          model,
          specs,
        }
      })
        .then(() => {
          res.status(200).json({ message: `Product with ${req.params.id} is updated successfully.` });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
      break;
    case 'WantRepair':

      if (!repairPrice || !repairDescription) {
        res.status(400).json({ message: 'Something is missing in the form.' });
        return;
      }

      Product.update({ _id: req.params.id }, {
        $set: {
          status,
          repairPrice,
          repairDescription,
        }
      })
        .then(() => {
          res.status(200).json({ message: `Product with ${req.params.id} is updated successfully.` });
        })
        .catch((err) => {
          res.status(500).json(err);
        });

      break;
    case 'InRepair':
      Product.update({ _id: req.params.id }, {
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
      break;
    case 'SendCompany':
      Product.update({ _id: req.params.id }, {
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
      break;
    case 'toStore':

      if (!totalPrice || !finalDescription || !comission || !sellingPrice) {
        res.status(400).json({ message: 'Something is missing in the form.' });
        return;
      }

      Product.update({ _id: req.params.id }, {
        $set: {
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

      break;
    default:
      break;
  }
});

// get all users, using for tests don't delete it yet

productRoutes.get('/allusers', (req, res, next) => {
  User.find()
    .then((answer) => {
      res.status(200).json(answer);
    })
    .catch(err => res.status(500).json(err));
})


module.exports = productRoutes;