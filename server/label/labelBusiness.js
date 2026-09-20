const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const LabelRepo = require('./labelRepo');
const Exception = require('../features/exception');
const AmountHelper = require('../helper/AmountHelper');

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
}

module.exports = Label;