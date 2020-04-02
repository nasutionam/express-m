const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const config = require('./config/database')
const passport = require('passport')

mongoose.connect(config.database)
const db = mongoose.connection

db.once('open', () => {
    console.log('Connected to mongodb')
})

db.on('error', (error) => {
    console.log('error')
})

const Article = require('./models/article')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

app.use(require('connect-flash')())
app.use((req,res,next) => {
    res.locals.messages = require('express-messages')(req, res)
    next()
})

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

require('./config/passport')(passport) 
app.use(passport.initialize())
app.use(passport.session())
app.get('*', (req, res, next) => {
    res.locals.user = req.user || null
    next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {   
    Article.find({}, (err, articles) => {
        if(err) throw err
        else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            })
        }
    })  
})

const articles = require('./routes/articles')
const users = require('./routes/users')

app.use('/articles', articles)
app.use('/users', users)

app.listen(3000, () => {
    console.log('Server Started on prt 3000')
})