var signinDetails={
    email:"",
    password:""
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    // console.log(expires);
    document.cookie = cname + "=" + cvalue + ";" + expires;
}

function handleinChange(e){
    // console.log(e.name,e.value);
    signinDetails[e.name]=e.value
}

function validatein(e){
    // console.log("validating "+e+" "+signinDetails[e]);
    if(signinDetails[e]!==""){
        // console.log(e+" not empty");
        signinDetails[e]=signinDetails[e].trim()
        return true
    }else{
        return false
    }
}
    
function signin(e){
// console.log(signinDetails);

e.preventDefault()
var keys=["password","email"]
var validated=true;
keys.map(item=>{
// console.log(item);
    if(!validatein(item)){
        // console.log(item+" not validated");
        validated=false
    }
    // console.log(item+" validated");
})

if(signinDetails["password"].length<6){
    validated=false
}
    
if(validated){
    // console.log("validated");
    showload()
    fetch('/setcookie', {
    method: 'post',
    body : JSON.stringify({
        signinDetails
    }),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    }).then(res=>res.json())
    .then(res=>{
        // console.log(res.mes);
        if(res.mes==="Done"){
            location.replace("/login")
        }else{
            // console.log("Activate");
        }
    })
}else{
    // console.log("Empty Fields");
}
}