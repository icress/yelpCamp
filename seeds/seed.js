const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { features, descriptors, cities} = require('./seedHelper');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp') 

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION ERROR:'));
db.once('open', () => {
    console.log('DATABASE CONNECTED')
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(features)}`,
            price: price,
            author: "64320b66f1464eaf31acb3c4",
            image: 'https://source.unsplash.com/random/?camping',
            description: 'Lorem ipsum dolor sit amet consectetur adipiscli non ansondro pouleter set belistret'
        })
        await camp.save()
    }
};

seedDB().then(() => {
    db.close();
})