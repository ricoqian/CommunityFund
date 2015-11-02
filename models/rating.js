var mongoose = require('mongoose')



var RatingSchema = new mongoose.Schema({
    _user: { type: mongoose.Schema.ObjectId, ref: 'user' },
    _project: { type: mongoose.Schema.ObjectId, ref: 'project' },
    rating: { type: Number, default: 0 }
});

mongoose.model('Rating', RatingSchema);