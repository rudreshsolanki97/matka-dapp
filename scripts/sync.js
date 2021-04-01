require("dotenv").config();
const Web3 = require("web3");

const rpc =
  process.env.RPC || "https://data-seed-prebsc-1-s1.binance.org:8545/";

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { ABI, ADDRESS } = require("./contract");

async function sync() {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new web3.eth.Contract(ABI, ADDRESS);
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

  const data = contract.methods.sync().encodeABI();
  const tx = {
    to: ADDRESS,
    data: data,
    from: account.address,
  };
  tx["gasPrice"] = parseInt(await web3.eth.getGasPrice(), 16);
  tx["gasLimit"] = await web3.eth.estimateGas(tx);
  console.log(tx);
  const signed = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  return await web3.eth.sendSignedTransaction(signed.rawTransaction);
}

const HOUR_TO_SEC = 60 * 60 * 1000;

setInterval(() => {
  sync().then((resp) => console.log(resp));
}, HOUR_TO_SEC);
sync().then((resp) => console.log(resp));
