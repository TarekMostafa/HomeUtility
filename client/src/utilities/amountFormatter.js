const amountFormatter = (amount, digits) => {
  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits}).format(amount);
}

export default amountFormatter;
