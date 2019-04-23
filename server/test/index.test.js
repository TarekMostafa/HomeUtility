expect = require('chai').expect;

const Transaction = require('../wealth/transactions/transaction');
const transaction = new Transaction();

describe('Transactions Module', () => {
  it('check function evalTransactionAmount', () => {
    expect(transaction.evalTransactionAmount(100,'Credit', false)).to.equal(100);
    expect(transaction.evalTransactionAmount(100,'Debit', false)).to.equal(-100);
    expect(transaction.evalTransactionAmount(100,'Credit', true)).to.equal(-100);
    expect(transaction.evalTransactionAmount(100,'Debit', true)).to.equal(100);
    expect(transaction.evalTransactionAmount(100,'', true)).to.be.null;
  });
});
