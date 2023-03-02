import {Router} from "express";
import passport from "passport";
import userModel from "../dao/models/users.model.js";
import {createHash} from "../utils.js";

const router = Router();

router.get(
  "/github",
  passport.authenticate("github", {scope: ["user:email"]}),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", {failureRedirect: "/login"}),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

router.post(
  "/register",
  passport.authenticate("register", {failureRedirect: "failregister"}),
  async (req, res) => {
    return res.send({status: "success", message: "User registered"});
  }
);

router.get("/failregister", async (req, res) => {
  console.log(req.session);
  res.send({status: 500, error: "Register failed"});
});

router.post(
  "/login",
  passport.authenticate("login", {failureRedirect: "faillogin"}),
  async (req, res) => {
    if (!req.user)
      return res.status(400).send({status: 400, error: "Incorrect email"});
    req.session.user = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
    };

    return res.send({
      status: "success",
      message: "Has iniciado sesion satisfactoriamente",
      payload: req.user,
    });
  }
);

router.get("/faillogin", async (req, res) => {
  res.status(500).send({status: 500, error: "Fail login"});
});

router.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      return res
        .clearCookie("connect.sid")
        .send({status: "success", message: "logout"});
    } else {
      res.send({status: 500, error: "Error logout"});
    }
  });
});

router.post("/recover", async (req, res) => {
  const {email, password} = req.body;
  if (!email || !password)
    return res.status(400).send({status: 404, error: "Incomplete values"});
  await userModel.findOneAndUpdate(
    {email: email},
    {password: createHash(password)}
  );
  res.send({status: "success", message: "Password updated"});
});

export default router;
