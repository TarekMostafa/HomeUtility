const InstallmentDetailRepo = require('./installmentDetailRepo');
const InstallmentRepo = require('./installmentRepo');
const Exception = require('../features/exception');
const AmountHelper = require('../helper/AmountHelper');
const sequelize = require('../db/dbConnection').getSequelize();

class installmentDetailBusiness {

    async getInstallmentDetails({instId}) {
        let installmentDetails = await InstallmentDetailRepo.getInstallmentDetails(instId);
        installmentDetails =  installmentDetails.map( instDet => {
            return this.getInstallmentDetailObject(instDet);
        });
        return installmentDetails;
    }

    async getInstallmentDetail(id) {
        let installmentDetail = await InstallmentDetailRepo.getInstallmentDetail(id);
        installmentDetail = this.getInstallmentDetailObject(installmentDetail);
        return installmentDetail;
    }

    getInstallmentDetailObject({instDetId, instId, instDetDate, instDetAmount, instDetCurrency,
        instDetStatus, instDetCheckNumber, instDetPaidDate, instDetNotes, currency
    }) {
        return {
            instDetId,
            instId,
            instDetDate,
            instDetAmount,
            instDetAmountFormatted: AmountHelper.formatAmount(instDetAmount, currency.currencyDecimalPlace),
            instDetCurrency,
            instDetStatus,
            instDetCheckNumber,
            instDetPaidDate,
            instDetNotes,
            decimalPlaces: currency.currencyDecimalPlace,
        };
    }

    async addInstallmentDetail({instId, instDetDate, instDetAmount, instDetStatus, instDetCheckNumber,
        instDetPaidDate, instDetNotes}) {

        let installment = await InstallmentRepo.getInstallment(instId);
        if(!installment) throw new Exception('INST_NOT_EXIST');

        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            await InstallmentDetailRepo.addInstallmentDetail({
                instId,
                instDetDate,
                instDetAmount,
                instDetCurrency: installment.instCurrency,
                instDetStatus,
                instDetCheckNumber,
                instDetPaidDate: (instDetPaidDate?instDetPaidDate:null),
                instDetNotes
            }, dbTransaction);
            await InstallmentRepo.updateEnteredAmount(installment, instDetAmount, dbTransaction);
            if(instDetStatus==="PAID")
                await InstallmentRepo.updatePaidAmount(installment, instDetAmount, dbTransaction);
            await dbTransaction.commit();
        } catch (err) {
            await dbTransaction.rollback();
            throw new Exception('INST_DET_ADD_FAIL');
        }
    }

    async updateInstallmentDetail(id , {instDetDate, instDetAmount, instDetStatus, instDetCheckNumber, 
        instDetPaidDate, instDetNotes}) {
        let installmentDetail = await InstallmentDetailRepo.getInstallmentDetail(id);
        if(!installmentDetail) throw new Exception('INST_DET_NOT_EXIST'); 

        let installment = await InstallmentRepo.getInstallment(installmentDetail.instId);
        if(!installment) throw new Exception('INST_NOT_EXIST');

        let dbTransaction;
        try {
            dbTransaction = await sequelize.transaction();
            const prvInstDetAmount = installmentDetail.instDetAmount;
            const prvInstDetStatus = installmentDetail.instDetStatus
            installmentDetail.instDetDate = instDetDate;
            installmentDetail.instDetAmount = instDetAmount;
            installmentDetail.instDetStatus = instDetStatus;
            installmentDetail.instDetCheckNumber = instDetCheckNumber;
            installmentDetail.instDetPaidDate = instDetPaidDate;
            installmentDetail.instDetNotes = instDetNotes;
            await installmentDetail.save({transaction: dbTransaction});
            await InstallmentRepo.updateEnteredAmount(installment, 
                (prvInstDetAmount * -1) + Number(instDetAmount), dbTransaction);
            if (prvInstDetStatus === 'PAID')  {
                await InstallmentRepo.updatePaidAmount(installment, 
                    prvInstDetAmount * -1, dbTransaction);
            }
            if (instDetStatus === 'PAID') {
                await InstallmentRepo.updatePaidAmount(installment, 
                    Number(instDetAmount), dbTransaction);
            }
            await dbTransaction.commit();
        } catch (err) {
            await dbTransaction.rollback();
            throw new Exception('INST_DET_UPDATE_FAIL');
        }
    }

    async deleteInstallmentDetail(id) {
        let installmentDetail = await InstallmentDetailRepo.getInstallmentDetail(id);
        if(!installmentDetail) throw new Exception('INST_DET_NOT_EXIST'); 

        let installment = await InstallmentRepo.getInstallment(installmentDetail.instId);
        if(!installment) throw new Exception('INST_NOT_EXIST');

        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            await InstallmentRepo.updateEnteredAmount(installment, 
                installmentDetail.instDetAmount * -1, dbTransaction);
            if (installmentDetail.instDetStatus === 'PAID')  {
                await InstallmentRepo.updatePaidAmount(installment, 
                    installmentDetail.instDetAmount * -1, dbTransaction);
            }
            await installmentDetail.destroy({transaction: dbTransaction});
            await dbTransaction.commit();
        } catch (err) {
            await dbTransaction.rollback();
            throw new Exception('INST_DET_DELETE_FAIL');
        }
    }
}

module.exports = installmentDetailBusiness;