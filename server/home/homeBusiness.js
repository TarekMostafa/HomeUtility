const AccountRepo = require('../wealth/accounts/accountRepo');
const CurrencyRepo = require('../currencies/currencyRepo');
const AppParametersRepo = require('../appSettings/appParametersRepo');
const AppParametersConstants = require('../appSettings/appParametersConstants');
const DepositRepo = require('../wealth/deposits/depositRepo');
const CardRepo = require('../cards/cardRepo');
const DebtorRepo = require('../debtors/debtorRepo');
const Exception = require('../features/exception');
const AmountHelper = require('../helper/AmountHelper');

class HomeBusiness {

    async getTotals() {

        const baseCurrency = await AppParametersRepo.getAppParameterValue(
            AppParametersConstants.BASE_CURRENCY);
        if(!baseCurrency) throw new Exception('APP_PARAM_ERROR');
        
        const baseCurrencyObj = await CurrencyRepo.getCurrency(baseCurrency);
        if(!baseCurrencyObj) throw new Exception('CURR_INV_BASE');

        let accountsAggregate = await AccountRepo.getAccountsTotalByCurrency();
        accountsAggregate = accountsAggregate.map( aggregate => {
            const equivalentBalance = Number(aggregate.dataValues.totalBalance * 
                aggregate.currency.currencyRateAgainstBase).toFixed(baseCurrencyObj.currencyDecimalPlace)
            return {
                currency: aggregate.accountCurrency,
                totalBalance: Number(aggregate.dataValues.totalBalance)
                    .toFixed(aggregate.currency.currencyDecimalPlace),
                formattedTotalBalance: AmountHelper.formatAmount(aggregate.dataValues.totalBalance, 
                    aggregate.currency.currencyDecimalPlace),
                totalCount: aggregate.dataValues.totalCount,
                equivalentBalance,
                formattedEquivalentBalance: AmountHelper.formatAmount(equivalentBalance, 
                    baseCurrencyObj.currencyDecimalPlace),
                equivalentCurrency: baseCurrencyObj.currencyCode
            }
        });

        let depositsAggregate = await DepositRepo.getDepositsTotalByCurrency();
        depositsAggregate = depositsAggregate.map( aggregate => {
            const equivalentBalance = Number(aggregate.dataValues.totalBalance * 
                aggregate.currency.currencyRateAgainstBase).toFixed(baseCurrencyObj.currencyDecimalPlace)
            return {
                currency: aggregate.currencyCode,
                totalBalance: Number(aggregate.dataValues.totalBalance)
                    .toFixed(aggregate.currency.currencyDecimalPlace),
                formattedTotalBalance: AmountHelper.formatAmount(aggregate.dataValues.totalBalance, 
                    aggregate.currency.currencyDecimalPlace),
                totalCount: aggregate.dataValues.totalCount,
                equivalentBalance,
                formattedEquivalentBalance: AmountHelper.formatAmount(equivalentBalance, 
                    baseCurrencyObj.currencyDecimalPlace),
                equivalentCurrency: baseCurrencyObj.currencyCode
            }
        });

        let cardsAggregate = await CardRepo.getCardsTotalByCurrency();
        cardsAggregate = cardsAggregate.map( aggregate => {
            const equivalentBalance = Number(aggregate.dataValues.totalBalance * 
                aggregate.currency.currencyRateAgainstBase).toFixed(baseCurrencyObj.currencyDecimalPlace)
            return {
                currency: aggregate.cardCurrency,
                totalBalance: Number(aggregate.dataValues.totalBalance)
                    .toFixed(aggregate.currency.currencyDecimalPlace),
                formattedTotalBalance: AmountHelper.formatAmount(aggregate.dataValues.totalBalance, 
                    aggregate.currency.currencyDecimalPlace),
                totalCount: aggregate.dataValues.totalCount,
                equivalentBalance,
                formattedEquivalentBalance: AmountHelper.formatAmount(equivalentBalance, 
                    baseCurrencyObj.currencyDecimalPlace),
                equivalentCurrency: baseCurrencyObj.currencyCode
            }
        });

        let debtorsAggregate = await DebtorRepo.getDebtorsTotalByCurrency();
        debtorsAggregate = debtorsAggregate.map( aggregate => {
            const equivalentBalance = Number(aggregate.dataValues.totalBalance * 
                aggregate.currency.currencyRateAgainstBase).toFixed(baseCurrencyObj.currencyDecimalPlace)
            return {
                currency: aggregate.debtCurrency,
                totalBalance: Number(aggregate.dataValues.totalBalance)
                    .toFixed(aggregate.currency.currencyDecimalPlace),
                formattedTotalBalance: AmountHelper.formatAmount(aggregate.dataValues.totalBalance, 
                    aggregate.currency.currencyDecimalPlace),
                totalCount: aggregate.dataValues.totalCount,
                equivalentBalance,
                formattedEquivalentBalance: AmountHelper.formatAmount(equivalentBalance, 
                    baseCurrencyObj.currencyDecimalPlace),
                equivalentCurrency: baseCurrencyObj.currencyCode
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
                sum: AmountHelper.formatAmount(profileSum, baseCurrencyObj.currencyDecimalPlace),
                sumCurrency: baseCurrencyObj.currencyCode
            },
            accounts: {
                aggregate: accountsAggregate,
                sum: AmountHelper.formatAmount(accountsSum, baseCurrencyObj.currencyDecimalPlace),
                sumCurrency: baseCurrencyObj.currencyCode
            },
            deposits: {
                aggregate: depositsAggregate,
                sum: AmountHelper.formatAmount(depositsSum, baseCurrencyObj.currencyDecimalPlace),
                sumCurrency: baseCurrencyObj.currencyCode
            },
            cards: {
                aggregate: cardsAggregate,
                sum: AmountHelper.formatAmount(cardsSum, baseCurrencyObj.currencyDecimalPlace),
                sumCurrency: baseCurrencyObj.currencyCode
            },
            debtors: {
                aggregate: debtorsAggregate,
                sum: AmountHelper.formatAmount(debtorsSum, baseCurrencyObj.currencyDecimalPlace),
                sumCurrency: baseCurrencyObj.currencyCode
            },
        }
    }

}

module.exports = HomeBusiness;