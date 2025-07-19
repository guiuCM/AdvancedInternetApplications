var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    img: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    desc: {type: String, required: false},
    rating: {type: Number, required: false},
    no_items: {type: Number, required: true}
});

module.exports = mongoose.model('Item', itemSchema);
