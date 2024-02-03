const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: {type: String, required: true},
    title: {type: String, required: true},
    publish: {type: Boolean, default:true},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

module.exports = mongoose.model('Post', PostSchema);