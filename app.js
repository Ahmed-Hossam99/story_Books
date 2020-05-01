const keys = require('./config/keys')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const cookiParser = require('cookie-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const { truncate, stripTags, formatDate, select, editIcon } = require('./helpers/hps')
// Load Routes
const AuthRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const storiesRouter = require('./routes/stories');
// const UserModel =
require('./models/User')

const app = express();

// const template = exphbs.compile("{{aString.trim}}");
// const result = template(
//   { aString: "  abc  " },
//   {
//     allowedProtoMethods: {
//       trim: true
//     }
//   }
// );

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(methodOverride('_method'))

// Passport Config
require('./config/passport')(passport);

// Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate,
    select: select,
    editIcon: editIcon
  },
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// cooki parser && express-session
app.use(cookiParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));


// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Global variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
})

// set static folder 
app.use(express.static(path.join(__dirname, 'public')))


// Use Routes
app.use('/auth', AuthRouter);
app.use(indexRouter);
app.use('/stories', storiesRouter);
// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})