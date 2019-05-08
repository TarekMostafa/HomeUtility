const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./server/db/dbConnection');
//Routers Declarations
const transactionRouter = require('./server/wealth/transactions/transactionRouter');
const accountRouter = require('./server/wealth/accounts/accountRouter');
const transactionTypesRouter = require('./server/wealth/transactionTypes/transactionTypeRouter');
const bankRouter = require('./server/wealth/banks/bankRouter');
const currencyRouter = require('./server/currencies/currencyRouter');
const appSettingsRouter = require('./server/appSettings/appSettingsRouter');
const userRouter = require('./server/auth/userRouter');
const reportRouter = require('./server/wealth/transactionReports/reportRouter');
const dbRouter = require('./server/db/dbRouter');
const UserRepo = require('./server/auth/userRepo');
const Config = require('./server/config');
//Constant Variables
const port = Config.port || 5000;
//Start Express Application
const app = express();
//Middleware for body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//Authentication
app.use(function(req, res, next){
  if(req.url.includes('/free/')){
    next();
  } else {
    UserRepo.getUserByUserToken(req.headers.authorization)
    .then( (user) => {
      if(user){
        next();
      } else {
        res.status(401).send();
      }
    })
    .catch( (err) => {
      res.status(401).send();
    })
  }
})
//Routing Modules
app.use('/free/users', userRouter);
app.use('/api/appsettings', appSettingsRouter);
app.use('/api/wealth/transactions', transactionRouter);
app.use('/api/wealth/accounts', accountRouter);
app.use('/api/wealth/transactiontypes', transactionTypesRouter);
app.use('/api/wealth/banks', bankRouter);
app.use('/api/currencies', currencyRouter);
app.use('/api/wealth/reports', reportRouter);
app.use('/api/db', dbRouter);
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
