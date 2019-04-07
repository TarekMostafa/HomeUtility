const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./server/db/dbConnection');
//Routers Declarations
const transactionRouter = require('./server/wealth/transactions/transactionRouter');
const accountRouter = require('./server/wealth/accounts/accountRouter');
const transactionTypesRouter = require('./server/wealth/transactionTypes/transactionTypeRouter');
const bankRouter = require('./server/wealth/banks/bankRouter');
//Constant Variables
const port = 5000;
//Start Express Application
const app = express();
//Middleware for body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//Routing Modules
app.use('/api/wealth/transactions', transactionRouter);
app.use('/api/wealth/accounts', accountRouter);
app.use('/api/wealth/transactiontypes', transactionTypesRouter);
app.use('/api/wealth/banks', bankRouter);
//Middleware for Errors
app.use(function(err, req, res, next){
  console.error(err);
  res.status(500).send(err.message);
})
//Connect to MySql database
sequelize.connect().then( () => {
  console.log('Database connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});
//Application listen to specific port to accept connections
app.listen(port, () => {
  console.log(`The server is up and running on port ${port}`);
});

process.on('SIGINT', function(code) {
  console.log(`About to exit the server with code: ${code}`);
  sequelize.disconnect();
});
