const apiKeys = require('./../../config/api/apiKeys.js')
let directionPolylines = {};
const buildStationAlerts = require('./../../config/utility.js').buildStationAlerts;

// All references to 'West Station' exist for future proofing, as the MBTA plans to build a 'West Station' to open in 2040 when the Beacon Park Yard near I-90 in Allston is redeveloped.

module.exports = (app, db, axios) => {

    app.get("/directionPolyline", (request, response) => {
        const polylines = directionPolylines[`${request.query.srcLat}, ${request.query.srcLng}, ${request.query.destLat}, ${request.query.destLng}`];
        response.send(JSON.stringify(polylines));
        delete directionPolylines[`${request.query.srcLat}, ${request.query.srcLng}, ${request.query.destLat}, ${request.query.destLng}`];
    });

    app.get("/directions", (request, response) => {
        let startStation = request.query['startStation'];
        let endStation = request.query['destinationStation'];
        let isLoggedIn = (request.user)?(true):(false);
        // This API will get all MBTA Subway Stations, as well as stations along the Providence/Stoughton Line.
        axios.get(`https://api-v3.mbta.com/stops?route=Red,Blue,Green-B,Green-C,Green-D,Green-E,Mattapan,Orange,CR-Middleborough,CR-Providence`)
            .then(apiResponse => {
                console.log(`There are ${apiResponse.data.data.length} stations in total.`);
                const sourceStation = apiResponse.data.data.find( stationObject => { return stationObject.attributes.name.toUpperCase() === startStation.toUpperCase(); })
                const destStation = apiResponse.data.data.find( stationObject => { return stationObject.attributes.name.toUpperCase() === endStation.toUpperCase()})
                if(sourceStation && destStation) {
                    db.collection('stationAlerts').find({$or: [{'stationName': startStation}, {'stationName': endStation}]}).toArray( (err, alertArray) => {
                        // North, South, & (If built) West Station will be labeled 'Boston North/Boston South/Boston West Station'. Other stations to be listed (station) Station.
                        const displayStationForSource = ["South Station","West Station","North Station"].findIndex(element => {return element === sourceStation.attributes.name});
                        // North, South, & (If built) West Station will be labeled 'Boston North/Boston South/Boston West Station'. Other stations to be listed (station) Station.
                        const displayStationForDestination = ["South Station","West Station","North Station"].findIndex(element => {return element === destStation.attributes.name});
                        const sourceLatLng = `${sourceStation.attributes.latitude} ${sourceStation.attributes.longitude}`;
                        const destLatLng = `${destStation.attributes.latitude} ${destStation.attributes.longitude}`;
                        axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURI(sourceLatLng)}&destination=${encodeURI(destLatLng)}&mode=transit&transit_mode=rail&alternatives=true&key=${apiKeys.google}`)
                            .then(directionResponse => {
                                let directionLegs; 
                                let leastTransferData = {currentLeastTransfers: directionResponse.data.routes[0].legs[0].steps.length, routeWithLeastTransfers: directionResponse.data.routes[0].legs[0]};
                                for(const currentRoute of directionResponse.data.routes[0].legs) {
                                    if(currentRoute.steps.length < leastTransferData.currentMostTransfers) {
                                        leastTransferData.routeWithLeastTransfers = currentRoute;
                                        leastTransferData.currentLeastTransfers = currentRoute.steps.length;
                                    }
                                }
                                directionLegs = leastTransferData.routeWithLeastTransfers;
                                let polylineRoute = [];
                                let stepCounter = 1;
                                for(const directionStep of directionLegs.steps) {
                                    polylineRoute.push(`${directionStep.polyline.points}`);
                                    console.log(`Step ${stepCounter++}: ${directionStep.html_instructions}`)
                                    if(directionStep.steps) {
                                        let subStepCounter = 1;
                                        directionStep.steps = directionStep.steps.filter( element => { return element.html_instructions !== undefined; });
                                        for(const directionSubStep of directionStep.steps) {
                                            console.log(`\tSubstep ${subStepCounter++}: ${directionSubStep.html_instructions}`);
                                            polylineRoute.push(`${directionSubStep.polyline.points}`);
                                        }
                                    }
                                }
                                directionPolylines[`${sourceStation.attributes.latitude}, ${sourceStation.attributes.longitude}, ${destStation.attributes.latitude}, ${destStation.attributes.longitude}`] = polylineRoute;
                                db.collection('newsStories').find({}).toArray((err, result) => {
                                    const featuredStory = result.find( story => story.featured );
                                    const nonFeatured = result.filter( story => story != featuredStory );
                                    response.render('directions.ejs', {
                                        isLoggedIn: isLoggedIn,
                                        sourceStation: sourceStation,
                                        destStation: destStation,
                                        directionData: directionLegs,
                                        displayStationForSource: displayStationForSource,
                                        displayStationForDestination: displayStationForDestination,
                                        alerts: buildStationAlerts(request, alertArray),
                                        featuredStory: featuredStory,
                                        newsStories: nonFeatured
                                    });
                                })
                                
                            })
                        .catch(err => console.log(err));
                    });
                } else {
                    response.status(404);
                    response.send(`One of the stations you searched for (Start: ${startStation}, Dest: ${endStation} was not found. (Note that only MBTA Subway (Red/Blue/Green/Orange Lines), Providence/Stoughton, or Middleborugh/Lakeville Line Stations are currently supported)`);
                }
            })
            .catch(err => console.log(err));
    });

}