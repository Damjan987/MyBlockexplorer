import React, { useState } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

const App = () => {
  const [socket, setSocket] = useState(null);

  // ---------------------------------------------------------
  // --------------- main variable states --------------------
  // ---------------------------------------------------------
  const [block, setBlock] = useState(null);
  const [blockByHash, setBlockByHash] = useState(null);
  const [transaction, setTransation] = useState(null);
  const [transactionFee, setTransationFee] = useState(null);
  const [transactionOutputs, setTransationOutputs] = useState(null);

  // ---------------------------------------------------------
  // ------------------ input variables ----------------------
  // ---------------------------------------------------------
  const [inputBlockHeight, setInputBlockHeight] = useState("");
  const [inputTransaction, setInputTransation] = useState("");
  const [inputBlockHash, setInputBlockHash] = useState("");

  // ---------------------------------------------------------
  // ---------------------- RESULT 1 -------------------------
  // ---------------------------------------------------------

  const handleBlockHeightChange = (evt) => {
    setInputBlockHeight(evt.target.value);
  };

  const handleBlockHeightSubmit = (evt) => {
    evt.preventDefault();
    const serverConnection = socketIOClient("http://localhost:3000", {
      transports: ["websocket"],
    });
    serverConnection.on("connect", () => {
      serverConnection.emit(
        "blockHeight",
        parseInt(inputBlockHeight),
        (data) => {
          setBlock(data);
        }
      );
    });
    serverConnection.on("error", (error) => {
      console.error(`${error}`);
    });
    serverConnection.connect();
    setSocket(serverConnection);
  };

  // ---------------------------------------------------------
  // ---------------------- RESULT 2 -------------------------
  // ---------------------------------------------------------

  const handleBlockHashChange = (evt) => {
    setInputBlockHash(evt.target.value);
  };

  const handleBlockHashSubmit = (evt) => {
    evt.preventDefault();
    const serverConnection = socketIOClient("http://localhost:3000", {
      transports: ["websocket"],
    });
    serverConnection.on("connect", () => {
      serverConnection.emit("blockHash", inputBlockHash, (data) => {
        setBlockByHash(data);
      });
    });
    serverConnection.on("error", (error) => {
      console.error(`${error}`);
    });
    serverConnection.connect();
    setSocket(serverConnection);
  };

  // ---------------------------------------------------------
  // ---------------------- RESULT 3 -------------------------
  // ---------------------------------------------------------

  const handleTransactionChange = (evt) => {
    setInputTransation(evt.target.value);
  };

  const handleTransactionSubmit = (evt) => {
    evt.preventDefault();
    const serverConnection = socketIOClient("http://localhost:3000", {
      transports: ["websocket"],
    });
    serverConnection.on("connect", () => {
      serverConnection.emit(
        "transaction",
        inputTransaction,
        (data, fee, outs) => {
          setTransation(data);
          setTransationFee(fee.toFixed(8));
          setTransationOutputs(outs);
        }
      );
    });
    serverConnection.on("error", (error) => {
      console.error(`${error}`);
    });
    serverConnection.connect();
    setSocket(socket);
  };

  return (
    <section>
      <div className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h1>
                <i className="fas fa-home"> Damjanov blockexplorer</i>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light my-3">
        <div className="container">
          <div className="row pb-3">
            <div className="col-md-4 my-1">
              <form onSubmit={handleBlockHeightSubmit}>
                <input
                  type="text"
                  className="form-control"
                  value={inputBlockHeight}
                  onChange={handleBlockHeightChange}
                  id="exampleInputEmail1"
                  placeholder="Find by block height"
                />
                <button type="submit" className="btn btn-primary">
                  Find
                </button>
              </form>
            </div>

            <div className="col-md-4 my-1">
              <form onSubmit={handleBlockHashSubmit}>
                <input
                  type="text"
                  className="form-control"
                  value={inputBlockHash}
                  onChange={handleBlockHashChange}
                  id="exampleInputEmail1"
                  placeholder="Find by hash"
                />
                <button type="submit" className="btn btn-warning">
                  Find
                </button>
              </form>
            </div>

            <div className="col-md-4 my-1">
              <form onSubmit={handleTransactionSubmit}>
                <input
                  type="text"
                  className="form-control"
                  value={inputTransaction}
                  onChange={handleTransactionChange}
                  id="exampleInputEmail1"
                  placeholder="Find by transaction"
                />
                <button type="submit" className="btn btn-success">
                  Find
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {block ? (
            <ul className="list-group">
              <li className="list-group-item active">Result 1</li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block height: <em>{block.height}</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block hash: <em>{block.hash}</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Previous block hash: <em>{block.previousblockhash}</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Num of transactions inside this block: <em>{block.nTx}</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block size: <em>{block.size} bytes</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block weight: <em>{block.weight}</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block version: <em>{block.version}</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Num of confirmations in this block:{" "}
                <em>{block.confirmations}</em>
              </li>
              <span style={{ background: "black", color: "white" }}>
                Block's transactions:
              </span>
              {block.tx.map((item, index) => (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center"
                  key={index}
                >
                  Transaction ID: <em>{item}</em>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="col-12">
          {blockByHash ? (
            <ul className="list-group">
              <li className="list-group-item bg-warning">Result 2</li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block height: <em>{blockByHash.height}</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block hash: <em>{blockByHash.hash}</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Previous block hash: <em>{blockByHash.previousblockhash}</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Num of transactions inside this block:{" "}
                <em>{blockByHash.nTx}</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block size: <em>{blockByHash.size} bytes</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block weight: <em>{blockByHash.weight}</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block version: <em>{blockByHash.version}</em>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Num of confirmations in this block:{" "}
                <em>{blockByHash.confirmations}</em>
              </li>
              <span style={{ background: "black", color: "white" }}>
                Block's transactions:
              </span>
              {blockByHash.tx.map((item, index) => (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center"
                  key={index}
                >
                  Transaction ID: <em>{item}</em>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="col-12">
          {transaction ? (
            <ul className="list-group">
              <li className="list-group-item bg-success">Result 3</li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Transaction size: <em>{transaction.size}</em> bytes
              </li>
              {transactionFee ? (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Transaction fee: <em>{transactionFee}</em>
                </li>
              ) : null}
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Hash: <em>{transaction.hash}</em>
              </li>
              {transactionOutputs ? (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Value of it's output transactions:{" "}
                  <em>{transactionOutputs}</em>
                </li>
              ) : null}
              <span style={{ background: "black", color: "white" }}>
                Input transactions:
              </span>
              {transaction.vin.map((item, index) => (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center"
                  key={index}
                >
                  Transaction ID: <em>{item.txid}</em>
                </li>
              ))}
              <span style={{ background: "black", color: "white" }}>
                Izlazne adrese i vrijednost:
              </span>
              {transaction.vout.map((item, index) => (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center"
                  key={index}
                >
                  {index + 1}.{" "}
                  <em>
                    {item.scriptPubKey.addresses} - {item.value}
                  </em>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default App;
