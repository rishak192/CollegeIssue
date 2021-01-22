var express=require('express')
var cors=require('cors')
var app=express()
var bodyParser=require('body-parser')

var cookieParser = require('cookie-parser');
const { ObjectId } = require('mongodb')
app.use(cookieParser());


app.use(cors())

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
var path = require("path");
app.use(express.static("public"));

const dbName = "CollegeIssue";

app.get('/',function(req,res){
  res.sendFile(__dirname + '/public/homepage.html');
})

app.post('/postcomment',function(req,res){
  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://rishak192:Mongodb@192@firstproject.8maq4.mongodb.net/CollegeIssue?retryWrites=true&w=majority";
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true});

  var comment=req.body.commentDetails.Comment
  var uploaderID=req.body.commentDetails.UploaderID
  var datetime=req.body.commentDetails.DateTime
  var questionID=req.body.commentDetails.QuestionID
  var uploaderName=req.body.commentDetails.UploaderName

  let commentDocument = {
    "Comment": comment,
    "UploaderID": uploaderID,
    "DateTime":datetime,
    "QuestionID":questionID,
    "UploaderName":uploaderName
  }
  async function run() {
    var allcomments = {}
     try {  
          await client.connect();
          const db = client.db(dbName);

          const col = db.collection("QuesAns");
          // console.log("Started",commentDocument);
          // col.find({"_id": ObjectId(questionID)}).toArray(function (err, result) {
          //   if (err)
          //     throw err

          //   if(result[0]["Comments"]!==undefined){
          //     console.log("comments exists");
          //       for(items in result[0]["Comments"]){
          //         allcomments[items]=result[0]["Comments"][items]
          //       }
          //     }
          //     allcomments[uploaderID]=commentDocument
          //   console.log("allcomments "+allcomments)
          // })

          await col.updateOne({ "_id": ObjectId(questionID) },
                        { $push: { Comments: commentDocument } })

          // console.log("Comment Added");
          res.json({mes:commentDocument});

         } catch (err) {
          console.log(err.stack);
      }
      finally {
         await client.close();
     }  
   }
   run().catch(console.dir);
})

app.post('/postanswer',function(req,res){
  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://rishak192:Mongodb@192@firstproject.8maq4.mongodb.net/CollegeIssue?retryWrites=true&w=majority";
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true});

  var answer=req.body.ansDetails.Answer
  let uploaderID=req.body.ansDetails.uploaderID
  var datetime=req.body.ansDetails.DateTime
  var questionID=req.body.ansDetails.questionID
  var uploaderName=req.body.ansDetails.uploaderName

  var answerDocument = {
    "Answer": answer,
    "UploaderID": uploaderID,
    "DateTime":datetime,
    "QuestionID":questionID,
    "UploaderName":uploaderName
  }
  const uans={
    
  }
  uans[uploaderID]=answerDocument
  async function run() {
    var allanswer = {}
     try {  
          await client.connect();
          const db = client.db(dbName);

          const col = db.collection("QuesAns");
          // console.log("Started",answerDocument);
          // col.find({"_id": ObjectId(questionID)}).toArray(function (err, result) {
          //   if (err)
          //     throw err

          //   if(result[0]["Answers"]!==undefined){
          //     console.log("result exists");
          //       for(items in result[0]["Answers"]){
          //         allanswer[items]=result[0]["Answers"][items]
          //       }
          //     }
          //   allanswer[uploaderID]=answerDocument
          //   console.log("allanswer "+allanswer)
          // })

          var updated=await col.updateOne({"_id":ObjectId(questionID),"Answers.UploaderID":uploaderID},
                                {$set:{"Answers.$.Answer":answer}})

          if(updated["matchedCount"]===0){
            await col.updateOne({"_id":ObjectId(questionID)},
                                {$push:{"Answers":answerDocument}})
          }

          // console.log("Answer Added "+updated);
          res.json({mes:answerDocument});

         } catch (err) {
          // console.log(err.stack);
      }
      finally {
         await client.close();
     }  
   }
   run().catch(console.dir);
})

