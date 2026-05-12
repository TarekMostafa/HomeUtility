const Modules = {
    DEPOSIT: {  
        Code: 'DEP',
        IsEditable: false,
        IsDeletable: false,
        IsAddToBillTrans: false,
        IsTransactionLabel: false,
    },
    CREDIT_CARD: {
        Code: 'CRD',
        IsEditable: false,
        IsDeletable: false,
        IsAddToBillTrans: true,
        IsTransactionLabel: true,
    },
    DEBT: {
        Code: 'DBT',
        IsEditable: true,
        IsDeletable: true,
        IsAddToBillTrans: false,
        IsTransactionLabel: false,
    },
    FX: {
        Code: 'FX',
        IsEditable: true,
        IsDeletable: true,
        IsAddToBillTrans: false,
        IsTransactionLabel: false,
    }
}

let moduleArray = [];
Object.entries(Modules).map( module => {
    moduleArray.push(module[1]);
})

const getModule = (moduleCode) => {
    let module = moduleArray.find( module => {
        return module.Code === moduleCode
    });
    return module? module : null;
}

module.exports = {
    Modules, getModule
}