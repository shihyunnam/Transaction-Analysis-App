import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'

import axios from "axios"
import { usePlaidLink } from 'react-plaid-link';
axios.defaults.baseURL = "http://localhost:8000"
function App() {
  const [linkToken, setLinkToken] = useState();
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
      console.log("success", public_token, metadata);
    },
  });

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
}

export default App
