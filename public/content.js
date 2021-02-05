var allcontent=[]
var contentDetails={
    question:"",
    uid:"",
    answer:{
        
    },
    comments:[],
    id:"",
    count:{
        like:"",
        dislike:""
    },
    datetime:""
}

var load=document.createElement("div")
load.className="load"
document.body.prepend(load)

function showload(){
    load.style.display="block"
}

function hideload(){
    load.style.display="none"
}

function checkEmpty(text){
    if(text!==undefined && text!==""){
        return true
    }else{
        return false
    }
}

// var bodyloading=document.createElement("div")
// bodyloading.className="bodyloading"
// bodyloading.innerHTML="<h1>Loding...</h1>"
// document.body.append(bodyloading)

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    // console.log(decodedCookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

const uid=getCookie("useremail")
var uname=""
var userid=""

// console.log("uid uname userid ",uid,uname,userid);

function getDate(datetime){
    date = new Date(datetime);
            year = date.getFullYear();
            month = date.getMonth()+1;
            dt = date.getDate();

            if (dt < 10) {
                dt = '0' + dt;
            }
            if (month < 10) {
                month = '0' + month;
            }
        return [year,month,dt]
}
showload()
fetch('/addcontent', {
    method: 'get',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    }).then((res) => res.json())
    .then((json) => {
        var reslen=json.mes.length
        var res=json.mes
        for(var i=0;i<reslen;i++){
            // console.log(i);
            date=getDate(res[i].DateTime)
            contentDetails={
                question:res[i].Question,
                uid:res[i].UploaderName,
                answer:{},
                comments:{},
                id:res[i]._id,
                count:{
                    like:"",
                    dislike:""
                },
                datetime:date[0]+'-'+date[1]+'-'+date[2]
            }

            for(items in res[i]["Answers"]){
                contentDetails.answer[res[i]["Answers"][items]["UploaderID"]]=res[i]["Answers"][items]
            }
            var allcom=[]
            for(items in res[i]["Comments"]){
                allcom.push(res[i]["Comments"][items])
            }
            contentDetails["comments"]=allcom      
            allcontent.push(contentDetails)
        }
        addContent(allcontent)
        hideload()
})

function askDropdown(){
    // if(uid!==""){
        var drop=document.getElementById("dropdown")
        var ask=document.getElementsByClassName("ask")[0].children[0]
        if(drop.style.display==="block"){
            drop.style.display="none"
            ask.style.boxShadow="none"
        }else{
            drop.style.display="block"
            ask.style.boxShadow="0px 0px 1px 2px red;"
        }
    // }else{
    //     var login=document.getElementsByClassName("login")[0]
    //     login.children[0].innerText="Login to post question's!"
    //     login.style.display="block"
    //     var allrec=document.getElementsByClassName("allrec")[0]
    //     allrec.style.top="71px"
    // }
}

function quesEle(ques){
    var div=document.createElement("DIV")
    var p=document.createElement("p")
    p.innerText=ques
    div.append(p)
    div.className="contentques"

    return div
}

function timeEle(time){
    var div=document.createElement("DIV")
    var p=document.createElement("p")
    p.innerText=time
    div.append(p)
    div.className="contenttime"

    return div
}

function datetimeEle(datetime){
    var div=document.createElement("DIV")
    var p=document.createElement("p")
    p.innerText=datetime
    div.append(p)
    div.className="contentdate"

    return div
}

function completeAns(ans,item){
    // console.log(item);
    var cans=document.createElement("div")
    cans.className="cans"

    var ansddiv=document.createElement("div")
    ansddiv.className="ansddiv"

    var ansdatediv=document.createElement("div")
    var add=document.createElement("p")
    var date=getDate(ans[item]["DateTime"])
    add.innerText=date[0]+'-'+date[1]+'-'+date[2]
    ansdatediv.append(add)

    var uploaderdiv=document.createElement("div")
    var uid=document.createElement("p")
    uid.innerText=item
    uploaderdiv.append(uid)

    var anscontaindiv=document.createElement("div")
    anscontaindiv.className="anscontaindiv"

    ansddiv.append(uploaderdiv,ansdatediv)
    var p=document.createElement("p")
    p.innerText=ans[item]["Answer"]
    anscontaindiv.append(p)
    cans.append(ansddiv,anscontaindiv)

    return cans
}

