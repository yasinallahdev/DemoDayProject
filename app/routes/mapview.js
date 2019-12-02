module.exports = (app, passport, db, axios) => {

    app.get('/map', (request, response) => {
        let queryParam = request.query['station']
        let isLoggedIn = (request.user)?(true):(false);
        axios.get(`https://api-v3.mbta.com/stops?route=Red,Blue,Green-B,Green-C,Green-D,Green-E,Orange,Mattapan,CR-Providence,CR-Franklin,CR-Needham,CR-Fitchburg,CR-Fairmount,CR-Newburyport,CR-Middleborough,CR-Lowell,CR-Kingston,CR-Haverhill,CR-Greenbush,CR-Worcester`)
            .then(apiResponse => {
                console.log(`There are ${apiResponse.data.data.length} stations in total.`);
                const station = apiResponse.data.data.find( stationObject => { return stationObject.attributes.name.toUpperCase() === queryParam.toUpperCase(); })
                if(station) {
                    response.render("mapview.ejs", {
                        isLoggedIn: isLoggedIn,
                        user: request.user,
                        stationData: {
                            name: station.attributes.name,
                            latitude: station.attributes.latitude,
                            longitude: station.attributes.longitude,
                            address: station.attributes.address
                        } 
                    })
                } else {
                    response.status(404);
                    response.send(`The station ${queryParam} was not found.`);
                }
            })
            .catch(err => console.log(err));
      })

}