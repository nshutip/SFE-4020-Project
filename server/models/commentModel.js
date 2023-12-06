const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
	articleId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Article' },
	userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	comment: { type: String, required: true },
});

module.exports = mongoose.model( "Comment", commentSchema)