const AccountRepo = require('../wealth/accounts/accountRepo');
const CurrencyRepo = require('../currencies/currencyRepo');
const AppParametersRepo = require('../appSettings/appParametersRepo');
const AppParametersConstants = require('../appSettings/appParametersConstants');
const DepositRepo = require('../wealth/deposits/depositRepo');
const CardRepo = require('../cards/cardRepo');
const DebtorRepo = require('../debtors/debtorRepo');

class HomeBusiness {


    formatAmount(amount, digit) {
        return new Intl.NumberFormat("en-GB", {
            minimumFractionDigits: digit,
            maximumFractionDigits: digit
        }).format(amount)
    }

    async getTotals() {

        const baseCurrency = await AppParametersRepo.getAppParameterValue(
            AppParametersConstants.BASE_CURRENCY
        );
        const baseCurrencyObj = await CurrencyRepo.getCurrency(baseCurrency);

        let accountsAggregate = await AccountRepo.getAccountsTotalByCurrency();
        accountsAggregate = accountsAggregate.map( aggregate => {
            const equivalentBalance = Number(aggregate.dataValues.totalBalance * 
                aggregate.currency.currencyRateAgainstBase).toFixed(baseCurrencyObj.currencyDecimalPlace)
            return {
                currency: aggregate.accountCurrency,
                totalBalance: Number(aggregate.dataValues.totalBalance)
                    .toFixed(aggregate.currency.currencyDecimalPlace),
                formattedTotalBalance: this.formatAmount(aggregate.dataValues.totalBalance, 
                    aggregate.currency.currencyDecimalPlace),
                totalCount: aggregate.dataValues.totalCount,
                equivalentBalance,
                formattedEquivalentBalance: this.formatAmount(equivalentBalance, 
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
                formattedTotalBalance: this.formatAmount(aggregate.dataValues.totalBalance, 
                    aggregate.currency.currencyDecimalPlace),
                totalCount: aggregate.dataValues.totalCount,
                equivalentBalance,
                formattedEquivalentBalance: this.formatAmount(equivalentBalance, 
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
                formattedTotalBalance: this.formatAmount(aggregate.dataValues.totalBalance, 
                    aggregate.currency.currencyDecimalPlace),
                totalCount: aggregate.dataValues.totalCount,
                equivalentBalance,
                formattedEquivalentBalance: this.formatAmount(equivalentBalance, 
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
                formattedTotalBalance: this.formatAmount(aggregate.dataValues.totalBalance, 
                    aggregate.currency.currencyDecimalPlace),
                totalCount: aggregate.dataValues.totalCount,
                equivalentBalance,
                formattedEquivalentBalance: this.formatAmount(equivalentBalance, 
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

        const profileSum = Number(accountsSum)+Number(depositsSum)
                         - Number(cardsSum) + Number(debtorsSum);

        return {
            profile: {
                sum: this.formatAmount(profileSum, baseCurrencyObj.currencyDecimalPlace),
                sumCurrency: baseCurrencyObj.currencyCode
            },
            accounts: {
                aggregate: accountsAggregate,
                sum: this.formatAmount(accountsSum, baseCurrencyObj.currencyDecimalPlace),
                sumCurrency: baseCurrencyObj.currencyCode
            },
            deposits: {
                aggregate: depositsAggregate,
                sum: this.formatAmount(depositsSum, baseCurrencyObj.currencyDecimalPlace),
                sumCurrency: baseCurrencyObj.currencyCode
            },
            cards: {
                aggregate: cardsAggregate,
                sum: this.formatAmount(cardsSum, baseCurrencyObj.currencyDecimalPlace),
                sumCurrency: baseCurrencyObj.currencyCode
            },
            debtors: {
                aggregate: debtorsAggregate,
                sum: this.formatAmount(debtorsSum, baseCurrencyObj.currencyDecimalPlace),
                sumCurrency: baseCurrencyObj.currencyCode
            },
        }
    }

}

module.exports = HomeBusiness;