const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const sequelize = require('./server/db/dbConnection');
const AppMessageTranslation = require('./server/features/appMessageTranslation');
const Exception = require('./server/features/exception');
const Config = require('./server/config');
const UserRepo = require('./server/auth/userRepo');
const AppLogBusiness = require('./server/appLog/appLogBusiness');
const BaseCurrency = require('./server/currencies/baseCurrency');
//Routers Declarations
const transactionRouter = require('./server/wealth/transactions/transactionRouter');
const relatedTransactionRouter = require('./server/wealth/relatedTransactions/relatedTransactionRouter');
const accountRouter = require('./server/wealth/accounts/accountRouter');
const depositRouter = require('./server/wealth/deposits/depositRouter');
const transactionTypesRouter = require('./server/wealth/transactionTypes/transactionTypeRouter');
const bankRouter = require('./server/wealth/banks/bankRouter');
const currencyRouter = require('./server/currencies/currencyRouter');
const relatedTypeRouter = require('./server/wealth/relatedTypes/relatedTypeRouter');
const appSettingsRouter = require('./server/appSettings/appSettingsRouter');
const userRouter = require('./server/auth/userRouter');
const reportRouter = require('./server/wealth/transactionReports/reportRouter');
const dbRouter = require('./server/db/dbRouter');
const billRouter = require('./server/bills/billRouter');
const billTransactionRouter = require('./server/bills/billTransactionRouter');
const expenseTypeRouter = require('./server/expenses/expenseType/expenseTypeRouter');
const expenseRouter = require('./server/expenses/expenseHeader/expenseRouter');
const expenseDetailRouter = require('./server/expenses/expenseDetail/expenseDetailRouter');
const cardRouter = require('./server/cards/cardRouter');
const cardInstRouter = require('./server/cards/cardInstallment/cardInstallmentRouter');
const cardTransRouter = require('./server/cards/cardTransaction/cardTransactionRouter');
const debtorRouter = require('./server/debtors/debtorRouter');
const homeRouter = require('./server/home/homeRouter');
const installmentRouter = require('./server/installments/installmentRouter');
const installmentDetailRouter = require('./server/installments/installmentDetailRouter');
//Constant Variables
const port = Config.port || 5000;
// Initialize App Message Transalation
const messageFile = require('./server/appMessages');
const appMessageTranslation = new AppMessageTranslation(messageFile);
// Initialize App Log
const appLog = new AppLogBusiness();
//Start Express Application
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.get(/^\/(?!api).*/, function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
//Middleware for body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//Authentication
app.use(function(req, res, next){
  if(req.url.includes('authentication')){
    next();
  } else {
    UserRepo.getUserByUserToken(req.headers.authorization)
    .then( (user) => {
      if(user){
        req.body.user = user;
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
//Logging
app.use((req, res, next) => {
  if(!req.url.includes('authentication')
     && !req.headers.logId 
     && req.method !== 'GET') {
    let _body = {...req.body};
    delete _body.user;
    appLog.addAppLog({
      method: req.method,
      pathname: req._parsedUrl.pathname,
      query: req._parsedUrl.query,
      userId: req.body.user.userId,
      userName: req.body.user.userName,
      reqBody: JSON.stringify(_body)
    }).then( logId => {
      req.headers.logId = logId;
      next();
    }).catch( err => {
      console.log(err);
      next();
    });
  } else {
    next();
  }
});
//Base Currency
app.use((req, res, next) => {
  BaseCurrency.getBaseCurrency()
  .then( (baseCurrency) => {
    if(baseCurrency){
      req.body.baseCurrency = baseCurrency;
      next();
    } else {
      res.status(401).send();
    }
  })
  .catch( (err) => {
    res.status(401).send();
  });
});
//Routing Modules
app.use('/api/users', userRouter);
app.use('/api/appsettings', appSettingsRouter);
app.use('/api/wealth/transactions', transactionRouter);
app.use('/api/wealth/relatedTransactions', relatedTransactionRouter);
app.use('/api/wealth/accounts', accountRouter);
app.use('/api/wealth/deposits', depositRouter);
app.use('/api/wealth/transactiontypes', transactionTypesRouter);
app.use('/api/wealth/banks', bankRouter);
app.use('/api/currencies', currencyRouter);
app.use('/api/wealth/relatedTypes', relatedTypeRouter);
app.use('/api/wealth/reports', reportRouter);
app.use('/api/db', dbRouter);
app.use('/api/bills', billRouter);
app.use('/api/billsTransactions', billTransactionRouter);
app.use('/api/expenseTypes', expenseTypeRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/expenseDetail', expenseDetailRouter);
app.use('/api/cards', cardRouter);
app.use('/api/cardInst', cardInstRouter);
app.use('/api/cardTrans', cardTransRouter);
app.use('/api/debt/debtor', debtorRouter);
app.use('/api/home', homeRouter);
app.use('/api/installments', installmentRouter);
app.use('/api/installmentDetail', installmentDetailRouter);
//Middleware for Success
app.use(function(req, res, next){
  const message = appMessageTranslation.translate(res.messageCode, res.params);
  res.status(200).send(message);
  if(req.headers.logId) {
    appLog.updateAppLog(req.headers.logId, {
      resStatus: 'SUCCESS',
      resStatusCode: res.statusCode,
      resErrorMsg: null
    });
  }
})
//Middleware for Errors
app.use(function(err, req, res, next){
  let errorMsg = null;
  if(err instanceof Exception){
    const message = appMessageTranslation.translate(err.message, err.params);
    res.status(400).send(message);
    errorMsg = `${err.message}, ${message}`;
  } else {
    const message = 'Internal Server Error';
    res.status(500).send(message);
    errorMsg = `${message}, ${err}`;
    console.log(errorMsg)
  }
  if(req.headers.logId) {
    appLog.updateAppLog(req.headers.logId, {
      resStatus: 'FAILED',
      resStatusCode: res.statusCode,
      resErrorMsg: errorMsg
    });
  }
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
