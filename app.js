
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
};
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync');
const ExpressError=require('./utils/ExpressError');
const session=require('express-session');
const { MongoStore } = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');


const listings=require('./routes/listing');
const reviews=require('./routes/review');
const users=require('./routes/user');
const dbURL = process.env.ATLASDB_URL;


const store=MongoStore.create({
    mongoUrl: dbURL,
    dbName: 'wanderlust',
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo store");
});
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
};
app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session( ));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user || null;
    next();
});

app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
const path=require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended:true}));

//user routes
app.use("/", users);


//listing routes
app.use("/listings", listings);

//review routes
app.use("/listings/:id/reviews", reviews);



//error handling middleware
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
   let {statusCode=500 ,message="Something went wrong"} = err;
   console.log(message,statusCode);
    res.status(statusCode).render('error.ejs', {statusCode, message});
}  );

async function startServer() {
    if (!dbURL) {
        throw new Error('ATLASDB_URL is missing. Check your environment configuration.');
    }

    await mongoose.connect(dbURL, { dbName: 'wanderlust' });
    console.log('MongoDB connected to the wanderlust database');

    app.listen(8080, () => {
        console.log('Server is running on port 8080');
    });
}

startServer().catch((err) => {
    const message = String(err.message).replace(/mongodb(?:\+srv)?:\/\/\S+/gi, '<redacted MongoDB URI>');
    console.error(`Application startup failed: ${err.name}: ${message}`);
    process.exitCode = 1;
});
