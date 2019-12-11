module.exports = (app, db, axios) => {
    app.post('/addFavoriteStation', (request, response) => {
        axios.get(`https://api-v3.mbta.com/stops?route=Red,Blue,Green-B,Green-C,Green-D,Green-E,Orange,Mattapan,CR-Middleborough,CR-Providence`)
          .then(apiResponse => {
            let stationFound = false;
            for(let i = 0; i < apiResponse.data.data.length; i++) {
              if(apiResponse.data.data[i].attributes.name.toLowerCase() === request.body.stationName.toLowerCase()) {
                stationFound = true;
                break;
              }
            }
            if(stationFound) {
              db.collection('users').findOneAndUpdate(
                {'local.email': request.user.local.email}, 
                { $addToSet: { favoriteStations: { stationName: request.body.stationName }}}
              );
              response.redirect('/profile')
            } else {
              response.status(422);
              response.send(`Error! ${request.body.stationName} is not a valid MBTA Station!`);
            }
          })
          .catch(err => console.log(err));
      });
}