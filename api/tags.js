const express =  require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');


tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");
  
    next(); // THIS IS DIFFERENT
  });
  
tagsRouter.get('/', async (req, res) => {
    const users = await getAllTags()

    res.send({
      'tags': []
    });
  });

  tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    const { tagName } = req.params;
    try {
      // use our method to get posts by tag name from the db
      const postsWithTag = await getPostsByTagName(tagName);
      // send out an object to the client { posts: // the posts }
      const posts = postsWithTag.filter((post) => {
        if (post.active) {
          return true;
        }
        if (req.user && post.author.id === req.user.id) {
          return true;
        }
          return false;
      });
      res.send({ posts: posts});
    } catch ({ name, message }) {
      // forward the name and message to the error handler
      next({ name, message });
    }
  });

module.exports = tagsRouter;