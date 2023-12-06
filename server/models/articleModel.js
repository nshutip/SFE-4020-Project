const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema({
	title: { type: String, required: true },
	image: {type: String, required: true},
	content: { type: String, required: true },
	comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Comment' }],
	likes: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Like' }],
	authorId: { type: mongoose.Schema.Types.ObjectId,  required: true, ref: 'Admin' },
});

module.exports = mongoose.model("Article", articleSchema)
