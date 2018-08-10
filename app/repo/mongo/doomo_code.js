var mongoose = require('mongoose');

var codeSchema = mongoose.Schema({
    code: { type: String, index: true },
});

codeSchema.statics = {
    getAllCodes: function(cb) {
        this.find({}).lean().exec(cb);
    }
}

module.exports = mongoose.model('DoomoCode', codeSchema);