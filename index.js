var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
const session = require('express-session')

var Users = require('./Models/Users')
var QuesAns = require('./Models/QuesAns')

const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

var app = express()

app.use(cookieParser());
require('dotenv/config')
app.use(cors())

app.use(session({

  // It holds the secret key for session 
  secret: 'Secret',

  // Forces the session to be saved 
  // back to the session store 
  resave: true,

  // Forces a session that is "uninitialized" 
  // to be saved to the store 
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({
  extended: true
}));

const url = process.env.CONNECTION_URL

app.use(bodyParser.json());

app.use(express.static("public"));
app.set('view engine', 'ejs');

const loginRoutes = require('./LoginRoutes/userfunction')


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  // console.log("Connected");
})

app.get('/', (req, res) => {
  // console.log(req.cookies);
  try {
    var user = req.cookies.usercookie.useremail
  } catch (err) {

  }
  if (user !== "" && user !== undefined) {
    res.redirect('/login');
  } else {
    res.redirect('/homepage')
  }
})

app.get('/homepage', function (req, res) {
  // console.log("logout", req.session.login);
  try {
    var user = req.cookies.usercookie.useremail
    res.redirect('/login');
  } catch (err) {
    res.render('homepage');
  }
})

app.use('/login', loginRoutes)

app.post('/setcookie', async (req, res) => {
  // console.log("Setting cookie ", req.body);
  const email = req.body.signinDetails.email
  const password = req.body.signinDetails.password

  var loggedin = false;
  var user = await Users.findOne({ email: email }).then(result => {
    if (result.activated) {
      if (result.email === email && result.password === password) {
        // res.json({mes:"Welcome"})
        // console.log("Logged in");
        req.session.login = true
        res.cookie("usercookie", { userid: result._id, username: result.name, useremail: result.email }, { expire: 400000 + Date.now() })
        res.json({ mes: "Done" })
      } else {
        // res.json({mes:User+" Does not exist's!"})
      }
    } else {
      res.json({ mes: "Not Done" })
    }
  })
})

app.get('/login', async (req, res) => {

  function getDate(datetime) {
    date = new Date(datetime);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return [year, month, dt]
  }

  // console.log("Session", req.session.login);
  var allcontent = []
  var contentDetails = {}
  res.render('profile', { name: req.cookies.usercookie.username, item: 1234 })
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.clearCookie("usercookie")
  res.redirect('/homepage')
})

app.post('/signup', async (req, res) => {
  var personDocument = new Users(req.body.signupDetails)

  async function run() {
    Users.findOne({ email: req.body.signupDetails.email }).then(result => {
      // console.log(result);
      if (result !== null) {
        // console.log("User Existing");
      } else {
        try {
          const saveUser = personDocument.save().then(result => {
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
              }
            });

            var mailOptions = {
              from: 'no reply',
              to: req.body.signupDetails.email,
              subject: 'CollegeIssue account activation.',
              html: '<a href="http://localhost:3005/activate/'
                + result._id +
                '">Click on the link to activate your account.</a>'
            }

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                // console.log(error);
              } else {
                // console.log('Email sent: ' + info.response);
              }
            });
          })

        } catch (err) {
          // console.log(err.stack);
        }
      }
    })
  }
  run().catch(console.dir);
})

app.get('/activate/:id', async (req, res) => {
  var activated = await Users.updateOne({ "_id": ObjectId(req.params.id) },
    { $set: { "activated": true } })
})

app.post('/recommendation', async (req, res) => {
  var query = req.body.value
  // value='\\"'+value+'\\"'
  // console.log(query);


  let result = await QuesAns.aggregate([
    {
      "$search": {
        "autocomplete": {
          "query": query,
          "path": "Question",
          "tokenOrder": "any",
          "fuzzy": {
            "maxEdits": 2,
            "prefixLength": 1,
            "maxExpansions": 256
          }
        }
      }
    },
    {
      $project: {
        "_id": 1,
        "Question": 1
      }
    },
    {
      $limit: 7
    }
  ]).then(result => {
    // console.log(result)
    res.json({ mes: result })
  })

})

app.post('/search', async (req, res) => {
  var query = req.body.query
  // console.log(query);


  let result = await QuesAns.aggregate([
    {
      "$search": {
        "autocomplete": {
          "path": "Question",
          "query": query,
          "tokenOrder": "any",
          "fuzzy": {
            "maxEdits": 2,
            "prefixLength": 1,
            "maxExpansions": 256
          }
        }
      }
    },
    {
      $limit: 7
    }
  ]).then(result => {
    // console.log(result)
    res.json({ mes: result })
  })

})

app.post('/exact', async (req, res) => {
  var query = req.body.query
  // query='\\"'+query+'\\"'
  // console.log(query);


  let result = await QuesAns.aggregate([
    {
      "$search": {
        "autocomplete": {
          "path": "Question",
          "query": query,
          "fuzzy": {
            "maxEdits": 2,
            "prefixLength": 1,
            "maxExpansions": 256
          }
        }
      }
    },
    {
      $limit: 7
    }
  ]).then(result => {
    // console.log("exact ", result)
    res.json({ mes: result })
  });

})

app.get('/addcontent', async (req, res) => {

  var allques = await QuesAns.find({}).then((result) => {
    res.json({ mes: result })
  })

  for (var i = 0; i < reslen; i++) {
    // console.log(i);
    date = getDate(res[i].DateTime)
    contentDetails = {
      question: res[i].Question,
      uid: res[i].UploaderName,
      answer: {},
      comments: {},
      id: res[i]._id,
      count: {
        like: "",
        dislike: ""
      },
      datetime: date[0] + '-' + date[1] + '-' + date[2]
    }

    for (items in res[i]["Answers"]) {
      contentDetails.answer[res[i]["Answers"][items]["UploaderID"]] = res[i]["Answers"][items]
    }
    var allcom = []
    for (items in res[i]["Comments"]) {
      allcom.push(res[i]["Comments"][items])
    }
    contentDetails["comments"] = allcom
    allcontent.push(contentDetails)
  }

})

app.listen(process.env.PORT || 3005);
