var mongoose = require('mongoose');

var blogCategorySchema = mongoose.Schema({
    category_id: { type: String, index: true },
    category_name: String,
}, { _id: false });

blogCategorySchema.statics = {
    getAllCategories: function(data, cb) {
        this.find().lean().exec(cb);
    },

    getCategory: function(data, cb) {
        this.findOne({ category_id: data.category_id }).lean().exec(cb);
    }
}

module.exports = mongoose.model('BlogCategory', blogCategorySchema);