const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const app = express();

app.use(express.json());
app.use(cors());

// GET
app.get("/", async (req, res) => {
  const user = await User.find();

  try {
    res.status(200).json(user);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
});

// POST or REGISTER user
app.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const userEmail = await User.findOne({ email: req.body.email });
  const user = await new User({
    name: req.body.name,
    email: req.body.email,
    password: hashed,
  });

  try {
    if (userEmail) {
      return res.status(409).json({ message: "Email already used." });
    } else {
      await user.save();
      return res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
  }
});
// POST or LOGIN user
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (validPass) {
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        "secret1234"
      );
      return res.status(200).json({ user: token });
    } else {
      return res.status(400).json({ user: "Invalid password" });
    }
  } catch (error) {
    res.status(400).json({ message: "Somethin error" });
    console.log(error.message);
  }
});

// DELETE user
app.delete("/delete/:_id", async (req, res) => {
  const user = await User.deleteOne(req.body._id);
  try {
    res.status(200).json(user);
  } catch (error) {
    res.status(400);
    console.log(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is listening to the port ${PORT}`));
