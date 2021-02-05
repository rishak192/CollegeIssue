const express=require('express')
const router=express.Router()
const QuesAns=require('../Models/QuesAns')
const Users=require('../Models/Users')

const cors=require('cors')
const { ObjectId } = require('mongodb')
router.use(cors())
router.use(express.static("public"));

router.post('/postanswer',async (req,res)=>{
    var answer=req.body.ansDetails.Answer
    let uploaderID=req.cookies.usercookie.useremail
    var datetime=req.body.ansDetails.DateTime
    var questionID=req.body.ansDetails.questionID
    var uploaderName=req.cookies.usercookie.username
  
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

router.post('/postcomment',async (req,res)=>{
    var comment=req.body.commentDetails.Comment
    var uploaderID=req.cookies.usercookie.useremail
    var datetime=req.body.commentDetails.DateTime
    var questionID=req.body.commentDetails.QuestionID
    var uploaderName=req.cookies.usercookie.username
  
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

router.post('/postquestion',async (req,res)=>{

    var questionDocument={
      "Question":req.body.quesDetails.Question,
      "UploaderID":req.cookies.usercookie.useremail,
      "UploaderName":req.cookies.usercookie.username,
  }

    var quesans=new QuesAns(questionDocument)
    var savedques=await quesans.save().then((result)=>{
      console.log(result);
      res.json({mes:result})
    })
})

router.get('/account',(req,res)=>{
  res.render('account')
})

module.exports=router
