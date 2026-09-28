const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const LabelRepo = require('./labelRepo');
const Exception = require('../features/exception');
const AmountHelper = require('../helper/AmountHelper');
const TransactionRepo = require('../wealth/transactions/transactionRepo');
const CurrencyRepo = require('../currencies/currencyRepo');
const ExpenseDetailRepo = require('../expenses/expenseDetail/expenseDetailRepo');
const Common = require('../utilities/common');

const Op = Sequelize.Op;

class Label {
    async getLabels({labelNumber, labelCurrency, isGenerate}) {
        if(isGenerate) {
            try{
                await LabelRepo.generateLabelData(labelNumber, labelCurrency);
            } catch (err) {
                console.log(`error while generating label data ${err}`);
                throw new Exception('LABEL_GEN_FAIL');
            }
        }
        // Construct Where Condition
        let whereQuery = {};
        whereQuery.labelNumber = labelNumber;
        whereQuery.labelCurrency = labelCurrency;

        let labels = await LabelRepo.getLabels(whereQuery);
        labels = labels.map( label => {
            return {
                labelId: label.labelId,
                labelNumber: label.labelNumber,
                labelCurrency: label.labelCurrency,
                labelText: label.labelText,
                labelCRCount: label.labelCRCount,
                labelDRCount: label.labelDRCount,
                labelCRSum: label.labelCRSum,
                labelDRSum: label.labelDRSum,
                labelCRSumFormatted: AmountHelper.formatAmount(label.labelCRSum,
                    label.currency.currencyDecimalPlace),
                labelDRSumFormatted: AmountHelper.formatAmount(label.labelDRSum,
                    label.currency.currencyDecimalPlace),
                labelSumTotalFormatted: AmountHelper.formatAmount(
                    label.labelCRSum - label.labelDRSum,
                    label.currency.currencyDecimalPlace),
                labelLastUpdate: label.labelLastUpdate
            }
        });

        return labels;
    }

    async getLabelsByDates({label, currency, dateFrom, dateTo}) {
        //Check Currency
        const currencyObj = await CurrencyRepo.getCurrency(currency);
        if(!currencyObj) throw new Exception('CURR_NOT_EXIST', currency);
        // Check Date from and Date To
        const _dateFrom = Common.getDate(dateFrom, '');
        const _dateTo = Common.getDate(dateTo, '');
        if( _dateFrom === '' || _dateTo === '') {
            throw new Exception('POST_DATE_INVALID');
        }

        // Construct Where Condition
        let whereQuery = {};
        whereQuery.transactionPostingDate = { [Op.between] : [_dateFrom, _dateTo] };
        let trans_details = await TransactionRepo.getTotalTransactionsGroupByLabel(label, currency, whereQuery);
        whereQuery = {};
        whereQuery.expenseDate = { [Op.between] : [_dateFrom, _dateTo] };
        let exp_details = await ExpenseDetailRepo.getTotalExpensesGroupByLabel(label, currency, whereQuery);

        let labelTotal = 0;
        let details = trans_details.map(detail => {
            labelTotal += Number(detail.total);
            return {
                total: detail.total,
                totalFormatted: AmountHelper.formatAmount(detail.total, 
                 currencyObj.currencyDecimalPlace),
                label: detail.label,
            }
        });

        exp_details.forEach( detail => {
            labelTotal += Number(detail.total);
            const prvDetail = details.find(d=>d.label === detail.label);
            if(prvDetail) {
                prvDetail.total = Number(prvDetail.total) + Number(detail.total);
                prvDetail.totalFormatted = AmountHelper.formatAmount(prvDetail.total, 
                 currencyObj.currencyDecimalPlace);
            } else {
                details.push({
                    total: detail.total,
                    totalFormatted: AmountHelper.formatAmount(detail.total, 
                        currencyObj.currencyDecimalPlace),
                    label: detail.label,
                })
            }
        });

        return {
            label,
            currency,
            dateFrom: _dateFrom,
            dateTo: _dateTo,
            details,
            labelTotal,
            labelTotalFormatted: AmountHelper.formatAmount(labelTotal,
                currencyObj.currencyDecimalPlace)
        }
    }
}

module.exports = Label;