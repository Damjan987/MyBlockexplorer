const http = require("http");
const cors = require("cors");
const app = require("express")();
const bitcoincore = require("bitcoin-core");

const client = new bitcoincore({
  host: "blockchain.oss.unist.hr",
  port: 8332,
  username: "student",
  password: "IhIskjGukNz9bRpWJL0FBNXmlSBd1pS5AtJdG1zfavLaICBuP4VDPEPMu67ql7U3",
});

app.use(cors());

app.get("/", (req, res) => {});
const server = http.createServer(app);
const socketIo = require("socket.io")(server);

server.listen(3000);

socketIo.on("connection", (server) => {
  server.on("blockHeight", (blockHeight, callback) => {
    client.getBlockHash(blockHeight).then((blockHash) => {
      client.getBlock(blockHash).then((block) => {
        callback(block);
      });
    });
  });

  server.on("blockHash", (blockHash, callback) => {
    client.getBlock(blockHash).then((blockByHash) => {
      callback(blockByHash);
    });
  });

  server.on("transaction", (transaction, callback) => {
    getOutputs(transaction).then((block) => {
      getTransactionFee(transaction).then((fee) => {
        callback(block.decodedTransaction, fee, block.value);
      });
    });
  });
});

const getOutputs = async (txid) => {
  var transaction = await client.getRawTransaction(txid);
  var decodedTransaction = await client.decodeRawTransaction(transaction);
  var outputAmount = 0;
  for (let i = 0; i < decodedTransaction.vout.length; i++) {
    outputAmount += decodedTransaction.vout[i].value;
  }

  return { decodedTransaction, outputAmount };
};

const getTransactionFee = async (txid) => {
  var transaction = await client.getRawTransaction(txid);
  var decodedTransaction = await client.decodeRawTransaction(transaction);
  var vinVouts = [];
  for (let i = 0; i < decodedTransaction.vin.length; i++) {
    vinVouts.push(decodedTransaction.vin[i].vout);
  }
  var vouts = 0;
  var temp = await client.getRawTransaction(decodedTransaction.vin[0].txid);
  var decodedTransaction_2 = await client.decodeRawTransaction(temp);
  for (let i = 0; i < vinVouts.length; i++) {
    vouts += decodedTransaction_2.vout[vinVouts[i]].value;
  }
  var voutPocetna = 0;
  for (let i = 0; i < decodedTransaction.vout.length; i++) {
    voutPocetna += decodedTransaction.vout[i].value;
  }
  voutPocetna.toFixed(8);
  vouts.toFixed(8);

  return vouts - voutPocetna;
}