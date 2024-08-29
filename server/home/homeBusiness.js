const AccountRepo = require('../wealth/accounts/accountRepo');
const DepositRepo = require('../wealth/deposits/depositRepo');
const CardRepo = require('../cards/cardRepo');
const DebtorRepo = require('../debtors/debtorRepo');
const AmountHelper = require('../helper/AmountHelper');

class HomeBusiness {

    async getTotals({baseCurrency}) {

        let accountsAggregate = await AccountRepo.getAccountsTotalByCurrency();
        accountsAggregate = accountsAggregate.map( aggregate => {
            const equivalentBalance = Number(aggregate.dataValues.totalBalance * 
                aggregate.currency.currencyRateAgainstBase).toFixed(baseCurrency.currencyDecimalPlace)
            return {
                currency: aggregate.accountCurrency,
                totalBalance: Number(aggregate.dataValues.totalBalance)
                    .toFixed(aggregate.currency.currencyDecimalPlace),
                formattedTotalBalance: AmountHelper.formatAmount(aggregate.dataValues.totalBalance, 
                    aggregate.currency.currencyDecimalPlace),
                totalCount: aggregate.dataValues.totalCount,
                equivalentBalance,
                formattedEquivalentBalance: AmountHelper.formatAmount(equivalentBalance, 
                    baseCurrency.currencyDecimalPlace),
                equivalentCurrency: baseCurrency.currencyCode
            }
        });

        let depositsAggregate = await DepositRepo.getDepositsTotalByCurrency();
        depositsAggregate = depositsAggregate.map( aggregate => {
            const equivalentBalance = Number(aggregate.dataValues.totalBalance * 
                aggregate.currency.currencyRateAgainstBase).toFixed(baseCurrency.currencyDecimalPlace)
            return {
                currency: aggregate.currencyCode,
                totalBalance: Number(aggregate.dataValues.totalBalance)
                    .toFixed(aggregate.currency.currencyDecimalPlace),
                formattedTotalBalance: AmountHelper.formatAmount(aggregate.dataValues.totalBalance, 
                    aggregate.currency.currencyDecimalPlace),
                totalCount: aggregate.dataValues.totalCount,
                equivalentBalance,
                formattedEquivalentBalance: AmountHelper.formatAmount(equivalentBalance, 
                    baseCurrency.currencyDecimalPlace),
                equivalentCurrency: baseCurrency.currencyCode
            }
        });

        let cardsAggregate = await CardRepo.getCardsTotalByCurrency();
        cardsAggregate = cardsAggregate.map( aggregate => {
            const equivalentBalance = Number(aggregate.dataValues.totalBalance * 
                aggregate.currency.currencyRateAgainstBase).toFixed(baseCurrency.currencyDecimalPlace)
            return {
                currency: aggregate.cardCurrency,
                totalBalance: Number(aggregate.dataValues.totalBalance)
                    .toFixed(aggregate.currency.currencyDecimalPlace),
                formattedTotalBalance: AmountHelper.formatAmount(aggregate.dataValues.totalBalance, 
                    aggregate.currency.currencyDecimalPlace),
                totalCount: aggregate.dataValues.totalCount,
                equivalentBalance,
                formattedEquivalentBalance: AmountHelper.formatAmount(equivalentBalance, 
                    baseCurrency.currencyDecimalPlace),
                equivalentCurrency: baseCurrency.currencyCode
            }
        });

        let debtorsAggregate = await DebtorRepo.getDebtorsTotalByCurrency();
        debtorsAggregate = debtorsAggregate.map( aggregate => {
            const equivalentBalance = Number(aggregate.dataValues.totalBalance * 
                aggregate.currency.currencyRateAgainstBase).toFixed(baseCurrency.currencyDecimalPlace)
            return {
                currency: aggregate.debtCurrency,
                totalBalance: Number(aggregate.dataValues.totalBalance)
                    .toFixed(aggregate.currency.currencyDecimalPlace),
                formattedTotalBalance: AmountHelper.formatAmount(aggregate.dataValues.totalBalance, 
                    aggregate.currency.currencyDecimalPlace),
                totalCount: aggregate.dataValues.totalCount,
                equivalentBalance,
                formattedEquivalentBalance: AmountHelper.formatAmount(equivalentBalance, 
                    baseCurrency.currencyDecimalPlace),
                equivalentCurrency: baseCurrency.currencyCode
            }
        });

        const accountsSum = accountsAggregate.reduce( 
            (acc, obj) => Number(acc)+Number(obj.equivalentBalance), 0);
        const depositsSum = depositsAggregate.reduce( 
            (dep, obj) => Number(dep)+Number(obj.equivalentBalance), 0);
        const cardsSum = cardsAggregate.reduce( 
            (card, obj) => Number(card)+Number(obj.equivalentBalance), 0);
        const debtorsSum = debtorsAggregate.reduce( 
            (debtor, obj) => Number(debtor)+Number(obj.equivalentBalance), 0);

        const profileSum = Number(accountsSum) + Number(depositsSum)
                         - Number(cardsSum) + Number(debtorsSum);

        return {
            profile: {
                sum: AmountHelper.formatAmount(profileSum, baseCurrency.currencyDecimalPlace),
                sumCurrency: baseCurrency.currencyCode
            },
            accounts: {
                aggregate: accountsAggregate,
                sum: AmountHelper.formatAmount(accountsSum, baseCurrency.currencyDecimalPlace),
                sumCurrency: baseCurrency.currencyCode
            },
            deposits: {
                aggregate: depositsAggregate,
                sum: AmountHelper.formatAmount(depositsSum, baseCurrency.currencyDecimalPlace),
                sumCurrency: baseCurrency.currencyCode
            },
            cards: {
                aggregate: cardsAggregate,
                sum: AmountHelper.formatAmount(cardsSum, baseCurrency.currencyDecimalPlace),
                sumCurrency: baseCurrency.currencyCode
            },
            debtors: {
                aggregate: debtorsAggregate,
                sum: AmountHelper.formatAmount(debtorsSum, baseCurrency.currencyDecimalPlace),
                sumCurrency: baseCurrency.currencyCode
            },
        }
    }

}

module.exports = HomeBusiness;