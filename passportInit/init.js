module.exports = function (app, passport, LocalStrategy, User, bcrypt) {
    passport.use(new LocalStrategy({
        usernameField: 'username',
    },
    function(username, password, done) {
      User.findOne({ username: username }, async function (err, user) {
        if (err) { return done(err); }
        if (user === null) { return done(null, false, {message: 'no user with that email'}); }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'password incorrect'});
            }
        } catch (error) {
            return done(error)
        }
      });
    }
    ));
    
    app.use(passport.initialize()); //set up passport for authentication
    app.use(passport.session()); //use passport setup session

    passport.serializeUser(function(user, done) { //create cookie
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) { //cracks and read cookie
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}