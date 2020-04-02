var mongoose = require('mongoose');

var doomoLevel2Schema = mongoose.Schema({
    id: { type: String, index: true },
    puzzle_name: String,
    question_statement: String,
    answer_statement: String,
    level_position: Number,
    solution: {
        statement: String,
        image_url: String,
        cost: Number
    },
    clue: {
        statement: String,
        image_url: String,
        cost: Number
    }
});

doomoLevel2Schema.statics = {
    getAllPuzzles_v2: function(cb) {
        this.find({}).lean().exec(cb);
    }
}

module.exports = mongoose.model('DoomoLevel_v2', doomoLevel2Schema);