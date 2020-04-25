// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

// define the schema for our user model
var userSchema = mongoose.Schema({


    favoriteStations        : Array,
    username                : String,
    phoneNumber             : String,
    creationDate            : Date,
    userProfilePictureURL   : String,
    verified                : Boolean, // Only verified accounts may submit station alerts.
    isAdministrator         : Boolean, // If this user is an Administrator account, they have access to the Alerts Review Page
    recieveEmailAlerts      : Boolean, // If this user would like to recieve e-mail alerts, an email will be sent whenever a favorite station gets an alert change or if a submission was rejected or accepted.
    recieveSMSAlerts        : Boolean, // If this user would like to recieve SMS alerts, an text message will be sent whenever a favorite station gets an alert chnge or if a submission was rejected.
    accessibilityNeeds : {
        routeTransfer       : Boolean, // All route transfers should be possible with the other accessibility parameters
        wheelchairAccess    : Boolean, // If this is required, stations with high-level platforms, escalators, and elevators are prioritized
        visibility          : Boolean // If this is required, routes using vehicles with audio queues will be prioritized
    },
    local                   : {
        email               : String,
        password            : String
    },
    facebook                : {
        id                  : String,
        token               : String,
        name                : String,
        email               : String
    },
    twitter                 : {
        id                  : String,
        token               : String,
        displayName         : String,
        username            : String
    },
    google                  : {
        id                  : String,
        token               : String,
        email               : String,
        name                : String
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
