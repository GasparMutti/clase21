import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/users.model.js";
import {createHash, isCorrect} from "../utils.js";
import githubService from "passport-github2";

const localStrategy = local.Strategy;

const initPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });

  passport.use(
    "github",
    new githubService(
      {
        clientID: "Iv1.685415c5dac6b4dc",
        clientSecret: "9474d0df884ab5952a23890561a7a0508fd176d0",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const user = await userModel.findOne({email: profile._json.email});
          if (!user) {
            const newUser = {
              firstName: profile._json.name,
              lastName: "",
              email: profile._json.email,
              password: "",
            };
            const result = await userModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new localStrategy(
      {passReqToCallback: true, usernameField: "email"},
      async (req, username, password, done) => {
        const {firstName, lastName, email} = req.body;
        try {
          const user = await userModel.findOne({email: username});
          if (user) {
            console.log("The user is already registered");
            return done(null, false);
          }
          const newUser = {
            firstName,
            lastName,
            email,
            password: createHash(password),
          };
          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error getting user" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      {passReqToCallback: true, usernameField: "email"},
      async (req, username, password, done) => {
        try {
          const user = await userModel.findOne({email: username});
          if (!user) {
            console.log("The user don't exist");
            return done(null, false);
          }
          if (!isCorrect(user, password)) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initPassport;
