// config/database.js

const USE_GLOBAL = true;

function Database() {

    const password = "gaGZTFyWV3cULFef";
    this.dbName = 'demo';
    this.url = (!USE_GLOBAL)?(`mongodb://localhost:27017/${this.dbName}`):(`mongodb+srv://Frosty-Phoenix-Admin:${password}@cluster0-urpux.azure.mongodb.net/${this.dbName}?retryWrites=true&w=majority`);

}

module.exports = new Database();