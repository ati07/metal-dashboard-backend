export const dateFormate = (date, formate) => {
    const startDate = new Date(date)
    const startdate = startDate.getDate() < 10 ? '0' + startDate.getDate().toString() : startDate.getDate().toString()
    const startMonth = startDate.getMonth() + 1 < 10 ? '0' + (startDate.getMonth() + 1).toString() : (startDate.getMonth() + 1).toString()
    const startYear = startDate.getFullYear()
    let start_date;
    switch (formate) {
        case 'YYYY-MM-DD':
            start_date = startYear + "-" + startMonth + '-' + startdate
            break;
        case 'MM-DD-YYYY':
            start_date = startMonth + '-' + startdate + "-" + startYear
            break;
        case 'MM/DD/YYYY':
            start_date = startMonth + '/' + startdate + "/" + startYear
            break;
        case 'DD/MM/YYYY':
            start_date = startdate + '/' + startMonth + "/" + startYear
            break;
    }
    return start_date
}

export const convertFormate = (number) => {
    let data = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number)
    return data
}

export function formatString(str) {
    return str.toLowerCase()
    return str
      .replace(/(\B)[^ ]*/g, (match) => (match.toLowerCase()))
      .replace(/^[^ ]/g, (match) => (match.toUpperCase()));
    
  }