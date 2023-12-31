module.exports = {
  '001' : 'An error occurred while retrieving application settings',
  'APP_PARAM_ERROR': 'An error occurred while retrieving application parameters',
  '002' : 'Application settings have been successfully updated',
  'APP_PARAM_UPDATE' : 'Application parameter has been successfully updated',
  '003' : 'Invalid User Name or Password',
  '004' : 'User (?) is inactive',
  'CURR_EXIST' : 'This currency code already exists in the database',
  'CURR_ADD_SUCCESS' : 'This currency has been successfully saved',
  'CURR_NOT_EXIST' : 'This currency (?) does not exist in the database',
  'CURR_ACT_SUCCESS' : 'This currency has been successfully activated',
  'CURR_DEACT_BASE' : 'We can not deactivate the base currency (?)',
  'CURR_DEACT_SUCCESS' : 'This currency has been successfully deactivated',
  'CURR_INV_BASE' : 'Invalid base currency in the application settings',
  'CURR_UPDATE_SUCCESS': 'This currency has been successfully updated',
  'CURR_INV_MANUAL_RATE': 'Invalid manual rate, it should be 1 as it is the base currency',
  'RATES_UPDATE_SUCCESS': 'Rates have been successfully updated',
  'BANK_EXIST' : 'This bank code already exists in the database',
  'BANK_ADD_SUCCESS' : 'This bank has been successfully saved',
  'BANK_NOT_EXIST' : 'This bank code does not exist in the database',
  '015' : 'This bank has been successfully updated',
  '016' : 'This bank has been successfully deleted',
  '017' : 'This transaction type has been successfully saved',
  'TRNS_TYP_NOT_EXIST' : 'This transaction type does not exist in the database',
  'TRNS_TYP_CRDB_ERR' : 'You can not update the Credit/Debit field as this transaction type is used in ? transaction(s)',
  'TRNS_TYP_CR_EXP_ERR': 'this transaction type is credit and can not be used in expense module',
  'TRNS_TYP_DELETE_ERR': 'You can not delete this transaction type as it is used in ? transaction(s)',
  'TRNS_TYP_INVALID': 'Invalid transaction type',
  '020' : 'This transaction type has been successfully updated',
  '021' : 'This transaction type has been successfully deleted',
  'CURR_INVALID' : 'Invalid Currency Code',
  '024' : 'User password has been successfully changed',
  'ACC_ADD_SUCCESS' : 'This account has been successfully created',
  'ACC_NOT_EXIST' : 'This account does not exist in the database',
  'ACC_UPDATE_SUCCESS' : 'This account has been successfully updated',
  'ACC_DELETE_SUCCESS' : 'This account has been successfully deleted',
  'ACC_NOT_CLOSE' : 'Account can not be closed because it has credit',
  'TRANS_ADD_SUCCESS' : 'This transaction has been successfully added',
  'TRANS_ADD_FAIL' : 'Failed to add this transaction',
  'ACC_INVALID' : 'Invalid account',
  'TRANS_TYPE_INVALID' : 'Invalid transaction type',
  'TRANS_NOT_EXIST' : 'This transaction does not exist in the database',
  'TRANS_UPDATE_SUCCESS' : 'This transaction has been successfully updated',
  'TRANS_UPDATE_FAIL' : 'Failed to update this transaction',
  'TRANS_DELETE_SUCCESS' : 'This transaction has been successfully deleted',
  'TRANS_DELETE_FAIL' : 'Failed to delete this transaction',
  //'039' : 'Invalid base currency in the application settings',
  'TRANS_ACC1_NOT_EQUAL_ACC2' : 'Account From must not be equal to Account To',
  'TRANS_CCY1_EQUAL_CCY2' : 'Account From currency must be equal to Account To Currency',
  'TRANS_DBT_ADD_FAIL': 'Failed to add this debt transaction',
  'TRANS_DBT_ADD_SUCCESS': 'This debt transaction has been successfully created',
  'TRANS_DBT_UPDATE_FAIL': 'Failed to update this debt transaction',
  'TRANS_DBT_UPDATE_SUCCESS': 'This debt transaction has been successfully updated',
  'TRANS_DBT_DELETE_FAIL': 'Failed to delete this debt transaction',
  'TRANS_DBT_DELETE_SUCCESS': 'This debt transaction has been successfully deleted',
  '042' : 'User name has been successfully changed',
  'POST_DATE_INVALID' : 'Posting Date from and Posting Date to must be correct dates',
  'REPORT_ID_INVALID' : 'Invalid Report Id',
  '045' : 'User logged out successfully',
  '046' : 'Database has been backuped successfully',
  'DEP_ADD_SUCCESS' : 'This deposit has been successfully created',
  'DEP_ADD_FAIL' : 'Failed to create this deposit',
  'DEP_NOT_EXIST' : 'This deposit does not exist in the database',
  'DEP_DELETE_SUCCESS' : 'This deposit has been successfully deleted',
  'DEP_DELETE_FAIL' : 'Failed to delete this deposit',
  'DEP_REL_TRANS_ERR' : 'This deposit can not be deleted as it has related transactions',
  'DEP_INT_ADD_FAIL' : 'Failed to add interest',
  'DEP_INT_ADD_SUCCESS' : 'This deposit interest has been successfully posted',
  'DEP_REL_FAIL' : 'Failed to release deposit',
  'DEP_REL_SUCCESS' : 'This deposit interest has been successfully released',
  '057' : 'This bill has been successfully created',
  '058' : 'This bill does not exist in the database',
  '059' : 'This bill has been successfully updated',
  '060' : 'This bill has been successfully deleted',
  '061' : 'Failed to create this bill',
  '062' : 'Failed to update this bill',
  '063' : 'This bill transaction has been successfully added',
  '064' : 'Failed to add this bill transaction',
  '065' : 'This bill transaction does not exist in the database',
  '066' : 'This bill transaction has been successfully updated',
  '067' : 'Failed to update this bill transaction',
  '068' : 'This bill transaction has been successfully deleted',
  '069' : 'This bill transaction exceed bill frequency (?)',
  '070' : 'This tranasction bill date is less than the bill start date (?)',
  '071' : 'Invalid bill transaction Details, you must enter at least one detail',
  'ACC_INVALID': 'Invalid account',
  'EXP_TYP_ADD_SUCCESS': 'This expense type has been successfully saved',
  'EXP_TYP_NOT_EXIST': 'This expense type does not exist',
  'EXP_TYP_UPDATE_SUCCESS': 'This expense type has been successfully updated',
  'EXP_TYP_DEL_SUCCESS': 'This expense type has been successfully deleted',
  'EXP_EXIST': 'This expense already exists',
  'EXP_ADD_SUCCESS': 'This expense has been successfully saved',
  'EXP_ID_REQ': 'The expense id is required',
  'EXP_HEAD_NOTEXIST': 'The expense header does not exist',
  'EXP_DET_NOTEXIST': 'This expense detail does not exist',
  'EXP_DET_ADD_SUCCESS': 'This expense detail has been successfully saved',
  'EXP_ADD_FAIL': 'Failed to add this expense detail',
  'EXP_DELETE_FAIL': 'Failed to delete this expense detail',
  'CARD_NOT_EXIST': 'This card does not exist',
  'CARD_UPDATE_FAIL': 'Failed to update card information',
  'CARD_ADD_SUCCESS': 'This card has been successfully saved',
  'CARD_INST_ADD_SUCCESS': 'This card installment has been successfully saved',
  'CARD_INST_NOT_EXIST': 'This card installment does not exist',
  'CARD_INST_ADD_FAIL': 'Failed to Add card installment',
  'CARD_INST_DELETE_FAIL': 'Failed to delete card installment',
  'CARD_INST_POST_FAIL': 'Failed to post card installment',
  'CARD_INST_PRICE_NOT_POSTED': 'This card installment not fully posted',
  'CARD_TRANS_ADD_FAIL': 'Failed to Add card transaction',
  'CARD_TRANS_ADD_SUCCESS': 'This card transaction has been successfully saved',
  'CARD_TRANS_NOT_EXIST': 'This card transaction does not exist',
  'CARD_TRANS_DELETE_FAIL': 'Failed to delete card transaction',
  'CARD_TRANS_UPDATE_FAIL': 'Failed to update card transaction',
  'CARD_TRANS_INST_FAIL': 'You cant update installment transaction',
  'CARD_INST_FINISHED': 'This card installment is terminated', 
  'CARD_TRANS_INVALID': 'Invalid card transactions',
  'CARD_TRANS_PAY_FAIL': 'Failed to pay card transaction',
  'CARD_TRANS_PAY_SOME': '(?) Card Transaction(s) failed to be paid',
  'CARD_TRANS_PAY_AMOUNT': 'Invalid card transaction amount, must not be zero',
  'CARD_TRANS_PAY_MIX': 'Invalid card transactions, can not process credit and debit together',
  'CARD_CLOSE_BALANCE': 'Invalid status, you cannot close this card as there is pending balance',
  'CARD_ACTIVE_LIMIT': 'Invalid limit, limit should be greater than zero',
  'DEBT_NOT_EXIST': 'This debtor does not exist',
  'DEBT_CLOSE_BALANCE': 'Invalid status, you cannot close this debtor as there is pending balance',
  'DEBT_ADD_SUCCESS': 'This debtor has been successfully created', 
  'DEBT_ADD_FAIL': 'Failed to add this debtor',
  'DEBT_UPDATE_FAIL': 'Failed to update this debtor',
  'DEBT_DELETE_FAIL': 'Failed to delete this debtor',
}
