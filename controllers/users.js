const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();

const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  if (body.password.length < 3) {
    response.status(400).send({ error: "password must be atleast 3 characters long" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    name: body.name,
    username: body.username,
    passwordHash,
  });

  await user.save();
  response.json(user.toJSON());
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    author: 1,
    title: 1,
    url: 1,
    likes: 1,
  });
  response.json(users);
});

module.exports = usersRouter;
