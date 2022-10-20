const express = require("express");
const router = new express.Router();
const Web3 = require("web3");
const axios = require("axios");

//models
const User = require("../models/users");

const contract_address = "0x2ec79904C2aB4F8b6e8e89c743CB7F7a88DFc0fE";

const contract_abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "holder",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "bnbSpent",
        type: "uint256",
      },
    ],
    name: "BuyBackWithNoFees",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isExcluded",
        type: "bool",
      },
    ],
    name: "ExcludeFromFees",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isExcluded",
        type: "bool",
      },
    ],
    name: "ExcludeMultipleAccountsFromFees",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "newValue",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "oldValue",
        type: "uint256",
      },
    ],
    name: "GasForProcessingUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newLiquidityWallet",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "oldLiquidityWallet",
        type: "address",
      },
    ],
    name: "LiquidityWalletUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newLiquidityWallet",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "oldLiquidityWallet",
        type: "address",
      },
    ],
    name: "OperationsWalletUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "iterations",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "claims",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lastProcessedIndex",
        type: "uint256",
      },
      { indexed: true, internalType: "bool", name: "automatic", type: "bool" },
      { indexed: false, internalType: "uint256", name: "gas", type: "uint256" },
      {
        indexed: true,
        internalType: "address",
        name: "processor",
        type: "address",
      },
    ],
    name: "ProcessedDividendTracker",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokensSwapped",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "SendDividends",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pair", type: "address" },
      { indexed: true, internalType: "bool", name: "value", type: "bool" },
    ],
    name: "SetAutomatedMarketMakerPair",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokensSwapped",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethReceived",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokensIntoLiqudity",
        type: "uint256",
      },
    ],
    name: "SwapAndLiquify",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "oldAddress",
        type: "address",
      },
    ],
    name: "UpdateDividendTracker",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "oldAddress",
        type: "address",
      },
    ],
    name: "Updaterouter",
    type: "event",
  },
  {
    inputs: [],
    name: "RewardsFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "_isBot",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "activateContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "automatedMarketMakerPairs",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "buyBackTokensWithNoFees",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "disableTransferDelay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "dividendTokenBalanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dividendTracker",
    outputs: [
      {
        internalType: "contract ALTSDividendTracker",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "excludeFromDividends",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "bool", name: "excluded", type: "bool" },
    ],
    name: "excludeFromFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "accounts", type: "address[]" },
      { internalType: "bool", name: "excluded", type: "bool" },
    ],
    name: "excludeMultipleAccountsFromFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "gasForProcessing",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getAccountDividendsInfo",
    outputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "int256", name: "", type: "int256" },
      { internalType: "int256", name: "", type: "int256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "getAccountDividendsInfoAtIndex",
    outputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "int256", name: "", type: "int256" },
      { internalType: "int256", name: "", type: "int256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "holder", type: "address" }],
    name: "getBNBAvailableForHolderBuyBack",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getClaimWait",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDividendTokensMinimum",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLastProcessedIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNumberOfDividendTokenHolders",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "holder", type: "address" }],
    name: "getRawBNBDividends",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "getRewardTokenSelectionCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalDividendsDistributed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "holder", type: "address" }],
    name: "getUserCurrentRewardToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "holder", type: "address" }],
    name: "getUserHasCustomRewardToken",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "holderBNBUsedForBuyBacks",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "includeInDividends",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "ammAddress", type: "address" }],
    name: "isAMMWhitelisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "isExcludedFromFees",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
    ],
    name: "isIgnoredToken",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidityFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidityWallet",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSellPercentage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "operationFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "operationsWallet",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pair",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "gas", type: "uint256" }],
    name: "processDividendTracker",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "recoverContractBNB",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "router",
    outputs: [{ internalType: "contract IRouter", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sellIncreaseFactor",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sellLiquidityFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sellOperationFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sellRewardsFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sellTotalFees",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_maxSellPercent", type: "uint256" },
      { internalType: "uint256", name: "_sellIncreaseFactor", type: "uint256" },
    ],
    name: "setAntiDump",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newpair", type: "address" },
      { internalType: "bool", name: "value", type: "bool" },
    ],
    name: "setAutomatedMarketMakerPair",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "bool", name: "isIgnored", type: "bool" },
    ],
    name: "setIgnoreToken",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "wallet", type: "address" },
      { internalType: "bool", name: "status", type: "bool" },
    ],
    name: "setIsBot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "rewardTokenAddress", type: "address" },
    ],
    name: "setRewardToken",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "rewardTokenAddress", type: "address" },
      { internalType: "address", name: "ammContractAddress", type: "address" },
    ],
    name: "setRewardTokenWithCustomAMM",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "state", type: "bool" }],
    name: "setSwapEnabled",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "ammAddress", type: "address" },
      { internalType: "bool", name: "isWhiteListed", type: "bool" },
    ],
    name: "setWhiteListAMM",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapEnabled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "swapTokensAtAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalFees",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "transferDelayEnabled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unsetRewardToken",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "claimWait", type: "uint256" }],
    name: "updateClaimWait",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "minimumToEarnDivs", type: "uint256" },
    ],
    name: "updateDividendTokensMinimum",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newAddress", type: "address" }],
    name: "updateDividendTracker",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newAddress", type: "address" }],
    name: "updateDividendrouter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_rewards", type: "uint256" },
      { internalType: "uint256", name: "_liquidity", type: "uint256" },
      { internalType: "uint256", name: "_operation", type: "uint256" },
    ],
    name: "updateFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newValue", type: "uint256" }],
    name: "updateGasForProcessing",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newLiquidityWallet", type: "address" },
    ],
    name: "updateLiquidityWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newOperationsWallet", type: "address" },
    ],
    name: "updateOperationsWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newAddress", type: "address" }],
    name: "updateRouter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_rewards", type: "uint256" },
      { internalType: "uint256", name: "_liquidity", type: "uint256" },
      { internalType: "uint256", name: "_operation", type: "uint256" },
    ],
    name: "updateSellFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newAmount", type: "uint256" }],
    name: "updateSwapTokensAtAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "userSellPerCycle",
    outputs: [
      { internalType: "uint256", name: "currentSellFee", type: "uint256" },
      { internalType: "uint256", name: "firstSellTime", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "withdrawableDividendOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];



const web3 = new Web3(new Web3.providers.HttpProvider("https://dataseed1.binance.org"))

const contract = new web3.eth.Contract(contract_abi, contract_address);

//login
router.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  User.find({ email, password }, (err, docs) => {
    if (docs.length > 0) {
      const user = {
        _id: docs[0].id,
        name: docs[0].name,
        email: docs[0].email,
        walletAddress: docs[0].walletAddress,
        privateKey: docs[0].privateKey,
      };

      res.send(user);
    } else {
      res.status(400).json({ message: "Invalid Credentials Nothins Here" });
    }
  });
});

