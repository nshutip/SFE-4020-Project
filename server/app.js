const express = require("express")
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const Joi = require("joi")
const multer = require('multer');
const router = express.Router()

const Article = require("./models/articleModel")
const Like = require("./models/likeModel")
const Comment = require("./models/commentModel")
const Query = require("./models/queryModel")
const Admin = require("./models/adminModel")
const User = require("./models/userModel")

const adminAuth = require("./middleware/auth")
const userAuth = require("./middleware/cAuth")

const { validateSignUp, validateLogIn, 
  validateArticle, validateComment, validateQuery, validateLike } = require("./middleware/validator")

const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const upload = multer({ storage: storage });


// Get all articles
router.get("/articles", async (req, res) => {

  try {
    const articles = await Article.find()
    return res.status(200).send(articles)
  } catch {
    res.status(404).send({ error: "Articles not found!" })
  }
})

// Create an article
router.post("/articles", adminAuth, upload.single('image'), async (req, res) => {

  try {
    const {error, value} = validateArticle(req.body);

    if (error) return res.status(400).send(error.details);

    const token = req.headers["x-access-token"];

    const decoded = jsonwebtoken.verify(token, JWT_SECRET);
    const user = await Admin.findOne({ _id: decoded.user_id });

    const userId = user._id;

    console.log(userId)
  
    const article = new Article ({
      title: req.body.title,
      image: req.file ? req.file.filename : undefined || req.body.image,
      content: req.body.content,
      authorId: userId,
    })
  
    await article.save()
    return res.status(200).send({message:"Article added successfuly", article})
  } catch (error){
    console.log(req.user)
    return res.status(500).json({ error: "Unsuccessfull request!" })
  }
})

// Get individual article
router.get("/articles/:id", async (req, res) => {

	const article = await Article.findOne({ _id: req.params.id }).populate('likes').populate('comments')
	return res.status(200).send(article)
})

// Update an article
router.patch("/articles/:id", adminAuth, async (req, res) => {

	try {
		const article = await Article.findOne({ _id: req.params.id })

		if (req.body.title) {
			article.title = req.body.title
		}

		if (req.body.content) {
			article.content = req.body.content
		}

    if (req.body.image) {
			article.image = req.body.image
		}

		await article.save()
		return res.status(200).send(article)
	} catch {
		return res.status(404).send({ error: "Article doesn't exist!" })
	}
})

// Deleting an article
router.delete("/articles/:id", adminAuth, async (req, res) => {

	try {
    const article = await Article.deleteOne({ _id: req.params.id })
		return res.status(200).send({message: "Article deleted successfuly"})
	} catch {
		res.status(404).send({ error: "Article doesn't exist!" })
	}
})

// Adding a comment to an article
router.post("/articles/:id/comments", userAuth,async (req, res) => {

  try {
    const {error, value} = validateComment(req.body);

    if (error) {
      console.log(error)
      return res.status(400).send(error.details)
    }

    const token = req.headers["x-access-token"];

    const decoded = jsonwebtoken.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.user_id });

    const userId = user._id;

    const articleId = req.params.id;

    console.log(articleId)

    if (articleId.match(/^[0-9a-fA-F]{24}$/)) {
      const comment = new Comment({
        articleId: articleId,
        userId: userId,
        comment: req.body.comment,
      });
  
      const savedComment = await comment.save();
  
      await Article.findByIdAndUpdate(
        articleId,
        { $push: { comments: savedComment._id } },
        { new: true },
      );
  
      return res.status(201).send({message: "Comment added successfuly", comment})
    }

	} catch (error){
    console.log(error)
		res.status(400).send({ error: "failed to add comment!" })
	}
})

// Get all article comments
router.get("/articles/:id/comments", async (req, res) => {

	const article = await Article.findOne({ _id: req.params.id }).populate('comments')
	return res.status(200).send(article.comments)
})

// Delete a comment
router.delete("/articles/:id1/comments/:id2", userAuth, async (req, res) => {

	try {

    const userId = req.user._id;
    console.log(userId)

    const comment = await Comment.findOne({ _id: req.params.id2 })
    
    const comAuthor = comment.userId;
    console.log(comAuthor)

    if (userId.toString === comAuthor.toString) {
      await Comment.deleteOne({ _id: req.params.id2 })
      return res.status(200).send({message: "comment deleted successfuly"})
    } else {
      return res.status(403).send({error: "You do not have the permissions to delete this comment!"})
    }

	} catch {
		res.status(404).send({ error: "Article doesn't exist!" })
	}
})

// Adding a like to an article
router.post("/articles/:id/likes", userAuth,async (req, res) => {

  try {

    const {error, value} = validateLike();

    if (error) {
      console.log(error)
      return res.status(400).send(error.details)
    }

    const articleId = req.params.id;
    const userId = req.user._id;

    const existingLike = await Like.findOne({ articleId, userId });

    if (existingLike) {
      return res.status(400).json({ error: 'You have already liked this article!' });
    }

    const like = new Like({
      articleId,
      userId,
      like: true,
    });

    await like.save();

    await Article.updateOne({ _id: articleId }, { $push: { likes: like._id } });

    return res.status(201).json({ message: 'Article liked successfully', like });

  }
  catch {
    res.status(404).send({ error: "Article doesn't exist!" })
  }
})

