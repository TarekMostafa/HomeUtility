const InstallmentRepo = require('./installmentRepo');
const Exception = require('../features/exception');
const AmountHelper = require('../helper/AmountHelper');

class installmentBusiness {

    async getInstallments({currency}) {
        let installments = await InstallmentRepo.getInstallments(currency);
        installments = installments.map( inst => {
            return this.getInstallmentObject(inst);
        });
        return installments;
    }

    async getInstallment(id) {
        let installment = await InstallmentRepo.getInstallment(id);
        installment = this.getInstallmentObject(installment);
        return installment;
    }

    getInstallmentObject({instId, instName, instCurrency, instStartDate, instEndDate,
        instAmount, instStatus, instEnteredAmount, instPaidAmount, instLastPaidUpdate, 
        instNotes, currency
    }) {
        return {
            instId,
            instName,
            instCurrency,
            instStartDate,
            instEndDate,
            instAmount,
            instAmountFormatted: AmountHelper.formatAmount(instAmount, currency.currencyDecimalPlace),
            instStatus,
            instEnteredAmount,
            instEnteredAmountFormatted: AmountHelper.formatAmount(instEnteredAmount, currency.currencyDecimalPlace),
            instPaidAmount,
            instPaidAmountFormatted: AmountHelper.formatAmount(instPaidAmount, currency.currencyDecimalPlace),
            instRemAmount: instEnteredAmount - instPaidAmount,
            instRemAmountFormatted: AmountHelper.formatAmount((instEnteredAmount - instPaidAmount), currency.currencyDecimalPlace),
            instLastPaidUpdate,
            instNotes,
            decimalPlaces: currency.currencyDecimalPlace,
        };
    }

    async addInstallment({instName, instCurrency, instStartDate, instEndDate,
        instAmount, instNotes}) {
        return await InstallmentRepo.addInstallment({
            instName,
            instCurrency,
            instStartDate,
            instEndDate,
            instAmount,
            instStatus: 'ACTIVE',
            instEnteredAmount: 0,
            instPaidAmount: 0,
            instNotes,
        });
    }

    async updateInstallment(id , {instName, instCurrency, instStartDate, instEndDate, 
        instAmount, instStatus, instNotes}) {
        let installment = await InstallmentRepo.getInstallment(id);
        if(!installment) throw new Exception('INST_NOT_EXIST'); 

        installment.instName = instName;
        installment.instCurrency = instCurrency;
        installment.instStartDate = instStartDate;
        installment.instEndDate = instEndDate;
        installment.instAmount = instAmount;
        installment.instStatus = instStatus;
        installment.instNotes = instNotes;
        await installment.save();
    }

    async deleteInstallment(id) {
        let installment = await InstallmentRepo.getInstallment(id);
        if(!installment) throw new Exception('INST_NOT_EXIST'); 

        if(installment.instEnteredAmount != 0)
            throw new Exception('INST_DELETE_FAIL');

        await installment.destroy();
    }
}

module.exports = installmentBusiness;