const express = require("express");

const Users = require("../../models/aia/users");

const router = new express.Router();

router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  Users.find({ email, password }, (err, docs) => {
    if (docs.length > 0) {
      const user = {
        _id: docs[0].id,
        name: docs[0].name,
        email: docs[0].email,
      };

      res.send(user);
    } else {
      res.status(400).json({ message: "Invalid Credentials Nothins Here" });
    }
  });
});

//register
router.post("/admin/register", async (req, res) => {
  const { name, email, password } = req.body;

  Users.find({ email: req.body.email }, async (err, docs) => {
    if (docs.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    } else {
      const newUser = new Users({
        name,
        email,
        password,
      });

      newUser.save((err) => {
        if (!err) {
          return res.status(200).send(newUser);
        } else {
          return res.send("Something went wrong!");
        }
      });
    }

    if (err) {
      return res.status(400).json({ message: "Something went wrong!" });
    }
  });
});

module.exports = router;
