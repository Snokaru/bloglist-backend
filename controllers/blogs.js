const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post("/", (request, response, next) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  }).catch(error => next(error));
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  let updatedBlogPostData = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  let updatedBlogPost = await Blog.findByIdAndUpdate(request.params.id, updatedBlogPostData, { new: true });
  response.json(updatedBlogPost.toJSON());
});

module.exports = blogsRouter;