//register
router.post("/api/users/register", async (req, res) => {
  const { name, email, password, walletAddress, privateKey } = req.body;

  let account = web3.eth.accounts.create(web3.utils.randomHex(32));
  let wallet = web3.eth.accounts.wallet.add(account);
  let keystore = wallet.encrypt(web3.utils.randomHex(32));

  //   console.log({ account: account, wallet: wallet, keystore: keystore });

  User.find({ email: req.body.email }, async (err, docs) => {
    if (docs.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    } else {
      const newUser = new User({
        name,
        email,
        password,
        walletAddress,
        privateKey,
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

//send
router.post("/api/tokens/send", async (req, res) => {
  var amount = req.body.sendinfo.ammount * 10 ** 9;
  console.log(await contract.methods.balanceOf("0x8c63A245Ea832447175e687d60fd26D062D6552a").call())
  // const bal = await contract.methods
  //   .balanceOf("0x8c63A245Ea832447175e687d60fd26D062D6552a")
  //   .call()
  //   .then((token) => {
  //     console.log(token);
  //   })
  //   .catch((err) => console.log(err.message));


  //   async function getBalance() {
  //     let balance = await contract.methods
  //       .balanceOf(req.body.walletAddress)
  //       .call()
  //       .then((token) => {
  //         return console.log(token);
  //       });
  //     return balance;
  //   }

  //   let data = contract.methods
  //     .transfer(req.body.sendinfo.sendTo, web3.utils.toBN(amount))
  //     .encodeABI();

  //   sendErcToken();

  //   function sendErcToken() {
  //     let txtObj = {
  //       gas: 30000,
  //       to: "0x18222243880531b1bAB5EAc22C52F6eee9d8EAdC",
  //       value: "0x00",
  //       data: data,
  //       from: req.body.walletAddress,
  //     };

  //     web3.eth.accounts
  //       .signTransaction(txtObj, req.body.privateKey)
  //       .then((signedTx) =>
  //         web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  //       )
  //       .then((receipt) => {
  //         return console.log("Transaction receipt:", receipt);
  //       })
  //       .catch((err) => console.log(err));
  //   }

  // return res.send(bal);
});

//get account balance
router.post("/api/users/balance", async (req, res) => {
  const { walletAddress } = req.body;

  web3.eth
    .getBalance(walletAddress)
    .then((result) => res.status(200).send(result));
});

module.exports = router;