app.get('/addcontent',function(req,res){
  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://rishak192:Mongodb@192@firstproject.8maq4.mongodb.net/CollegeIssue?retryWrites=true&w=majority";
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true});

  async function run() {
          await client.connect();

          const db = client.db(dbName);

          db.collection("QuesAns").find({}).toArray(function(err, result) {
          if (err) throw err;
            // console.log(result);
            res.json({mes:result})
            // console.log("Done");
        });
      }
    run().catch(console.dir);
})

app.post('/postquestion',function(req,res){
  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://rishak192:Mongodb@192@firstproject.8maq4.mongodb.net/CollegeIssue?retryWrites=true&w=majority";
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true});

  var question=req.body.quesDetails.question
  var uploaderID=req.body.quesDetails.uploaderID
  var datetime=req.body.quesDetails.datetime
  var uploaderName=req.body.quesDetails.uploaderName

  async function run() {
     try {
          await client.connect();
          const db = client.db(dbName);

          const col = db.collection("QuesAns");

          let questionDocument = {
              "Question": question,
              "UploaderID": uploaderID,
              "DateTime":datetime,
              "UploaderName":uploaderName
          }
          // console.log("Started "+questionDocument);
          const p = await col.insertOne(questionDocument);
          
          // console.log("Question Added "+p+" "+p.insertedId);
          res.json({mes:questionDocument});

         } catch (err) {
          // console.log(err.stack);
      }
      finally {
         await client.close();
     }
   }
   run().catch(console.dir);
})

app.post('/userdetails/:useremail',function(req,res){
  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://rishak192:Mongodb@192@firstproject.8maq4.mongodb.net/CollegeIssue?retryWrites=true&w=majority";
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true});
  
    const email=req.params['useremail']
    // console.log(email);
  
    async function run() {
            await client.connect();
            // console.log("Connected correctly to server");
            const db = client.db(dbName);
  
            db.collection("Users").find({email:email}).toArray(function(err, result) {
            if (err) throw err;
              // console.log(result);
              res.json({mes:result})
              // console.log("Done");
          });
        }
     run().catch(console.dir);
})

app.post('/login',function(req,res){
  const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://rishak192:Mongodb@192@firstproject.8maq4.mongodb.net/CollegeIssue?retryWrites=true&w=majority";

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true});

  // console.log(req.body.signinDetails.email);

  const email=req.body.signinDetails.email
  const pass=req.body.signinDetails.password

  // console.log("email and pass" +email,pass);
  var loggedin=false;

  const request=req
  async function run() {
          await client.connect();
          // console.log("Connected correctly to server");
          const db = client.db(dbName);

          db.collection("Users").find({email}).toArray(function(err, result) {
          if (err) throw err;
          // console.log(result);
          for(var i=0;i<result.length;i++){
            // console.log("result email and pass "+result[i].email,result[i].password);
            if(email===result[i].email && pass===result[i].password){
              // redirect to profile page
              // console.log("Logged In");
              res.json({mes:"Welcome"})
              loggedin=true
              // console.log("Logged In ",uname," ",pass," ",result[i].name," ",result[i].password);
            }
          }
          // console.log("Done");
          if(!loggedin){
            // console.log("Does not exist");
            res.json({mes:email+"Does not exist"});
          }
        });
      }
   run().catch(console.dir);
})

app.post('/signup',function(req,res){
  const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://rishak192:Mongodb@192@firstproject.8maq4.mongodb.net/CollegeIssue?retryWrites=true&w=majority";

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true});

  var uname=req.body.signupDetails.username
  var password=req.body.signupDetails.password
  var email=req.body.signupDetails.email

  async function run() {
     try {
          await client.connect();
          // console.log("Connected correctly to server");
          const db = client.db(dbName);

          // Use the collection "people"
          const col = db.collection("Users");

          let personDocument = {
              "name": uname,
              "password": password,
              "email": email
          }

          // Insert a single document, wait for promise so we can read it back
          // console.log("Started");
          const p = await col.insertOne(personDocument);
          // console.log("Done");
          res.json({mes:personDocument});
          // const myDoc = await col.findOne();
          // Print to the console
          // console.log(myDoc);
          // res.send(myDoc)

         } catch (err) {
          console.log(err.stack);
      }
      finally {
         await client.close();
     }
   }
   run().catch(console.dir);
})

app.listen(process.env.PORT || 3005);
