var mongoose = require('mongoose');

var doomoLevelSchema = mongoose.Schema({
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

doomoLevelSchema.statics = {
    getAllPuzzles: function(cb) {
        this.find({}).lean().exec(cb);
    }
}

module.exports = mongoose.model('DoomoLevel', doomoLevelSchema);