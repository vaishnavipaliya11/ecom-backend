const User = require("../models/user");
const Cart = require("../models/cart");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const Session = require("express-session-sequelize")(session.Store);
exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn, "req.session.isLoggedIn from GET");
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(email, "email", password, "password");

  User.findOne({ where: { email: email } }).then((user) => {
    if (!user) {
      return res.status(409).send("User does not exists.");
    }

    bcrypt
      .compare(password, user.password)
      .then((passwordMatched) => {
        if (passwordMatched) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res
              .status(200)
              .send({
                isLoggedIn: req.session.isLoggedIn,
                user: req.session.user,
              });
          });
        }
        res.status(409).send({ error: "Email and password does not match" });
      })
      .catch((err) => {
        console.log(err, "login err");
        res.status(500).send({ error: "Something wend wrong" });
      });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err, "destroy err");
    res.redirect("/login");
  });
};

// exports.postLogout = async (req, res, next) => {
//   const sessionID = req.sessionID;

//   try {
//     await Session.destroy({ where: { s_id: sessionID } });
//     console.log('Session deleted from the database');
//   } catch (error) {
//     console.error('Error deleting session:', error);
//   }

//   req.session.destroy((err) => {
//     if (err) {
//       console.error('Error destroying session:', err);
//     }
//     res.redirect('/login');
//   });
// };
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  console.log(email, "email", password, "password");

  User.findOne({ where: { email: email } })
    .then((userDoc) => {
      if (userDoc) {
        return res.status(409).send({ error: "User already exists" });
      }
      return bcrypt
        .hash(password, 6)
        .then((hashedPassword) => {
          console.log(hashedPassword, "hashedPassword");
          return User.create({
            email: req.body.email,
            password: hashedPassword, // Set the hashed password here
          });

          // return user.Create({email:email, password:password});
        })
        .then((newUser) => {
          // Create a cart and associate it with the new user
          return Cart.create().then((newCart) => {
            return newUser.setCart(newCart); // Associate cart with user
          });
        })
        .then((result) => {
          res.send(result);
        });
    })
    .catch((err) => {
      console.log(err, "sign up error");
    });
};
