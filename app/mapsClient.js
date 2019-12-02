const apiKeys = require('./../config/api/apiKeys.js');

const googleMapsClient = require('@google/maps').createClient({
    key: apiKeys.google,
    Promise: Promise
})