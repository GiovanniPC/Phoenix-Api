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
    const confirmationCode = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      name,
      cpf,
      token: confirmationCode,
      role,
    });


    newUser.save()
      .then(() => {
        transporter.sendMail({
          from: '"Phoenix Forge" <phoenixforge@hotmail.com>',
          to: username,
          subject: 'Welcome to Phoenix Forge! Please confirm your account.',
          text: `Please, click on the link below to confirm your account: ${process.env.BASE_URL}/${confirmationCode}`,
          html: `
        <h3>Hi, there!</h3>
        <p>Please, click <a href="${process.env.BASE_URL}/${confirmationCode}" target="_blank">here</a> to confirm your account.</p>`,
        });

        req.login(newUser, (err) => {

          if (err) {
            res.status(500).json({ message: 'Login after signup went bad.' });
            return;
          }

          res.status(200).json(newUser);
        });

      }).catch((error) => {
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
  User.findOneAndUpdate({ token: req.params.id }, { $set: { status: 'Active' }})
    .then((answer) => {
      res.status(200).json(answer);
    })
    .catch(() => res.status(500).json({ message: 'Confirmation failed.' }))      
})


module.exports = authRoutes;