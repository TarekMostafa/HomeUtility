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
        const now = new Date();
        //Generate Transactions Label Data
        let labelField = `transactionLabel${labelNumber}`;
        await sequelize.query(
            `INSERT INTO labels (labelNumber, labelText, labelCurrency,
            labelCRCount, labelDRCount, labelCRSum, labelDRSum, 
            labelLastUpdate)
            SELECT :labelNumber, ${labelField}, :labelCurrency,
            count(case when transactionCRDR = 'Credit' then 1 else null end),
            count(case when transactionCRDR = 'Debit' then 1 else null end), 
            sum(case when transactionCRDR = 'Credit' then transactionAmount else 0 end),
            sum(case when transactionCRDR = 'Debit' then transactionAmount else 0 end),
            :labelLastUpdate 
            FROM transactions JOIN accounts
            ON transactionAccount = accountId
            WHERE accountCurrency = :labelCurrency AND
            ${labelField} is not null AND ${labelField} != ''
            GROUP BY ${labelField}
            ON DUPLICATE KEY UPDATE 
            labelCRCount = VALUES(labelCRCount),
            labelDRCount = VALUES(labelDRCount),
            labelCRSum = VALUES(labelCRSum),
            labelDRSum = VALUES(labelDRSum),
            labelLastUpdate = :labelLastUpdate`,
            {
                replacements: {
                    labelNumber: labelNumber,
                    labelCurrency: labelCurrency,
                    labelLastUpdate: now,
                },
                type: QueryTypes.INSERT
            }
        );

        //Initializing unupdated fields generated from transacitons
        await sequelize.query(
            `UPDATE labels
            SET labelCRCount = 0,
            labelDRCount = 0,
            labelCRSum = 0,
            labelDRSum = 0
            WHERE labelNumber=:labelNumber
            AND labelCurrency=:labelCurrency
            AND (labelLastUpdate < :labelLastUpdate
            or labelLastUpdate is null)`,
            {
                replacements: {
                    labelNumber: labelNumber,
                    labelCurrency: labelCurrency,
                    labelLastUpdate: now,
                },
                type: QueryTypes.UPDATE
            }
        );

        //Generate Expenses Label Data
        labelField = `expenseLabel${labelNumber}`;
        await sequelize.query(
            `INSERT INTO labels (labelNumber, labelText, labelCurrency,
            labelCRCount, labelDRCount, labelCRSum, labelDRSum, 
            labelLastUpdate)
            SELECT :labelNumber, ${labelField}, :labelCurrency,
            count(case when expenseAmount < 0 then 1 else null end),
            count(case when expenseAmount >= 0 then 1 else null end),
            sum(case when expenseAmount < 0 then expenseAmount else 0 end),
            sum(case when expenseAmount >= 0 then expenseAmount else 0 end),
            :labelLastUpdate 
            FROM expensesdetails
            WHERE expenseCurrency = :labelCurrency AND
            ${labelField} is not null AND ${labelField} != ''
            GROUP BY ${labelField}
            ON DUPLICATE KEY UPDATE 
            labelCRCount = labelCRCount + VALUES(labelCRCount),
            labelDRCount = labelDRCount + VALUES(labelDRCount),
            labelCRSum = labelCRSum + VALUES(labelCRSum),
            labelDRSum = labelDRSum + VALUES(labelDRSum),
            labelLastUpdate = :labelLastUpdate`,
            {
                replacements: {
                    labelNumber: labelNumber,
                    labelCurrency: labelCurrency,
                    labelLastUpdate: now,
                },
                type: QueryTypes.INSERT
            }
        );

        //Deleting unupdated fields generated from transacitons & expenses
        await sequelize.query(
            `DELETE FROM labels
            WHERE labelNumber=:labelNumber
            AND labelCurrency=:labelCurrency
            AND (labelLastUpdate < :labelLastUpdate
            or labelLastUpdate is null)`,
            {
                replacements: {
                    labelNumber: labelNumber,
                    labelCurrency: labelCurrency,
                    labelLastUpdate: now,
                },
                type: QueryTypes.DELETE
            }
        );
    }
}

module.exports = LabelRepo;