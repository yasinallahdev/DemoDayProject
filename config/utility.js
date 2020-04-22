module.exports = {
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
            request.flash(alertName, `<h4>⚠️<strong>${alert.stationName}</strong></h4><p>${alert.thisAlert}<br>Submitted By: ${alert.submittedBy}</p>`);
            alertFlashes.push(request.flash(alertName));
        }
        return alertFlashes;
    }
}