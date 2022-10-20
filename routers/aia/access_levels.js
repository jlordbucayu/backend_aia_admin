const express = require("express");
const { now } = require("mongoose");

const AccessLevel = require("../../models/aia/access_levels");

const router = new express.Router();

router.post("/access_level/create", async (req, res) => {
  const { user_id, access_level } = req.body;

  const data = new AccessLevel({ user_id, access_level, date: Date.now() });

  try {
    await data.save();

    res.status(200).send("User created");
  } catch (error) {
    res.status(500).send("Bad Request");
  }
});

router.get("/access_level/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  const data = await AccessLevel.find({ user_id });

  try {
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("Bad Request");
  }
});
module.exports = router;
