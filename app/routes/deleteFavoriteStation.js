module.exports = (app, db) => {
    app.delete('/deleteFavoriteStation', (request, response) => {
        db.collection('users').findOneAndUpdate(
          {'local.email': request.user.local.email}, 
          { $pull: { favoriteStations: { stationName: request.body.stationName }}}
        );
        response.end();
    })
}