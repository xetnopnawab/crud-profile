const mongoose = require('mongoose');
const mongodburl = require('./keys').url.mongodb;

mongoose.connect(mongodburl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => console.log('db configured!'))
    .catch( err => console.log(err));