function ansEle(ans,id){
    // console.log("Answersss ",ans);
    var ansContainer=document.createElement("div")
    ansContainer.className="ansContainer"

    var hideans=document.createElement("DIV")
    hideans.className="hideans"

    var hideansp=document.createElement("P")
    

    var ansp=document.createElement("P")
    

    hideans.append(hideansp,ansp)

    var contentans=document.createElement("DIV")
    contentans.className="contentans"
    if(Object.keys(ans).length === 0 && ans.constructor === Object){
        hideansp.innerText="No Answer"
        ansp.innerText="Click + to add Answer"
    }else{
        hideansp.innerText="-"
        ansp.innerText="Hide Answer"
        hideans.addEventListener('click',function(){
            var ha=document.getElementById(id);
            var ac=ha.getElementsByClassName("contentans")[0]
            if(ac.style.display==="none"){
                ac.style.display="block"
                hideansp.innerText="-"
                ansp.innerText="Hide Answer"
            }else{
                ac.style.display="none"
                hideansp.innerText="+"
                ansp.innerText="Show Answer"
            }
        })
    }

    for(item in ans){
        // console.log(ans[item]);
        contentans.append(completeAns(ans,item))
    }

    ansContainer.append(hideans,contentans)

    return ansContainer
}

function countEle(count){
    var div=document.createElement("DIV")
    var likeh3=document.createElement("H3")
    var total=document.createElement("h4")
    var dislikeh3=document.createElement("H3")
    likeh3.innerText="+"
    total.innerText="10"
    dislikeh3.innerText="-"
    div.append(likeh3)
    div.append(total)
    div.append(dislikeh3)
    div.className="contentcount"

    return div
}

function insertAns(id){
    var insans=document.createElement("DIV")
    insans.className="insans"
    var p=document.createElement("P")
    p.innerText="+"
    insans.append(p)

    p.addEventListener("click",function(){
        // if(uid!==""){
            var allc=document.getElementById(id)
            var ansform=allc.children[0].children[1].children[3]
            if(ansform.style.display==="flex"){
                ansform.style.display="none"
                ansform.style.boxShadow="none"
                p.style.boxShadow="none"
            }else{
                ansform.style.display="flex"
                ansform.style.boxShadow="rgba(0, 0, 0, 0.56) 0px 1px 4px 2px"
                p.style.boxShadow="rgba(0, 0, 0, 0.56) 0px 0px 10px 5px"
            }
        // }else{
        //     var login=document.getElementsByClassName("login")[0]
        //     login.children[0].innerText="Login to add an answer!"
        //     login.style.display="block"
        //     var allrec=document.getElementsByClassName("allrec")[0]
        //     allrec.style.top="71px"
        // }
    })

    return insans
}

function createSinans(ans){
    var sans=document.createElement("P")
    sans.innerText=ans

    return sans
}

var ansDetails={
    Answer:"",
    uploaderID:"",
    questionID:"",
    DateTime:"",
    uploaderName:""
}

function updateAns(id,answer,ele){
    var updatedAns={}
    // console.log("Updating");
    var d = new Date();
    ansDetails["Answer"]=answer
    ansDetails["DateTime"]=d
    ansDetails["questionID"]=id

    // console.log(ansDetails);

    fetch('/login/postanswer', {
    method: 'post',
    body : JSON.stringify({
        ansDetails

    }),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    }).then((res) => res.json())
    .then((json) => {
        var useremail=json.mes.UploaderID
        ansDetails["uploaderName"]=json.mes.UploaderName
        updatedAns[useremail]=ansDetails
        var newans=document.getElementById(id).children
        var comparer=newans[0].getElementsByClassName("ansddiv")
        var done=false
        for(var i=0;i<comparer.length;i++){
            if(comparer[i].children[0].children[0].innerText===useremail){
                newans[0].getElementsByClassName("anscontaindiv")[i].children[0].innerText=answer
                done=true
            }
        }
        if(!done){
            ele.prepend(completeAns(updatedAns,useremail))
        }
        hideload()
    })
    .catch((error) => {
        console.error(error);
    });
}

