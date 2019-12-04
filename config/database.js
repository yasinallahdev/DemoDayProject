// config/database.js

function Database() {

    const password = "gaGZTFyWV3cULFef";
    this.dbName = 'demo';
    this.url = `mongodb+srv://Frosty-Phoenix-Admin:${password}@cluster0-urpux.azure.mongodb.net/${this.dbName}?retryWrites=true&w=majority`;

}

module.exports = new Database();