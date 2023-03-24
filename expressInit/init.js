module.exports = function (app, express, session, flash) {
    app.use(express.static('public'));
    app.use(express.urlencoded({
    extended: true
    }));
    app.set('view engine', 'ejs');
    
    app.use(flash());
    app.use(session({ //initialize session
        secret: "Our little secret.",
        resave: false,
        saveUninitialized: false
    }));
}