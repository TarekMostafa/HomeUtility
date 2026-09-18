const LabelModel = require('./labelModel');
const CurrencyModel = require('../currencies/currencyModel');
const sequelize = require('../db/dbConnection').getSequelize();
const { QueryTypes } = require('sequelize');

class LabelRepo {
    static async getLabels(whereQuery) {
        return await LabelModel.findAll({
            include: [
            {model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace']}
            ],
            where: whereQuery
        });
    }

    static async generateLabelData(labelNumber, labelCurrency) {
        const labelField = `transactionLabel${labelNumber}`;
        await sequelize.query(
            `INSERT INTO labels (labelNumber, labelText, labelCurrency,
            labelCRCount, labelDRCount, labelCRSum, labelDRSum)
            SELECT :labelNumber, ${labelField}, :labelCurrency,
            count(case when transactionCRDR = 'Credit' then 1 else null end),
            count(case when transactionCRDR = 'Debit' then 1 else null end), 
            sum(case when transactionCRDR = 'Credit' then transactionAmount else 0 end),
            sum(case when transactionCRDR = 'Debit' then transactionAmount else 0 end) 
            FROM transactions JOIN accounts
            ON transactionAccount = accountId
            WHERE accountCurrency = :labelCurrency AND
            ${labelField} is not null AND ${labelField} != ''
            GROUP BY ${labelField}
            ON DUPLICATE KEY UPDATE 
            labelCRCount = VALUES(labelCRCount),
            labelDRCount = VALUES(labelDRCount),
            labelCRSum = VALUES(labelCRSum),
            labelDRSum = VALUES(labelDRSum)`,
            {
                replacements: {
                    labelNumber: labelNumber,
                    labelCurrency: labelCurrency,
                },
                type: QueryTypes.INSERT
            }
        );
    }
}

module.exports = LabelRepo;