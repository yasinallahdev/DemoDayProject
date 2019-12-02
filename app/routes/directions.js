module.exports = (app, passport, db, axios) => {

    app.get("/directions", (request, response) => {
        let startStation = request.query['startStation']
        let destinationStation = request.query['destinationStation']
        response.send(`You're looking for accessible directions from ${startStation} to ${destinationStation}, I see.`)
    });

}