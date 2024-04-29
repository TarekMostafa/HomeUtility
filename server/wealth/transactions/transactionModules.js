const Modules = {
    DEPOSIT: {  
        Code: 'DEP',
        IsEditable: false,
        IsDeletable: false,
    },
    CREDIT_CARD: {
        Code: 'CRD',
        IsEditable: false,
        IsDeletable: false,
    },
    DEBT: {
        Code: 'DBT',
        IsEditable: true,
        IsDeletable: true,
    },
    FX: {
        Code: 'FX',
        IsEditable: false,
        IsDeletable: false,
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