var quesDetails={
    "Question":"",
    "UploaderID":"",
    "UploaderName":"",
}

function handleChange(e){
    quesDetails["Question"]=e.value
}

function postques(e){
    // console.log(quesDetails);
    showload()
    e.preventDefault()
    var d = new Date();
    var userid=getCookie("uid");

    quesDetails["Question"]=quesDetails["Question"].trim()

    fetch('/login/postquestion', {
    method: 'post',
    body : JSON.stringify({
        quesDetails
    }),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    }).then((res) => res.json())
    .then((json) => {
        location.reload()
    })
    .catch((error) => {
        console.error(error);
    });
}

function ansForm(id){
    var form='<div class="ansinput"><input type="text" placeholder="Answer..."></div><div class="ansbtn"><Button>Add Answer</Button></div>'
    var ansform=document.createElement("DIV")
    ansform.className="ansform"
    ansform.innerHTML=form

    var ch=ansform.children

    ch[1].children[0].addEventListener("click",function(){
        var appender=document.getElementById(id)
        var text=ch[0].children[0].value
        // console.log(appender.children[0].children[1].children[2].children);
        if(checkEmpty(text)){
            updateAns(id,text.trim(),appender.getElementsByClassName("contentans")[0])
            showload()
        }else{
            alert("Please fill empty fields!")
        }
        
    })

    return ansform
}

function questionUploader(uid){
    var quesUploader=document.createElement("div")
    quesUploader.className="quesuploader"
    var p=document.createElement("p")
    p.innerText=uid

    quesUploader.append(p)

    return quesUploader
}

function createContent(uid,id,ques,ans,comments,count,datetime){
    var atributes=["className","id","value","innerText"]
    var content=document.createElement("DIV")
    var atd=document.createElement("DIV")
    var dt=document.createElement("DIV")
    var allcontent=document.createElement("DIV")
    allcontent.id=id
    dt.append(questionUploader(uid),datetimeEle(datetime))
    dt.className="dt"
    atd.append(dt,quesEle(ques),ansEle(ans,id),ansForm(id),bottombar(id),commentBox(id))
    atd.className="atd"

    var ceinsans=document.createElement("DIV")
    ceinsans.className="ceinsans"
    ceinsans.append(countEle(count),insertAns(id))

    content.append(ceinsans,atd)
    content.className="content"
    allcontent.className="allcontent"
    allcontent.append(content,showComment(comments))
    return allcontent
}

function addContent(allcontent){
    var main=document.getElementsByClassName("subcontent")[0]
    if(allcontent!==undefined){
        for(var i=0;i<allcontent.length;i++){
            main.append(createContent(allcontent[i].uid,allcontent[i].id, allcontent[i].question,
                                      allcontent[i].answer,allcontent[i].comments, allcontent[i].count,
                                      allcontent[i].datetime))
        }
    }
}


function createAns(id,ans,count,time,date){
    var atributes=["className","id","value","innerText"]
    var content=document.createElement("DIV")
    var atd=document.createElement("DIV")
    var allcontent=document.createElement("DIV")
    var dt=document.createElement("DIV")
    allcontent.id=id
    dt.append(dateEle(date),timeEle(time))
    dt.className="dt"
    atd.append(dt,ansEle(ans,id),bottombar(id),commentBox(id))
    atd.className="atd"
    content.append(countEle(count),atd)
    content.className="content"
    allcontent.className="allcontent"
    allcontent.append(content,showComment("Rishak"))
    return allcontent
}

function onlyAns(){
    // console.log("adding");
    var content=["apple","banana","mango","watermelon","guava","grape","litchi","muskmelon"]
    var main=document.getElementsByClassName("subcontent")[0]

    main.append(createAns(0,"fgdfgdssssssssssssssssssddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddfg",{like:5,dislike:6},"sdfsdf","SDfsdfsdf")
                ,createAns(1,"fgdfgdssssssssssssssssssddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddfg",{like:5,dislike:6},"sdfsdf","SDfsdfsdf")
                ,createAns(2,"fgdfgdssssssssssssssssssddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddfg",{like:5,dislike:6},"sdfsdf","SDfsdfsdf")
                ,createAns(3,"fgdfgdssssssssssssssssssddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddfg",{like:5,dislike:6},"sdfsdf","SDfsdfsdf")
                ,createAns(4,"fgdfgdssssssssssssssssssddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddfg",{like:5,dislike:6},"sdfsdf","SDfsdfsdf")
                ,createAns(5,"fgdfgdssssssssssssssssssddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddfg",{like:5,dislike:6},"sdfsdf","SDfsdfsdf")
                ,createAns(6,"fgdfgdssssssssssssssssssddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddfg",{like:5,dislike:6},"sdfsdf","SDfsdfsdf")
                ,createAns(7,"fgdfgdssssssssssssssssssddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddfg",{like:5,dislike:6},"sdfsdf","SDfsdfsdf")
                )
}

