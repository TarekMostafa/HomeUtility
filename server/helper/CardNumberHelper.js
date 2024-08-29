module.exports.formatCardNumber = (cardNumber) => {
    let formattedCardNumber = cardNumber.replace(/\D/g, '');
    formattedCardNumber = formattedCardNumber.replace(/(\d{4})/g, '$1 ');
    return formattedCardNumber.trim();
}