var Item = require('../models/item');
var LoremIpsum = require('lorem-ipsum').LoremIpsum;
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shop', {useNewUrlParser: true, useUnifiedTopology: true});

var lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

const RELATED_PICS = ['https://upload.wikimedia.org/wikipedia/commons/5/5d/Office_of_Naval_Research_Electromagnetic_Railgun_-_Naval_Surface_Warfare_Center_Dahlgren_Division_02.jpg',
                        'https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG',
                        'https://get.pxhere.com/photo/apple-plant-fruit-flower-food-red-produce-healthy-flowering-plant-rose-family-land-plant-rose-order-944141.jpg'];

var items = Array.from(Array(32).keys()).map((index) => {
    return new Item({
        img: RELATED_PICS[Math.floor(Math.random() * RELATED_PICS.length)],
        name: lorem.generateWords(2) + index,
        desc: lorem.generateParagraphs(1),
        price: Math.floor(Math.random() * 9899) / 100 + 1,
        rating: Math.floor(Math.random() * 5) + 1,
        no_items: Math.floor(Math.random() * 4)
    });
});

var saved = 0;
items.forEach(item => {
    item.save(done);
});

function done() {
    saved++;
    if (saved === items.length) {
        mongoose.disconnect();
    }
}

