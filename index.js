var express=require('express')
var cors=require('cors')
var bodyParser=require('body-parser')
var cookieParser = require('cookie-parser');

var Users=require('./Models/Users')
var QuesAns=require('./Models/QuesAns')

const { ObjectId } = require('mongodb')
const mongoose=require('mongoose')

var app=express()

app.use(cookieParser());
require('dotenv/config')
app.use(cors())

app.use(bodyParser.urlencoded({
  extended: true
}));

const url=process.env.CONNECTION_URL

app.use(bodyParser.json());

app.use(express.static("public"));


mongoose.connect(url,{ useNewUrlParser: true,useUnifiedTopology: true },()=>{
  console.log("Connected");
})

app.get('/',function(req,res){
  res.sendFile(__dirname + '/public/homepage.html');
})

app.post('/postcomment',async (req,res)=>{
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

  await QuesAns.updateOne({ "_id": ObjectId(questionID) },
                { $push: 
                  { 
                    Comments: 
                    {
                        $each: [ commentDocument ],
                        $sort: { DateTime: -1 }
                    } 
                  } 
                }).then(reault=>{
                  res.json({mes:commentDocument});
                })
})

app.post('/postanswer',async (req,res)=>{
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

  console.log(answerDocument);

  var updated=await QuesAns.updateOne({"_id":ObjectId(questionID),"Answers.UploaderID":uploaderID},
                        {$set:{"Answers.$.Answer":answer}}).then(result=>{
                          if(result["n"]===0){
                              QuesAns.updateOne({"_id":ObjectId(questionID)},
                                  {
                                    $push:{
                                      Answers: 
                                      {
                                          $each: [ answerDocument ],
                                          $sort: { DateTime: -1 }
                                      } 
                                  }
                                }).then(result=>{
                                  res.json({mes:answerDocument});
                                })
                          }else{
                            res.json({mes:answerDocument});
                          }
                        })
})

app.post('/recommendation',async (req,res)=>{
  var query=req.body.value
  // value='\\"'+value+'\\"'
  console.log(query);
  

  let result =await QuesAns.aggregate([
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
      ]).then(result=>{
        console.log(result)
        res.json({mes:result})
      })

})

app.post('/search',async (req,res)=>{
  var query=req.body.query
  console.log(query);
  

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
    ]).then(result=>{
      console.log(result)
      res.json({mes:result})
    })

})

app.post('/exact',async (req,res)=>{
  var query=req.body.query
  // query='\\"'+query+'\\"'
  console.log(query);


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
    ]).then(result=>{
      console.log("exact ",result)
      res.json({mes:result})
    });

})

app.get('/addcontent',async (req,res)=>{

    var allques=await QuesAns.find({}).then((result)=>{
      res.json({mes:result})
    })

})

app.post('/postquestion',async (req,res)=>{

  var quesans=new QuesAns(req.body.quesDetails)
  var savedques=await quesans.save().then((result)=>{
    console.log(result);
    res.json({mes:result})
  })

})

app.get('/userdetails/:useremail',async (req,res)=>{
    const email=req.params['useremail']
  
     const user=await Users.findOne({email:email}).then((result)=>{
       console.log("result ",result);
      res.json({mes:result})
     })

})

app.post('/login',async (req,res)=>{

  const email=req.body.signinDetails.email
  const password=req.body.signinDetails.password

  var loggedin=false;
  var user=await Users.findOne({email:email})
  if(user.email===email && user.password===password){
    res.json({mes:"Welcome"})
  }else{
    res.json({mes:User+" Does not exist's!"})
  }

})

app.post('/signup',async (req,res)=>{
  var personDocument=new Users(req.body.signupDetails)

  // console.log(personDocument);

  async function run() {
     try {
          const saveUser=await personDocument.save()
          res.json({mes:saveUser});

         } catch (err) {
          console.log(err.stack);
      }
      finally {
     }
   }
   run().catch(console.dir);
})

app.listen(process.env.PORT || 3005);
