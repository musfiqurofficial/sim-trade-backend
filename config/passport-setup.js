const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // Adjust the callback URL based on your setup
    },
    (accessToken, refreshToken, profile, done) => {
      // Save user data to the database or retrieve existing user
      // For simplicity, let's assume your User model has a function `findOrCreate`
      User.findOrCreate({ googleId: profile.id }, (err, user) => {
        return done(err, user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Retrieve user from the database based on id
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
