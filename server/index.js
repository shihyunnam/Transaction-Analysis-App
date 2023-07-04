//ajax -> asynchronously sends and retrievs data,
//body-parser -> parsing the json file
const express = require("express");//handles HTTP requests and define routes
const cors = require("cors");//security when requesting resource shared
const bodyParser = require("body-parser");//for json parsing

//configuring the plaid api
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');//from plaid package, importing modules

// Configuring the Plaid API//구성
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,// Setting the Plaid API environment to sandbox -> fake money
  baseOptions: {
    headers: {
      //should put personal data
      'PLAID-CLIENT-ID': '',
      'PLAID-SECRET': '',
    },
  },
});

const plaidClient = new PlaidApi(configuration);// Creating a Plaid client using the provided configuration, making new instance

const app = express();
app.use(cors());
app.use(bodyParser.json());



//The first step is to create a new link_token by making a /link/token/create request and passing in the required 
// configurations. This link_token is a short lived, one-time use token that authenticates your app with Plaid Link, 
// our frontend module. Several of the environment variables you configured when launching the Quickstart, 
// such as PLAID_PRODUCTS, are used as parameters for the link_token.
app.post('/create_link_token', async function (request, response) {

    const clientUserId = 'user';
    //plaid Request
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
      //Once you have a link_token, you can use it to initialize Link.
      const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
      response.json(createTokenResponse.data);
    } catch (error) {
      // handle error
      response.status(500).send("failure");
    }
  });

//for accesstoken
app.post("/auth", async function(request, response) {
  try {
    const access_token = request.body.access_token;//recieving from react
    const plaidRequest = {
      access_token : access_token,
    };
    const plaidResponse = await plaidClient.authGet(plaidRequest);
    response.json(plaidResponse.data);

  } catch {
    response.status(500).send("failed");
  }
});
//exchanging to public token
app.post('/exchange_public_token', async function (
    request,
    response,
    next,
  ) {
    const publicToken = request.body.public_token;
    try {
      const plaidResponse = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
  
      // These values should be saved to a persistent database and
      // associated with the currently signed-in user
      const accessToken = plaidResponse.data.access_token;
      //const itemID = response.data.item_id;
  
      response.json({ accessToken });
    } catch (error) {
      // handle error
      response.status(500).send("failed");

    }
});


app.listen(8000, () =>{
    console.log("server started");
})

