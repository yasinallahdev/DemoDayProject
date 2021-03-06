const buildStationAlerts = require('./../../config/utility.js').buildStationAlerts;

module.exports = (app, db, axios) => {

    app.get('/map', (request, response) => {
        let queryParam = request.query['station']
        let isLoggedIn = (request.user)?(true):(false);
        axios.get(`https://api-v3.mbta.com/stops?route=Red,Blue,Green-B,Green-C,Green-D,Green-E,Mattapan,Orange,CR-Fitchburg,CR-Haverhill,CR-Lowell,CR-Newburyport,CR-Greenbush,CR-Middleborough,CR-Kingston,CR-Fairmount,CR-Franklin,CR-Worcester,CR-Providence,CR-Needham`)
            .then(apiResponse => {
                console.log(`There are ${apiResponse.data.data.length} stations in total.`);
                const station = apiResponse.data.data.find( stationObject => { return stationObject.attributes.name.toUpperCase() === queryParam.toUpperCase(); })
                if(station) {
                    db.collection('stationAlerts').find({'stationName': queryParam}).toArray((err, alertArray) => {
                        db.collection('newsStories').find({}).toArray((err2, result) => {
                            const featuredStory = result.find( story => story.featured );
                            const nonFeatured = result.filter( story => story != featuredStory );
                            response.render("mapview.ejs", {
                                isLoggedIn: isLoggedIn,
                                user: request.user,
                                stationData: {
                                    name: station.attributes.name,
                                    latitude: station.attributes.latitude,
                                    longitude: station.attributes.longitude,
                                    address: station.attributes.address
                                },
                                alerts: buildStationAlerts(request, alertArray),
                                featuredStory: featuredStory,
                                newsStories: nonFeatured
                            })
                        });
                    });
                } else {
                    response.status(404);
                    response.send(`The station ${queryParam} was not found. (Note that only MBTA Subway (Red/Blue/Green/Orange Line) stations, as well as Providence/Stoughton & Middleborugh/Lakeville Line Trains, are currently supported)`);
                }
            })
            .catch(err => console.log(err));
      })

      const futureLines = "Red,Blue,Orange,Mattapan,CR-Providence,CR-Franklin,CR-Needham,CR-Fitchburg,CR-Fairmount,CR-Newburyport,CR-Kingston,CR-Lowell,CR-Haverhill,CR-Greenbush,CR-Worcester";

}