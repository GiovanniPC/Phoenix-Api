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
  };

  if(!req.user){
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
    starterPrice,
    repairPrice,
    sellingPrice,
    comission,
    totalPrice,
    repairDescription,
    companyDescription,
    finalDescription,
    onSale,
    repairImageUrl,
    repairYesNo
  } = req.body;

  switch (status) {
    case 'FirstResponse':
      if(req.user.role === 'Admin'){
        if (!starterPrice || !companyDescription) {
          res.status(400).json({ message: 'Something is missing in the form.' });
          return;
        }

        Product.updateOne({ _id: req.params.id }, {
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
      } else {
        res.status(400).json({ message: "You don't have access to update this products."});
      };
      break;

    case 'ToRepair':
      if(req.user.role === 'Costumer'){
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
          res.status(400).json({ message: "You don't have access to update this products."});
        };
      break;

    case 'OrderRepair':
      if(req.user.role === 'Repair'){
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
            repairImageUrl
          }
        })
          .then(() => {
            res.status(200).json({ message: `Product with ${req.params.id} is updated successfully.` });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        res.status(400).json({ message: "You don't have access to update this products."});
      };
      break;

    case 'WantRepair':
      if(req.user.role === 'Admin') {
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
        res.status(400).json({ message: "You don't have access to update this products."});
      };
      break;

    case 'SendCompany':
      if(req.user.role === 'Repair') {
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
        res.status(400).json({ message: "You don't have access to update this products."});
      };
      break;

    case 'toStore':
      if(req.user.role === 'Admin') {
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
        res.status(400).json({ message: "You don't have access to update this products."});
      };  
      break;

    default:
      res.status(201).json({ message: "Status don't exist, error in the system."});
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