// Get all article likes
router.get("/articles/:id/likes", async (req, res) => {

	const article = await Article.findOne({ _id: req.params.id }).populate('likes')
	return res.status(200).send(article.likes)
})

// Delete a like
router.delete("/articles/:id1/likes/:id2", userAuth, async (req, res) => {

	try {

    const like = await Like.findOne({ _id: req.params.id2 })

    const userId = req.user._id;

    const likeAuthor = like.userId

    if (userId === likeAuthor) {
      await Like.deleteOne({ _id: req.params.id2 })
      return res.status(204).send()
    } else {
      return res.status(403).send({error: "You do not have the permissions to remove this like!"})
    }
	} catch {
		res.status(404).send({ error: "Article doesn't exist!" })
	}
})

// Create a Query
router.post("/queries", async (req, res) => {

  const {error, value} = validateQuery(req.body);

  if (error) {
    console.log(error)
    return res.status(400).send(error.details)
  }

  const { name, email, message } = req.body

	const query = new Query ({ name, email, message, })

	await query.save()

	return res.status(201).send({message: "Query sent successfuly", query})
})

// Get all queries
router.get("/queries", adminAuth,async (req, res) => {

	const queries = await Query.find()
	return res.status(200).send(queries)
})

// Add new admin user
router.post("/user/admin/signup", async (req, res) => {

  try {

    const {error, value} = validateSignUp(req.body);

    if (error) {
      console.log(error)
      return res.status(400).send(error.details)
    }

    const { first_name, last_name, email, password } = req.body;

    const oldUser = await Admin.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await Admin.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    return res.status(201).send({message:"Admin added successfully",user});

  } catch (err) {
    console.log(err);
  }
});

// Admin login
router.post("/user/admin/login", async (req, res) => {

  try {
    const { email, password } = req.body;

    const { error, value} = validateLogIn(req.body)

    if (!(email && password)) {
      console.log(error)
      return res.status(400).send({message: 'Email and password are required', error: error.details});
    }

    const user = await Admin.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      
      const token = jsonwebtoken.sign({ user_id: user._id, email }, JWT_SECRET);

      user.token = token;

      return res.status(200).json({ message: 'Login successful', token });
      
    } else {
      return res.status(401).send({ message: 'Email or password is incorrect' });
    }
    
  } catch (err) {
    return res.status(500).json({error: "login request failed!"})
  }
});

// Get all admin users
router.get("/user/admin", adminAuth,async (req, res) => {

	const admin = await Admin.find()
	return res.status(200).send(admin)
})

// Update admin information
router.patch("/user/admin/:id", adminAuth, async (req, res) => {

	try {
		const admin = await Admin.findOne({ _id: req.params.id })

		if (req.body.first_name) {
			admin.first_name = req.body.first_name
		}

		if (req.body.last_name) {
			admin.last_name = req.body.last_name
		}

    if (req.body.email) {
			admin.email = req.body.email
		}

		await admin.save()
		return res.status(200).send({message: "Admin information updated successfully", admin})
	} catch {
		return res.status(404).send({ error: "User not found!" })
	}
})

// Delete admin user
router.delete("/user/admin/:id", adminAuth, async (req, res) => {

	try {
		await Admin.deleteOne({ _id: req.params.id })
		return res.status(200).send({message: "Admin user deleted successfully"})
	} catch {
		res.status(404).send({ error: "Admin user not found!" })
	}
})

// Get all client users
router.get("/user/client", adminAuth,async (req, res) => {

	const user = await User.find()
	return res.status(200).send(user)
})

// Delete client user
router.delete("/user/client/:id", adminAuth, async (req, res) => {

	try {
		await User.deleteOne({ _id: req.params.id })
		return res.status(200).send({message: "User deleted successfully"})
	} catch {
		res.status(404).send({ error: "User not found!" })
	}
})

// Add new client user
router.post("/user/client/signup", async (req, res) => {

  try {
    const { first_name, last_name, email, password } = req.body;

    const {error, value} = validateSignUp(req.body)

    if (error) {
      console.log(error)
      return res.status(400).send(error.details)
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    return res.status(201).send({message: "User added successfully", user});

  } catch (err) {
    console.log(err);
  }
});

// client login
router.post("/user/client/login", async (req, res) => {

  try {
    const { email, password } = req.body;

    const { error, value} = validateLogIn(req.body)

    if (!(email && password)) {
      console.log(error)
      return res.status(400).send({message: 'Email and password are required', error: error.details});
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      
      const token = jsonwebtoken.sign({ user_id: user._id, email }, JWT_SECRET);

      user.token = token;

      return res.status(200).send({ message: 'Login successful', token });
    }
    return res.status(401).send({ message: 'Email or password is incorrect' });
  } catch (err) {
    console.log(err);
  }
});


module.exports = router