function comment(id){
    var comdiv=document.createElement("DIV")
    comdiv.className="comment"
    comdiv.innerText="Comment"
    comdiv.addEventListener("click",function(){
            var ele=document.getElementById(id)
            var cb=ele.getElementsByClassName("commentbox")[0]
            var scc=ele.getElementsByClassName("showcomment")[0]
            if(cb.style.display==="block"){
                cb.style.display="none"
                scc.style.display="none"
                comdiv.style.boxShadow="none"
            }else{
                cb.style.display="block"
                scc.style.display="block"
                comdiv.style.boxShadow="rgba(0, 0, 0, 0.56) 0px 1px 4px 2px"
            }
    })

    return comdiv
}

function postcomment(comment,id){
    showload()
    var datetime=new Date()
    var commentDetails={
        Comment:comment,
        UploaderID:uid,
        QuestionID:id,
        DateTime:datetime,
        UploaderName:uname
    }

    fetch('/login/postcomment', {
    method: 'post',
    body : JSON.stringify({
        commentDetails

    }),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    }).then((res) => res.json())
    .then((json) => {
        insertCom(commentDetails,id)
    })
    .catch((error) => {
        console.error(error);
    });
}

function commentBox(id){
    var cb=document.createElement("DIV")
    cb.className="commentbox"

    var form='<div class="insertcom"><div class="cominput"><input type="text" placeholder="Comment..."></div><div class="combtn"><Button>Post Comment</Button></div></div>'
    cb.innerHTML=form
    // console.log("cb ",cb.children);

    cb.children[0].children[1].children[0].addEventListener("click",function(){
        // if(uid!==""){
            var comvalue=cb.children[0].children[0].children[0].value
            if(checkEmpty(comvalue)){
                postcomment(comvalue.trim(),id)
                showload()
            }
        // }
        // else{
        //     var login=document.getElementsByClassName("login")[0]
        //     login.children[0].innerText="Login to post a comment!"
        //     login.style.display="block"

        //     var allrec=document.getElementsByClassName("allrec")[0]
        //     allrec.style.top="71px"
        // }
    })
    return cb
}

function bottombar(id){
    var atributes=["className","id","value","innerText"]
    var bottombar=document.createElement("DIV")
    bottombar.className="bottombar"
    bottombar.append(comment(id))

    return bottombar
}

function addComment(comment){
    var sc=document.createElement("DIV")
    sc.id=comment["UploaderID"]
    var p=document.createElement("p")
    var n=document.createElement("P")
    var ddiv=document.createElement("div")
    var d=document.createElement("p")
    sc.className="singlecomment"
    p.className="com"
    n.className="commenter"
    ddiv.className="comdetails"
    p.innerText=comment["Comment"]
    n.innerText=comment["UploaderName"]

    var date=getDate(comment["DateTime"])
    d.innerText=date[0]+'-'+date[1]+'-'+date[2]
    ddiv.append(n,d)
    sc.append(ddiv,p)

    return sc
}

function insertCom(comment,id){
    var sc=document.getElementById(id)
    scc=sc.children[1]
    // console.log(sc.children[1]);

    scc.prepend(addComment(comment))
    hideload()
}

function showComment(comments){
    var div=document.createElement("DIV")
    div.className="showcomment"
    
    for(item in comments){
        div.append(addComment(comments[item]))
    }

    return div
}

var search=document.getElementsByClassName("search")[0].children

