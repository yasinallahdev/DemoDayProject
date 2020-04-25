function getDateMonthName(date) {
    switch(date.getUTCMonth()) {
    case 0:return "January";
    case 1:return "February";
    case 2:return "March";
    case 3:return "April";
    case 4:return "May";
    case 5:return "June";
    case 6:return "July";
    case 7:return "August";
    case 8:return "Septemner";
    case 9:return "October";
    case 10:return "November";
    case 11:return "December";
    default:return "January";
    }
}

function getDayOfWeek(date) {
    switch(date.getUTCDay()) {
        case 0:return "Sunday";
        case 1:return "Monday";
        case 2:return "Tuesday";
        case 3:return "Wednesday";
        case 4:return "Thursday";
        case 5:return "Friday";
        case 6:return "Saturday";
        default:return "Sunday";
    }
}

module.exports = {
    getDateMonthName: getDateMonthName,
    convertPhoneNumber: (phoneNumber) => {
        return `+1${phoneNumber.replace(/-/gi,'')}`;
    },
    buildStationAlerts: (request, alertDocuments) => {
        let alertCounts = {};
        const alertFlashes = [];
        for(const alert of alertDocuments) {
            if(!Object.keys(alertCounts).includes(alert.stationName)) {
                alertCounts[alert.stationName] = 1;
            } else {
                alertCounts[alert.stationName]++;
            }
            const alertName = `${alert.stationName}${alertCounts[alert.stationName]}`;
            const alertDate = alert.submissionDate;
            const displayDate = `${getDayOfWeek(alertDate)} ${getDateMonthName(alertDate)} ${alertDate.getUTCDate()}, ${alertDate.getUTCFullYear()}`;
            request.flash(alertName, `<h4>⚠️<strong>${alert.stationName}</strong></h4><p>${alert.thisAlert}<br>Submitted By: ${alert.submittedBy}<br>Submission Date: ${displayDate}</p>`);
            alertFlashes.push(request.flash(alertName));
        }
        return alertFlashes;
    }
}