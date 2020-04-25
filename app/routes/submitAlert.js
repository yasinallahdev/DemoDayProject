const stationAlert = require('../models/stationAlert');

module.exports = (app, db, nodemailer) => {

    app.post("/submitAlert", (req, res) => {
        if(req.user.recieveEmailAlerts) {
            
        }
    });

}