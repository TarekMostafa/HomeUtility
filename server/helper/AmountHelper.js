module.exports.formatAmount = (amount, digit) => {
    return new Intl.NumberFormat("en-GB", {
        minimumFractionDigits: digit,
        maximumFractionDigits: digit
    }).format(amount)
}