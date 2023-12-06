const express = require("express")
const mongoose = require("mongoose")
const routes = require("./app")
const cors = require('cors');
const jsonwebtoken = require("jsonwebtoken");

const dotenv = require('dotenv').config();

console.log(dotenv.parsed)

const PORT = process.env.PORT || 4000

const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

try {
	mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
	.then(() => {
		console.log("Successfully connected to database");
	})
	.catch((error) => {
		console.log("database connection failed. exiting now...");
		console.error(error);
		process.exit(1);
	});

	const app = express()

	app.use(cors({origin:"*"}))

	app.use(express.json())


	app.use("/api", routes)
	app.use("*", (req, res) => {
		res.status(404).json({ error: "RESOURCE NOT FOUND" });
	});

	const server = app.listen(PORT, () => {
		console.log(`Server has started! API running on ${PORT}`)
	})

	module.exports = server
} catch(error) {
	console.log(error)
}

