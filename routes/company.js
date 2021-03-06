const express = require('express');

const routes = express.Router();
const mongoose = require('mongoose');
const Company = require('../models/company');
const User = require('../models/user');
const ensureAuthenticated = require('../configs/authenticated');

// create new company and create a relation to the user model

routes.post('/create-company', ensureAuthenticated, (req, res, next) => {
  const {
    name,
    razaosocial,
    address,
    latitude,
    longitude,
    speciality,
    phone,
    cnpj,
    email,
    cep,
  } = req.body;


  const location = {
    type: 'Point',
    coordinates: [longitude, latitude],
  };

  if (!name || !razaosocial || !address || !speciality || !phone || !cnpj || !email ) {
    res.status(400).json({ message: 'Something is missing in the form.' });
    return;
  }

  const newSpeciality = []; 


  for (key in speciality) {
    if (speciality[key]) {
      newSpeciality.push(key)
    };
  }

  const newCompany = new Company({
    name,
    razaosocial,
    cnpj,
    address,
    phone,
    cep,
    speciality: newSpeciality,
    location,
    email,
    user: req.user.id,
  });

  newCompany.save()
    .then(() => {
      User.updateOne({ _id: req.user.id }, { $push: { company: newCompany._id } })
        .then((answer) => {
          res.status(200).json(answer);
        })
        .catch(err => res.status(500).json({ message: err }));
    })
    .catch((err) => {
      res.status(500).json({ message: 'Something went wrong to register your company.' });
    });
});


// edit the company information the company

routes.put('/edit-company/:id', ensureAuthenticated, (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const {
    name,
    razaosocial,
    address,
    latitude,
    longitude,
    speciality,
    phone,
    cnpj,
    cep,
  } = req.body;

  const location = {
    type: 'Point',
    coordinates: [longitude, latitude],
  };

  Company.update({ _id: req.params.id }, {
    $set: {
      name,
      razaosocial,
      address,
      location,
      speciality,
      phone,
      cnpj,
      cep,
    }

  })
    .then(() => {
      res.status(200).json({ message: `Company with ${req.params.id} is updated successfully.` });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});


// get companies by user
routes.get('/get-company', ensureAuthenticated, (req, res, next) => {
  User.findOne({ _id: req.user.id })
    .populate('company')
    .then((answer) => {
      res.status(200).json(answer);
    })
    .catch(err => console.log(err));
});

// get the user companie and the products related to it, use it for the repair store side

routes.get('/get-products', ensureAuthenticated, (req, res, next) => {
  Company.findOne({ user: req.user.id })
    .populate('Products')
    .then((answer) => {
      res.status(200).json(answer);
    })
    .catch(err => console.log(err));
});

module.exports = routes;
