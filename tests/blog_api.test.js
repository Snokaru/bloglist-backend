const mongoose = require("mongoose");
const supertest = require("supertest");

const Blog = require("../models/blog");
const app = require("../app");


const api = supertest(app);

let initialBlogs = [
  {
    title: "My first blog",
    author: "Andrei Zamfirescu",
    url: "https://ro.wikipedia.org/wiki/Blog",
    likes: 100,
  },
  {
    title: "My second blog",
    author: "Ionut Parscopol",
    url: "https://fullstackopen.com/en/part4/testing_the_backend#running-tests-one-by-one",
    likes: 50,
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of initialBlogs) {
    let blogObject = Blog(blog);
    await blogObject.save();
  }

});

describe("when there are blogs in the database", () => {

  test("should return all blogs", async () => {
    const blogsInDB = await api.get("/api/blogs");
    expect(blogsInDB.body.length).toBe(initialBlogs.length);
  });

  test("id property should be defined for every blog", async () => {
    const blogsInDB = (await api.get("/api/blogs")).body;
    for (let blog of blogsInDB) {
      expect(blog.id).toBeDefined();
    }
  }); 
});

describe("adding a blog", () => {
  const newBlog = {
    title: "TestTile",
    author: "TestAuthor",
    url: "http://testurl",
    likes: 10,
  };
  test("should succeed with valid data", async () => {

    await api.post("/api/blogs").send(newBlog).expect(201).expect("Content-Type", /application\/json/);

    const blogsInDB = (await api.get("/api/blogs")).body;
    console.log(blogsInDB);
    const searchedBlog = blogsInDB.find(blog => blog.title === newBlog.title && blog.author === newBlog.author && blog.url === newBlog.url && blog.likes === newBlog.likes);
    expect(searchedBlog).toBeDefined();
  });

  test("without likes should default likes to 0", async () => {
    delete newBlog.likes;
    let postedBlog = await api.post("/api/blogs").send(newBlog).expect(201).expect("Content-Type", /application\/json/);
    expect(postedBlog.body.likes).toBe(0);
  });

  test("with invalid data should return statuscode 400", async () => {
    delete newBlog.title;
    delete newBlog.url;

    const res = await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

afterAll(() => mongoose.connection.close());
