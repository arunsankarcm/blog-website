const Post = require('../models/post');
const Comment = require('../models/comment')

  
exports.getPost = async(req,res) => {
    try{
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch(err) {
        res.status(500).json({message:err.message});
    }
};

  
exports.createPost = async (req,res) => {
    try {
        const { title, content, publish } = req.body;
        if(!title || !content) {
            return res.status(400).json({message:'Title and content are required'});
        }
        const newPost = new Post({
            title,
            content,
            publish: typeof publish === 'boolean' ? publish : true,
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    }catch(err) {
        res.status(500).json({message:err.message});
    }
};

  
exports.getPostbyID = async (req, res) => {
    try {
        const postID = req.params.postID;
        if (!postID) {
            return res.status(404).json({ message: 'Post ID not provided' });
        }
        const post = await Post.findById(postID);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


  
exports.deletePost = async (req, res) => {
    try {
        const postID = req.params.postID;
        const post = await Post.findById(postID);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await Post.deleteOne({ _id: postID });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

  
exports.addCommentToPost = async (req, res) => {
    try {
        const { postID } = req.params;
        const { message } = req.body;
        const userId = req.user.userId;   

        const comment = new Comment({ message, user: userId });
        const savedComment = await comment.save();

        await Post.findByIdAndUpdate(postID, { $push: { comments: savedComment._id } });

        res.status(201).json(savedComment );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


  
exports.deleteComment = async (req, res) => {
    const { postID, commentID } = req.params;
    try {
          
        const post = await Post.findById(postID);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

          
        const commentExists = post.comments.includes(commentID);
        if (!commentExists) {
            return res.status(404).json({ message: 'Comment not found in the post' });
        }

          
        await Comment.findByIdAndDelete(commentID);

          
        await Post.findByIdAndUpdate(postID, { $pull: { comments: commentID } });

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

  
exports.getComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID).populate('comments');
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.json(post.comments);
    } catch (error) {
        res.status(500).send('Server error');
    }

};    

  
exports.editComment = async (req, res) => {
    const { postID, commentID } = req.params;
    const { message } = req.body;

    try {
          
        const comment = await Comment.findById(commentID);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

          
        if (!req.user.admin && comment.author.toString() !== req.user.id) {
            return res.status(403).send('Not authorized to edit this comment');
        }

          
        const updatedComment = await Comment.findByIdAndUpdate(commentID, { message }, { new: true });
        if (!updatedComment) {
            return res.status(404).send('Comment not found');
        }

          
          
          

        res.json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).send('Server error');
    }
};