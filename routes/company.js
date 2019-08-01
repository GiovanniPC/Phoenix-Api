const express = require('express');

const routes = express.Router();
const Company = require('../models/company');
const User = require('../models/user');

// create new company

routes.post('/create-company', (req, res, next) => {
  const {
    name,
    razaosocial,
    address,
    latitude,
    longitude,
    speciality,
    phone,
    cnpj,
  } = req.body;


  const location = {
    type: 'Point',
    coordinates: [longitude, latitude],
  };

  const newCompany = new Company({
    name,
    razaosocial,
    cnpj,
    address,
    phone,
    speciality,
    location,
    user: req.user.id,
  });

  newCompany.save()
    .then(() => {
      User.update({ _id: req.user.id }, { $push: { company: newCompany._id } })
        .then((answer) => {
          res.status(200).json(answer);
        })
        .catch(err => res.status(500).json({ message: err }));
    })
    .catch((err) => {
      res.status(500).json({ message: 'Something went wrong to register your company.' });
    });
});


module.exports = routes;
