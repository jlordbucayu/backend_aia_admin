const express = require("express");

const Web3 = require("web3");
const axios = require("axios");
const router = express.Router();

//convertion
router.get("/convert/:crypto/:amount/:type", async (req, res) => {
  const { crypto, amount, type } = req.params;

  const link = {
    usdtocrypto: `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${crypto}`,
    cryptotousd: `https://min-api.cryptocompare.com/data/price?fsym=${crypto}&tsyms=USD`,
  };

  let total_value = 0;

  const data = await axios.get(link[type], {
    headers: {
      "Content-Type": `application/json`,
      Accept: "*/*",
    },
  });


  let exchange_rate;
  if (type === "usdtocrypto") {
    total_value = amount * data.data[crypto];
  }

  if (type === "cryptotousd") {

    total_value = data.data["USD"] * amount;
  }

  res.status(200).send({ coin: total_value });
});

//request payment
router.post("/api/payment/request", async (req, res) => {
  // const {prefered_crypto,name,email,message,amount,cryto_amount,walletAddress} = req.body;

  res.status(200).send(req.body);
});

module.exports = router;
