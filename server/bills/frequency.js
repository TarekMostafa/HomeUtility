class Frequency {
    static getDateRange(frequency, billDate) {
        let _date = new Date(billDate);
        if(isNaN(_date)) return null;

        let factor = 0;
        let loMonth = 0;

        switch(frequency) {
            case "DAILY":
                return {
                    dateFrom: new Date(_date.getFullYear(), _date.getMonth(), _date.getDate()),
                    dateTo: new Date(_date.getFullYear(), _date.getMonth(), _date.getDate())
                }
            case "WEEKLY":
                // 0=Sunday, 1=Monday, etc
                const lowDay = _date.getDay();
                const highDay = 7 - _date.getDay();

                let dateFrom = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate());
                let dateTo = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate());
                dateFrom.setDate(dateFrom.getDate()-lowDay)
                dateTo.setDate(dateTo.getDate()+highDay)

                return {
                    dateFrom: new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate()),
                    dateTo: new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate())
                }
                break;
            case "MONTHLY":
                factor = 1;
                loMonth = this.getLowMonth(_date.getMonth(), factor);
                return {
                    dateFrom: new Date(_date.getFullYear(), loMonth, 1),
                    dateTo: new Date(_date.getFullYear(), loMonth+factor, 0)
                }
            case "BIMONTHLY":
                factor = 2;
                loMonth = this.getLowMonth(_date.getMonth(), factor);
                return {
                    dateFrom: new Date(_date.getFullYear(), loMonth, 1),
                    dateTo: new Date(_date.getFullYear(), loMonth+factor, 0)
                }
            case "QUARTERLY":
                factor = 3;
                loMonth = this.getLowMonth(_date.getMonth(), factor);
                return {
                    dateFrom: new Date(_date.getFullYear(), loMonth, 1),
                    dateTo: new Date(_date.getFullYear(), loMonth+factor, 0)
                }
            case "TRIANNUALLY":
                factor = 4;
                loMonth = this.getLowMonth(_date.getMonth(), factor);
                return {
                    dateFrom: new Date(_date.getFullYear(), loMonth, 1),
                    dateTo: new Date(_date.getFullYear(), loMonth+factor, 0)
                }
            case "SEMIANNUALLY":
                factor = 6;
                loMonth = this.getLowMonth(_date.getMonth(), factor);
                return {
                    dateFrom: new Date(_date.getFullYear(), loMonth, 1),
                    dateTo: new Date(_date.getFullYear(), loMonth+factor, 0)
                }
            case "ANNUALLY":
                factor = 12;
                loMonth = this.getLowMonth(_date.getMonth(), factor);
                return {
                    dateFrom: new Date(_date.getFullYear(), loMonth, 1),
                    dateTo: new Date(_date.getFullYear(), loMonth+factor, 0)
                }
            default:
                return {
                    dateFrom: null,
                    dateTo: null
                }
        }
    } 

    static getLowMonth(month, factor) {
        let rem = ~~(month/factor);
        return rem * factor;
    }
}

module.exports = Frequency;