function recommendedText(id,text){
    var rtext=document.createElement("div")
    rtext.id=id
    var p=document.createElement("p")
    p.innerText=text
    rtext.append(p)
    rtext.addEventListener('click',function(){
        if(id!=="-1"){
            exactSearch(text)
        }else{
            removeRecommentdations()
            // console.log("Add your question!");
        }
    })
    return rtext

}

function exactSearch(query){
    removeRecommentdations()
    if(query!=="" && query!=undefined){
        showload()
        clearContent()
        fetch('/exact', {
            method: 'post',
            body : JSON.stringify({
                query
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            }).then((res) => res.json())
            .then((json) => {
                addSearchedContent(json,json.mes.length)
                hideload()
        })
    }
}

function clearrec(e){
    removeRecommentdations()
}

// var allrec=document.createElement("div")
// allrec.className="allrec"
// document.body.append(allrec)

var allr=document.getElementsByClassName("allrec")[0]
var rectime;

function recommentdations(event){
    var value=event.value

    removeRecommentdations()

    if(value!==""){
        fetch('/recommendation', {
            method: 'post',
            body : JSON.stringify({
                value
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            }).then((res) => res.json())
            .then((json) => {
                rec=json.mes
                // showRecommentdations(json.mes)
                // console.log(rec);
                removeRecommentdations()
                for(var i=0;i<rec.length;i++){
                        allr.append(recommendedText(rec[i]["_id"],rec[i]["Question"]))
                }
                if(allr.children.length===0){
                    if(rec.length===0){
                            allr.append(recommendedText("-1","Sorry, no result's!"))
                           rectime = setTimeout(() => {
                                removeRecommentdations()
                            }, 1000);
                    }
                }
            })
            .catch((error) => {
                console.error(error);
        });
    }
}

function removeRecommentdations(){
    for(var i=0;i<allr.children.length+i;i++){
        allr.removeChild(allr.childNodes[0])
    }
    clearTimeout(rectime)
}


search[1].addEventListener("click",function(){
    var query=search[0].children[0].value
    searchQuery(query)
})

function searchQuery(query){
    // console.log(query);
    removeRecommentdations()
    if(query!=="" && query!==undefined){
        showload()
        fetch('/search', {
            method: 'post',
            body : JSON.stringify({
                query
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            }).then((res) => res.json())
            .then((json) => {
                hideload()
                clearContent()
                addSearchedContent(json,json.mes.length)
        })
    }
}

function clearContent(){
    var mainsub=document.getElementsByClassName("subcontent")[0]

    for(var i=0;i<mainsub.children.length+i;i++){
        // console.log("Removing");
        mainsub.removeChild(mainsub.childNodes[0])
    }
}

function addSearchedContent(json,size){
    var searchContent=[]
    var searchResult={
        question:"",
        uid:"",
        answer:{
            
        },
        comments:[],
        id:"",
        count:{
            like:"",
            dislike:""
        },
        datetime:""
    }
    var reslen=size
    var res=json.mes
    for(var i=0;i<reslen;i++){
        date=getDate(res[i].DateTime)
        searchResult={
            question:res[i].Question,
            uid:res[i].UploaderName,
            answer:{},
            comments:{},
            id:res[i]._id,
            count:{
                like:"",
                dislike:""
            },
            datetime:date[0]+'-'+date[1]+'-'+date[2]
        }

        for(items in res[i]["Answers"]){
            searchResult.answer[res[i]["Answers"][items]["UploaderID"]]=res[i]["Answers"][items]
        }
        var allcom=[]
        for(items in res[i]["Comments"]){
            allcom.push(res[i]["Comments"][items])
        }
        searchResult["comments"]=allcom      
        searchContent.push(searchResult)
    }
    addContent(searchContent)
}

function toggleAuth(){
    var auth=document.getElementsByClassName("hideauth")[0]
    auth.style.display="block"
}

function showsearch(){
    var search=document.getElementsByClassName("search")[0]

    // var searchform='<div class="search"><div class="stext"><input type="text" placeholder="search..."'+  
    // 'oninput="recommentdations(this)"></div><div class="sbutton"><input type="submit" value="Search" ></div></div>'

    // var hiddenseach=document.getElementsByClassName("hiddensearch")[0]
    // hiddenseach.innerHTML=searchform
    // console.log("show");
}
