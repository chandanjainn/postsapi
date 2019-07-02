const express = require('express'),
	postRouter = express.Router(),
	multer = require('multer'),
	auth = require('../middleware/auth'),
	PostController = require('../controllers/posts');

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, '../images');
	},
	filename: (req, file, callback) => {
		const name = file.originalname
			.toLowerCase()
			.split(' ')
			.join('-');
		callback(null, name + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
	}
});

postRouter.post(
	'',
	auth,
	multer({ storage }).single('image'),
	PostController.addPost
);

postRouter.get('', PostController.getAllPosts);

postRouter.get('/:id', PostController.getPost);

postRouter.delete('/delete/:id', auth, PostController.deletePost);

postRouter.put(
	'/:id',
	auth,
	multer({ storage }).single('image'),
	PostController.editPost
);

module.exports = postRouter;
