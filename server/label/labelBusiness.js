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

    async getLabelsByDates({label, labelValues, currency, 
        dateFrom, dateTo, mode}) {
        //Check Currency
        const currencyObj = await CurrencyRepo.getCurrency(currency);
        if(!currencyObj) throw new Exception('CURR_NOT_EXIST', currency);
        // Check Date from and Date To
        const _dateFrom = Common.getDate(dateFrom, '');
        const _dateTo = Common.getDate(dateTo, '');
        if( _dateFrom === '' || _dateTo === '') {
            throw new Exception('POST_DATE_INVALID');
        }

        let detailsList = [];
        const dateRanges = this.getDateRanges(_dateFrom, _dateTo, mode);
        for(let i=0; i<dateRanges.length; i++) {
            let {labelTotal, details} = await this.getDetails(label, 
                labelValues, currency, 
            dateRanges[i].dateFrom, dateRanges[i].dateTo, 
            currencyObj.currencyDecimalPlace);
            
            detailsList.push({
                dateFrom: dateRanges[i].dateFrom,
                dateTo: dateRanges[i].dateTo,
                details,
                labelTotal,
                labelTotalFormatted: AmountHelper.formatAmount(labelTotal,
                currencyObj.currencyDecimalPlace)
            })
        }

        return {
            label,
            currency,
            detailsList
        }
    }

    async getDetails(label, labelValues, currency, dateFrom, dateTo,
        currencyDecimalPlace
    ) {
        // Construct Where Condition
        let whereQuery = {};
        whereQuery.transactionPostingDate = { [Op.between] : [dateFrom, dateTo] };
        if(labelValues) {
            whereQuery[`transactionLabel${label}`] = {
                [Op.in] : labelValues
            }
        } else {
            whereQuery[`transactionLabel${label}`] = {
                [Op.ne]: null
            }
        }
        let trans_details = await TransactionRepo.getTotalTransactionsGroupByLabel(label, currency, whereQuery);
        whereQuery = {};
        whereQuery.expenseDate = { [Op.between] : [dateFrom, dateTo] };
        if(labelValues) {
            whereQuery[`expenseLabel${label}`] = {
                [Op.in] : labelValues
            }
        } else {
            whereQuery[`expenseLabel${label}`] = {
                [Op.ne]: null
            } 
        }
        let exp_details = await ExpenseDetailRepo.getTotalExpensesGroupByLabel(label, currency, whereQuery);

        let labelTotal = 0;
        let details = trans_details.map(detail => {
            labelTotal += Number(detail.total);
            return {
                total: detail.total,
                totalFormatted: AmountHelper.formatAmount(detail.total, 
                 currencyDecimalPlace),
                label: detail.label,
            }
        });

        exp_details.forEach( detail => {
            labelTotal += Number(detail.total);
            const prvDetail = details.find(d=>d.label === detail.label);
            if(prvDetail) {
                prvDetail.total = Number(prvDetail.total) + Number(detail.total);
                prvDetail.totalFormatted = AmountHelper.formatAmount(prvDetail.total, 
                 currencyDecimalPlace);
            } else {
                details.push({
                    total: detail.total,
                    totalFormatted: AmountHelper.formatAmount(detail.total, 
                        currencyDecimalPlace),
                    label: detail.label,
                })
            }
        });

        return {
            labelTotal,
            details
        }
    }

    getDateRanges(dateFrom, dateTo, mode) {
        let dateRanges = [];

        if(!mode || mode===' ') {
            dateRanges.push({
                dateFrom, dateTo
            })
            return dateRanges;
        } 
        
        let from = null;
        let to = null;
        if(mode==='M') {
            do {
                if(from) {
                    from.setUTCMonth(from.getMonth()+1);
                    from.setUTCDate(1);
                } else {
                    from = new Date(dateFrom);
                    from.setUTCHours(0, 0, 0, 0);
                }

                to = new Date(dateFrom);
                to.setUTCFullYear(from.getFullYear());
                to.setUTCMonth(from.getMonth()+1);
                to.setUTCDate(0);
                to.setUTCHours(0, 0, 0, 0);

                if(to > new Date(dateTo)) to = new Date(dateTo);

                dateRanges.push({
                    dateFrom: Common.getDate(from.toISOString(), ''), 
                    dateTo: Common.getDate(to.toISOString(), '')
                });
            } while(to < new Date(dateTo))
        } else if(mode==='Y') {
            do {
                if(from) {
                    from.setUTCFullYear(from.getFullYear()+1);
                    from.setUTCMonth(0);
                    from.setUTCDate(1);
                } else {
                    from = new Date(dateFrom);
                    from.setUTCHours(0, 0, 0, 0);
                }

                to = new Date(dateFrom);
                to.setUTCFullYear(from.getFullYear());
                to.setUTCMonth(12);
                to.setUTCDate(0);
                to.setUTCHours(0, 0, 0, 0);

                if(to > new Date(dateTo)) to = new Date(dateTo);

                dateRanges.push({
                    dateFrom: Common.getDate(from.toISOString(), ''), 
                    dateTo: Common.getDate(to.toISOString(), '')
                });
            } while(to < new Date(dateTo))
        }
        return dateRanges;
    }
}

module.exports = Label;