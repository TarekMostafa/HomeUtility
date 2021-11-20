class DateHelper {
    static getMonths() {
        return [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]
    }

    static getFullDateFormat(inDate){
        const d = new Date(inDate);
        const year = d.getFullYear();
        const day = d.getDate();
        const month = this.getMonths()[d.getMonth()];
        return `${day} ${month} ${year}`;
    }
}

module.exports = DateHelper;