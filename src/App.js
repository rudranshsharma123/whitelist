import './App.css';
import Papa from 'papaparse';
import React, { useState, useEffect } from "react";
import idl from './assets/idl1.json'
import { Connection, PublicKey, clusterApiUrl, Keypair, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program, Provider, web3, utils } from '@project-serum/anchor';
const App = () => {

  const allowedExtensions = ["csv"];
  // It state will contain the error when
  // correct file extension is not used
  const [walletAddress, setWalletAddress] = useState(null);
  const [namesUsers, setnamesUsers] = useState([]);
  const [NftTitle, setNftTitle] = useState([]);
  const [NftSymbol, setNftSymbol] = useState([]);
  const [NftLink, setNftLink] = useState([]);
  // It will store the file uploaded by the user
  const [tableRows, setTableRows] = useState([]);
  const [values, setValues] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const network = clusterApiUrl('devnet');
  // const NftLink = "https://raw.githubusercontent.com/rudranshsharma123/Certificate-Machine/smart-contract-cleon/test.json"

  // Controls how we want to acknowledge when a transaction is "done".
  const opts = {
    preflightCommitment: "processed"
  }
  const programID = new PublicKey(idl.metadata.address);

  // const NftTitle = "Cukc";
  // const NftSymbol = "CUCK";
  const CREATEWHITELISTING_SEED = "createwhitelistss";
  const CREATEWHITELISTED_SEED = "createwhitelistedaccountss";
  const CREATE_MINT_SEED = "hello";
  const TOKEN_METADATA_PROGRAM_ID = "djsk"
  // Only call this function once for each wallet address no need to run it again it will fail
  const initializeStorageAccount = async () => {
    const baseAccount = new PublicKey(walletAddress)
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const [pda, _] = await PublicKey.findProgramAddress(
      [
        baseAccount.toBytes(),
        Buffer.from(utils.bytes.utf8.encode(CREATEWHITELISTING_SEED)),
      ],
      program.programId,
    );
    const tx = await program.methods
      .createwhitelist()
      .accounts({
        creator: baseAccount,
        mainWhitelistingAccount: pda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  const mintProcess = async (buyer_address, position) => {
    try {


      const buyer = new PublicKey(buyer_address)
      console.log(buyer.toString())
      const baseAccount = new PublicKey(walletAddress)
      console.log(baseAccount)
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      // const account = await program.account.baseAccount.fetch(baseAccount.publicKey);




      // console.log("Got the account", account)
      const [pda, _] = await PublicKey.findProgramAddress(
        [
          baseAccount.toBytes(),
          Buffer.from(utils.bytes.utf8.encode(CREATEWHITELISTING_SEED)),
        ],
        program.programId,
      );



      const [newPda, _1] = await PublicKey.findProgramAddress(
        [
          Buffer.from(utils.bytes.utf8.encode(CREATEWHITELISTING_SEED)),
          Buffer.from(utils.bytes.utf8.encode(CREATEWHITELISTED_SEED)),
          baseAccount.toBuffer(),
          buyer.toBuffer(),
        ],
        program.programId,
      );
      const tx = await program.methods
        .createWhitelistedAccount(buyer)
        .accounts({
          mainWhiteListingAccount: pda,
          whiteListedAccount: newPda,
          authority: baseAccount,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log("done")


    } catch (error) {
      console.log("Error in mintProcess: ", error)
      console.log("Number is ", position);

      // await sleep(1000);
      // await mintProcess(recipients[position], position);


    }
  }

  const createNewWhitelistedAccount = async (address) => {
    const baseAccount = new PublicKey(walletAddress)
    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    const [pda, _] = await PublicKey.findProgramAddress(
      [
        baseAccount.toBytes(),
        Buffer.from(utils.bytes.utf8.encode(CREATEWHITELISTING_SEED)),
      ],
      program.programId,
    );

    const publicKey = new PublicKey(
      "7iuqddUQJhger2p75SGV3MngZW6WEG6DDnW3U4yZHYWK",
    );
    console.log(pda);

    const [newPda, _1] = await PublicKey.findProgramAddress(
      [
        Buffer.from(utils.bytes.utf8.encode(CREATEWHITELISTING_SEED)),
        Buffer.from(utils.bytes.utf8.encode(CREATEWHITELISTED_SEED)),
        baseAccount.toBuffer(),
        publicKey.toBuffer(),
      ],
      program.programId,
    );
    const tx = await program.methods
      .createWhitelistedAccount(publicKey)
      .accounts({
        mainWhiteListingAccount: pda,
        whiteListedAccount: newPda,
        authority: baseAccount,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("done")
  }
  // This function will be called when
  // the file input changes
  const { SystemProgram, Keypair } = web3;
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()

          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );
  const sendAddress = async () => {
    var recipients_length = recipients.length;
    let position = 0;
    for (var i = 0; i < recipients_length; i++) {
      console.log(i);
      console.log(namesUsers[i]);

      console.log(recipients[i]);
      position = i;

      await mintProcess(recipients[i], position);

    }
  };
  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);





  const changeHandler = async (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse

    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];
        var string = '';
        const names = [];
        const symbols = [];
        const recipients_to_send = [];
        const link = [];
        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
          recipients_to_send.push(Object.values(d)[1]);
          names.push(Object.values(d)[0]);
          symbols.push(Object.values(d)[3]);
          link.push(Object.values(d)[2]);
          // string +="hello";
        });

        setNftLink(link);
        setNftTitle(names);
        setNftSymbol(symbols);
        setTableRows(rowsArray[0]);
        setRecipients(recipients_to_send);
        setValues(valuesArray);
        setnamesUsers(names);

        console.log(recipients);
        console.log(string);
        console.log(results.data);
        console.log(rowsArray[0]);
        console.log(valuesArray);

      },

    });
    // console.log(results.data);

    // console.log(values);
    // console.log(tableRows);
    // console.log("hello");

  };



  return (

    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>

        <div className="header-container">
          <p className="header">Certificate Machine</p>
          <p className="sub-text">
            Tool designed to help Institutions and Business to use Solana Blockchain!
          </p>
        </div>
        <div>{!walletAddress && renderNotConnectedContainer()}</div>
        <div>
          <button className="cta-button button-to-transfer" onClick={async () => {
            sendAddress()
          }}>Send NFTs</button>
        </div>
        <div>
          <button className="cta-button button-to-send" onClick={async () => {
            createNewWhitelistedAccount()
          }}>Send to All Adresses</button>
        </div>
        <div>
          <button className="cta-button button-to-init" onClick={async () => {
            initializeStorageAccount();
          }}>Init Account</button>
        </div>
        <div><p className="sub-text">
          Enter a csv file ✨
        </p>
          <input
            type="file"
            name="file"
            className="select-file"
            onChange={changeHandler}
            accept=".csv"
            style={{ margin: "10px auto" }}
          />
          <br />
          <br />
          <table className="styled-table">

            <thead className="styled-table thead tr">
              <tr>
                {/* <p className="minus-text"> */}
                {/* <p className="sub-text"> */}
                {tableRows.map((rows, index) => {

                  return <th className="minus-text" key={index}>{rows}</th>;
                })}
                {/* </p> */}
              </tr>
            </thead>
            <tbody>
              {values.map((value, index) => {
                return (
                  <tr key={index}>
                    {value.map((val, i) => {
                      return <td className="minus-text" key={i}>{val}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        {/* File Uploader */}


        {/* Table */}

      </div>
    </div>
    //   </Routes>
    // </Router>
  );
};

export default App;
