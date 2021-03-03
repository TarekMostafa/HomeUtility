class AddBankRequest {
    constructor({bankCode, bankName}){
        this.bankCode = bankCode;
        this.bankName = bankName;
    }
}

module.exports = AddBankRequest;