const mongoose = require('mongoose');

const stationSchema = mongoose.Schema({
    stationName : String,
    stationPictureURL : String,
    stationComments : Array,
    stationAlerts : Array
})

module.exports = mongoose.model('Station', stationSchema);