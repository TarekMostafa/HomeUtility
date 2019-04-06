const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./server/db/dbConnection');
const transactionRouter = require('./server/wealth/transactions/transactionRouter');
const accountRouter = require('./server/wealth/accounts/accountRouter');
const transactionTypesRouter = require('./server/wealth/transactionTypes/transactionTypeRouter');

const port = 5000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/wealth/transactions', transactionRouter);
app.use('/api/wealth/accounts', accountRouter);
app.use('/api/wealth/transactiontypes', transactionTypesRouter);
app.use(function(err, req, res, next){
  console.error(err);
  res.status(500).send(err.message);
})


sequelize.authenticate().then( () => {
  console.log('Database connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

app.listen(port, () => {
  console.log(`The server is up and running on port ${port}`);
});

//process.on('SIGINT', function(code) {
//  console.log(`About to exit the server with code: ${code}`);
  //sequelize.close();
//});
