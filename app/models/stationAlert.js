const mongoose = require('mongoose');

const stationAlertSchema = mongoose.Schema({
    thisAlert: String,
    stationName: String,
    submittedBy: String,
    submittedByEmail: String, // not visible to users (including staff). Only used to send an e-mail to the user that tells them if their alert was accepted or denied.
    submittedByPhoneNumber: String, // not visible to users (including staff). Only used to send an SMS message to the user that teels them if their alert was accepted or denied.
    submittedDate: Date
});

module.exports = mongoose.model('stationAlert', stationAlertSchema);