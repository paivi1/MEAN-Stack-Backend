const Post = require('../models/post');


exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host"); // Get the server address to construct our image path
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename, // Image path to store in db
    creator: req.userData.userId
  });
  post.save()
  .then(createdPost =>{
    res.status(201).json({
      message:"Post added successfully",
      post: {
        ...createdPost, // Can more densely code below using the spread operator to copy all propoerties, and then we override the '_id' property to set it as 'id'
        id: createdPost._id
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed"
    })
  })
}

exports.updatePost = (req,res,next) => {
  let imagePath = req.body.imagePath; // Default is the existing image path. If the update did not include a file this value will remain

  if(req.file) { // If there was a file sent in the request, then we need to modify the file representing the post's image. Thus, we set it to it's new path
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log(post);
  Post.updateOne({_id: req.params.id, creator: req.userData.userId }, post)
  .then(result => {
    if(result.n > 0){ // If number 'nModified' of posts modified is less than 1, we have no successfully editted the post
      res.status(200).json({
        message: 'Update successful'});
    } else {
      res.status(401).json({
        message: 'Not authorized to edit this post'
      });
    }

  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post."
    })
  })
  console.log('Update success!');
}

exports.getPosts = (req, res, next) => { // All post GET request
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery =  Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery.find()
  .then(documents => {
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });
}

exports.getPost = (req,res,next) =>{ // Single post GET request
  Post.findById(req.params.id).then(post =>{
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
  .then(result => {
    if(result.n > 0){ // If number 'n' of posts deleted is less than 1, we have no successfully deleted the post
      res.status(200).json({
        message: 'Delete successful'});
    } else {
      res.status(401).json({
        message: 'Not authorized to delete this post'});
    }
  })
  .catch(error => {
    res.status(500),json({
      message: "Delete unsuccessful."
    })
  });

}
exports.getPost
