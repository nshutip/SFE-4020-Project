const mongoose = require("mongoose")

const likeSchema = new mongoose.Schema({
	articleId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Article' },
	userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    like: {type: Boolean, required: true},
})

module.exports = mongoose.model("Like", likeSchema)
