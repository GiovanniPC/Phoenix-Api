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
    idCompany,
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
          User.findById(req.user.id)
            .then((user) => { // email for
              transporter.sendMail({
                from: '"Phoenix Forge" <phixit@gin.ink>',
                to: answer.email,
                subject: `${answer.name}! Here comes a new request!`,
                text: 'Solicitation Email',
                html: `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                  <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Phix It - Service solicitation</title>
    
                    <style type="text/css">
                      @import url(http://fonts.googleapis.com/css?family=Droid+Sans);
    
                      a img {
                        border: none;
                      }
    
                      td,
                      h1,
                      h2 {
                        font-family: Helvetica, Arial, sans-serif;
                        font-weight: 400;
                        text-align: center;
                      }
    
                      hr {
                        width: 60%;
                      }
                      .info-block {
                        width: 85%;
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        align-content: center;
                        margin: 0 auto 20px auto;
                      }
                      .info-text {
                        width: 100%;
                        text-align: justify;
                      }
                      #product-img {
                        max-width: 80%;
                        margin: 20px auto;
                        border: 2px solid black;
                      }
                      body {
                        -webkit-font-smoothing: antialiased;
                        -webkit-text-size-adjust: none;
                        width: 100%;
                        height: 100%;
                        color: #37302d;
                        background: #ffffff;
                        font-size: 16px;
                      }
                      .wrapper {
                        margin: 0 auto;
                        background-color: #ebd116;
                        height: 100%;
                      }
                      .description {
                        display: flex;
                        justify-content: space-evenly;
                        flex-direction: row;
                        flex-wrap: wrap;
                      }
                      .box {
                        width: 40%;
                        margin: 5px;
                        border: 1px solid black;
                        padding: 3px;
                        -webkit-box-shadow: 0px 10px 5px -8px rgba(0, 0, 0, 0.75);
                        -moz-box-shadow: 0px 10px 5px -8px rgba(0, 0, 0, 0.75);
                        box-shadow: 0px 10px 5px -8px rgba(0, 0, 0, 0.75);
                        background-color: white;
                      }
                      .box2 {
                        width: 87.5%;
                        margin: 5px;
                        border: 1px solid black;
                        padding: 3px;
                        -webkit-box-shadow: 0px 10px 5px -8px rgba(0, 0, 0, 0.75);
                        -moz-box-shadow: 0px 10px 5px -8px rgba(0, 0, 0, 0.75);
                        box-shadow: 0px 10px 5px -8px rgba(0, 0, 0, 0.75);
                        background-color: white;
                      }
                      .footer {
                        display: flex;
                        flex-direction: column;
                        background-color: #414141;
                        justify-content: center;
                        text-align: center;
                        align-items: center;
                        color: white;
                      }
                      .imgpack {
                        display: flex;
                        justify-content: space-evenly;
                        margin: 5px 0;
                      }
                      .imgpack > a {
                        color: white;
                        text-decoration: none;
                      }
    
                      @media screen and (min-width: 700px) {
                        .wrapper {
                          width: 70%;
                        }
                      }
    
                      @media screen and (min-width: 1280px) {
                        .wrapper {
                          width: 60%;
                        }
                      }
                    </style>
    
                    <style type="text/css" media="screen">
                      /* @media screen {
                        /*Thanks Outlook 2013! http://goo.gl/XLxpyl*/
                        td,
                        h1,
                        h2,
                        h3 {
                          font-family: "Droid Sans", "Helvetica Neue", "Arial", "sans-serif" !important;
                        }
                      } */
                    </style>
    
                  </head>
                  <body
                    class="body"
                    style="padding:0; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none"
                    bgcolor="#ffffff"
                  >
                    <h1>Phix It - Sell and Repair</h1>
                    <hr />
                    <div class="wrapper">
                      <div class="info-block">
                        <div class="info-text">
                          <div class="description">
                            <div class="box">
                              <h3>Product</h3>
                              <p>${name}</p>
                            </div>
                            <div class="box">
                              <h3>Model</h3>
                              <p>${model}</p>
                            </div>
                            <div class="box">
                              <h3>Brand</h3>
                              <p>${brand}</p>
                            </div>
                            <div class="box">
                              <h3>Status</h3>
                              <p>${path}</p>
                            </div>
                            <div class="box2">
                              <h3>Description</h3>
                              <p>
                                ${clientDescription}
                              </p>
                            </div>
                          </div>
                        </div>
                        <img
                          id="product-img"
                          src="${imageUrl}"
                          alt=""
                        />
                        <div class="info-text">
                          <div class="description">
                          <div class="box2">
                          <h3>Contact information</h3>
                          <p>name: ${user.name}</p>
                          <p>email: ${user.username}</p>
                          <p>Address: ${user.address}, ${user.city}, ${user.cep} </p>                         
                          </div>                      
                          </div>
                        </div>
                      </div>
                      <div class="footer">
                        <div class="imgpack">
                          <a href="#">View in browser</a> | <a href="#">Unsubscribe</a> |
                          <a href="#">Contact</a>
                        </div>
                        <div class="imgpack">
                          <img
                            src="https://www.filepicker.io/api/file/R4VBTe2UQeGdAlM7KDc4"
                            alt="google+"
                          />
                          <img
                            src="https://www.filepicker.io/api/file/cvmSPOdlRaWQZnKFnBGt"
                            alt="facebook"
                          />
                          <img
                            src="https://www.filepicker.io/api/file/Gvu32apSQDqLMb40pvYe"
                            alt="twitter"
                          />
                        </div>
                        © 2019 All Rights Reserved
                      </div>
                    </div>
                  </body>
                </html>
                `,
              })
              transporter.sendMail({
                from: '"Phoenix Forge" <phixit@gin.ink>',
                to: user.username,
                subject: `Hey ${user.name}! Your request has been sent!`,
                text: 'Solicitation Email',
                html: `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                  <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Phix It - Confirm Email</title>
                    <style type="text/css">
                      @import url(http://fonts.googleapis.com/css?family=Droid+Sans);
                      img {
                        max-width: 600px;
                        outline: none;
                        text-decoration: none;
                        -ms-interpolation-mode: bicubic;
                      }
                      a {
                        text-decoration: none;
                        border: 0;
                        outline: none;
                        color: #bbbbbb;
                      }
                      a img {
                        border: none;
                      }
                      td,
                      h1,
                      h2,
                      h3 {
                        font-family: Helvetica, Arial, sans-serif;
                        font-weight: 400;
                      }
                      td {
                        text-align: center;
                      }
                      body {
                        -webkit-font-smoothing: antialiased;
                        -webkit-text-size-adjust: none;
                        width: 100%;
                        height: 100%;
                        color: #37302d;
                        background: #ffffff;
                        font-size: 16px;
                      }
                      table {
                        border-collapse: collapse !important;
                      }
                      .headline {
                        color: #1f1e1b;
                        font-size: 36px;
                      }
                      .force-full-width {
                        width: 100% !important;
                      }
                      .force-width-80 {
                        width: 80% !important;
                      }
                    </style>
                    <style type="text/css" media="screen">
                      @media screen {
                        /*Thanks Outlook 2013! http://goo.gl/XLxpyl*/
                        td,
                        h1,
                        h2,
                        h3 {
                          font-family: "Droid Sans", "Helvetica Neue", "Arial", "sans-serif" !important;
                        }
                      }
                    </style>
                    <style type="text/css" media="only screen and (max-width: 480px)">
                      /* Mobile styles */
                      @media only screen and (max-width: 480px) {
                        table[class="w320"] {
                          width: 320px !important;
                        }

                        td[class="mobile-block"] {
                          width: 100% !important;
                          display: block !important;
                        }
                      }
                    </style>
                  </head>
                  <body
                    class="body"
                    style="padding:0; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none"
                    bgcolor="#ffffff"
                  >
                    <table
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                      class="force-full-width"
                      height="100%"
                    >
                      <tr>
                        <td align="center" valign="top" bgcolor="#ffffff" width="100%">
                          <center>
                            <table
                              style="margin: 0 auto;"
                              cellpadding="0"
                              cellspacing="0"
                              width="600"
                              class="w320"
                            >
                              <tr>
                                <td align="center" valign="top">
                                  <table
                                    style="margin: 0 auto;"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="force-full-width"
                                    style="margin:0 auto;"
                                  >
                                    <tr>
                                      <td style="font-size: 30px; text-align:center;">
                                        <br />
                                        <h2><bold>Phix It - Sell and Repair</bold></h2>
                                      </td>
                                    </tr>
                                  </table>

                                  <table
                                    style="margin: 0 auto;"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="force-full-width"
                                    bgcolor="#ebd116"
                                  >
                                    <tr>
                                      <td>
                                        <br />
                                        <img
                                          src="https://image.flaticon.com/icons/svg/1792/1792920.svg"
                                          width="224"
                                          height="240"
                                          alt="robot picture"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="headline">
                                        Hey ${user.name}!
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <center>
                                          <table
                                            style="margin: 0 auto;"
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="60%"
                                          >
                                            <tr>
                                              <td style="color:#1f1e1b;">
                                                <br />
                                                Your repair order has been sent to ${answer.name}, located at
                                                ${answer.address}, ${answer.cep}. You can also contact them at
                                                ${answer.email} or ${answer.phone}, now you only have
                                                to wait.                                
                                                <br />
                                                <br />
                                              </td>
                                            </tr>
                                          </table>
                                        </center>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <div>
                                        
                                        </div>
                                        <br />
                                        <br />
                                      </td>
                                    </tr>
                                  </table>
                                  <table
                                    style="margin: 0 auto;"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="force-full-width"
                                    bgcolor="#414141"
                                    style="margin: 0 auto"
                                  >
                                    <tr>
                                      <td style="background-color:#414141;">
                                        <br />
                                        <br />
                                        <img
                                          src="https://www.filepicker.io/api/file/R4VBTe2UQeGdAlM7KDc4"
                                          alt="google+"
                                        />
                                        <img
                                          src="https://www.filepicker.io/api/file/cvmSPOdlRaWQZnKFnBGt"
                                          alt="facebook"
                                        />
                                        <img
                                          src="https://www.filepicker.io/api/file/Gvu32apSQDqLMb40pvYe"
                                          alt="twitter"
                                        />
                                        <br />
                                        <br />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="color:#bbbbbb; font-size:12px;">
                                        <a href="#">View in browser</a> |
                                        <a href="#">Unsubscribe</a> | <a href="#">Contact</a>
                                        <br /><br />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="color:#bbbbbb; font-size:12px;">
                                        © 2019 All Rights Reserved
                                        <br />
                                        <br />
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </center>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>               
                `,
              })
                .then(err => res.status(200).json(err))
                .catch(err => res.status(500).json({ message: err }))
            })
            .catch(err => res.status(500).json({ message: err }));
        })
        .catch(err => res.status(500).json({ message: err }));
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
