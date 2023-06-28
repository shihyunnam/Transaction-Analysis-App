import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'

import axios from "axios" //for making http requests
import { usePlaidLink } from 'react-plaid-link';//used to integrate with the Plaid Link SDK for handling bank account connections
axios.defaults.baseURL = "http://localhost:8000"

//takes publicToken
function PlaidAuth({publicToken}) {
  const [account, setAccount] = useState();
  useEffect(() => {
    async function fetchData() {
      let accessToken = await axios.post("/exchange_public_token", {public_token : publicToken});
      console.log("access Token", accessToken.data);
      const auth = await axios.post("/auth", {access_token : accessToken.data.accessToken});
      console.log("auth data ", auth.data);
      setAccount(auth.data.numbers.ach[0]);

    }
    fetchData();//data 가져옴
  })
  return account && (
    <>
    <p>Account Number: {account.account}</p>
    <p>rounting number: {account.routing}</p>
    </>
   );
}

function App() {
  //creating two state variables using useState function
  const [linkToken, setLinkToken] = useState();
  //to set public token
  const [publicToken , setPublicToken] = useState();
  useEffect(() => {
    async function fetch() {
      const response = await axios.post("/create_link_token");
      setLinkToken(response.data.link_token);
      console.log("response ", response.data);
    }
    fetch();
  } , [])

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      //on success we set it
      setPublicToken(public_token);
      console.log("success", public_token, metadata);
    },
  });

  //if set -> we return 
  return publicToken ? (<PlaidAuth publicToken = {publicToken} />) : (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
}

export default App
