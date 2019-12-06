const mongoose = require('mongoose');

const newsStorySchema = mongoose.Schema({
    title: String,
    featured: Boolean,
    month: String,
    day: Number,
    shortCaption: String,
    imageUrl: String,
    storyLink: String
})

module.exports = mongoose.model('newsStory', newsStorySchema);