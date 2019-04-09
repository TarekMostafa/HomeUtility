const formatter = new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2 })

export default (amount) => {
  return formatter.format(amount);
}
