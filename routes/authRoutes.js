const express = require('express');

const authRoutes = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const transporter = require('../configs/nodemailer');

// sign up route
authRoutes.post('/signup', (req, res, next) => {
  const { username, password, name, cpf, role } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username, password, name and cpf.' });
    return;
  }

  if (password.length < 7) {
    res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
    return;
  }

  User.findOne({ username }, (err, foundUser) => {

    if (err) {
      res.status(500).json({ message: 'Username check went bad.' });
      return;
    }

    if (foundUser) {
      res.status(400).json({ message: 'Username taken. Choose another one.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i += 1) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const newUser = new User({
      username,
      password: hashPass,
      name,
      cpf,
      token,
      role,
    });


    newUser.save()
      .then(() => {
        transporter.sendMail({
          from: '"Phoenix Forge" <phixit@gin.ink>',
          to: username,
          subject: `Hey,${name}. Welcome to Phix`,
          text: 'Welcome text',
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                                Welcome to Phix! 
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
                                          Your account has been created, now you only have
                                          to confirm the email to have access to login!
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
                                    <a
                                      href="${process.env.EMAIL_HANDLER}/api/confirm/${token}"
                                      style="background-color:#178f8f;border-radius:4px;color:#ffffff;display:inline-block;font-family:Helvetica, Arial, sans-serif;font-size:16px;font-weight:bold;line-height:50px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;"
                                      >Confirm Here</a
                                    >
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
          </html>`,
        });

        req.login(newUser, (err) => {
          if (err) {
            res.status(500).json({ message: 'Login after signup went bad.' });
            return;
          }

          res.status(200).json(newUser);
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({ message: 'Saving user to database went wrong.' });
      })
  });
});

// Login route

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong authenticating user' });
      return;
    }

    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    // save user in session
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Session save went bad.' });
        return;
      }

      res.status(200).json(theUser);
    });
  })(req, res, next);
});

// Logout route will kill the session

authRoutes.get('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Log out success!' });
});

// verify if the user is loggedin in the server

authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});


authRoutes.get('/confirm/:id', (req, res, next) => {
  User.findOneAndUpdate({ token: req.params.id }, { $set: { status: 'Active' } })
    .then((answer) => {
      res.status(200).json(answer);
    })
    .catch(() => res.status(500).json({ message: 'Confirmation failed.' }))
})


module.exports = authRoutes;