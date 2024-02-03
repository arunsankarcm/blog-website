const express = require('express');
const router = express.Router();
const post_controller = require('../controllers/postController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/', authenticateToken,  post_controller.getPost);
router.get('/:postID', authenticateToken, post_controller.getPostbyID);
router.get('/:postID/comments', authenticateToken, post_controller.getComment);


router.post('/create-post', authenticateToken, post_controller.createPost)
router.delete('/delete-post/:postID', authenticateToken, isAdmin, post_controller.deletePost)

router.post('/:postID/add-comment', authenticateToken, post_controller.addCommentToPost);
router.patch('/:postID/:commentID/edit-comment', authenticateToken, isAdmin, post_controller.editComment);
router.delete('/:postID/:commentID/delete-comment', authenticateToken, isAdmin, post_controller.deleteComment);

module.exports = router;

