class AddBankRequest {
    constructor({bankCode, bankName}){
        this.bankCode = bankCode;
        this.bankName = bankName;
        this.bankStatus = 'INACTIVE';
    }
}

module.exports = AddBankRequest;