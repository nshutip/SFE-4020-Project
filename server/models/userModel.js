const mongoose = require("mongoose")

const schema = mongoose.Schema({
	first_name: String,
	last_name: String,
	email: String,
    password: String,
	token: String,
})

module.exports = mongoose.model("User", schema)
