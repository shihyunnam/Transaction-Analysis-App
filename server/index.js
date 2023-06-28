//ajax -> asynchronously sends and retrievs data,
//body-parser -> parsing the json file
const express = require("express");//import express module usually for http requests
const cors = require("cors");
const bodyParser = require("body-parser");

//configuring the plaid api
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': '6499146a548cc90015c7ea0b',
      'PLAID-SECRET': '57fbe9d407d73e8eb581ad42e9f5fb',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.post("/hello", (request, response) => {
    response.json({message:"hello " + request.body.name});
})
//if we connect to localhost/ 8000 /hello -> we get the response from the endpoint we just created
// app.get("/hello", (request,response)=> {
//     response.json({message:"hello world!"});
// })

app.post('/create_link_token', async function (request, response) {
  
    const clientUserId = 'user';
    const plaidRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: clientUserId,
      },
      client_name: 'Plaid Test App',
      products: ['auth'],
      language: 'en',
      redirect_uri: 'http://localhost:5173/',
      country_codes: ['US'],
    };
    try {
      const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
      response.json(createTokenResponse.data);
    } catch (error) {
      // handle error
      response.status(500).send("failure");
    }
  });

app.listen(8000, () =>{
    console.log("server started");
})