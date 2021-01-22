var signinDetails={
    email:"",
    password:""
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    console.log(expires);
    document.cookie = cname + "=" + cvalue + ";" + expires;
}

function handleinChange(e){
    signinDetails[e.name]=e.value
}

function validatein(e){
    console.log("validating "+e+" "+signinDetails[e]);
    if(signinDetails[e]!==""){
        console.log(e+" not empty");
        signinDetails[e]=signinDetails[e].trim()
        return true
    }else{
        return false
    }
}
    
function signin(e){
console.log(signinDetails);

e.preventDefault()
var keys=["password","email"]
var validated=true;
keys.map(item=>{
console.log(item);
    if(!validatein(item)){
        console.log(item+" not validated");
        validated=false
    }
    console.log(item+" validated");
})

if(signinDetails["password"].length<6){
    validated=false
}
    
if(validated){
    fetch('/login', {
    method: 'post',
    body : JSON.stringify({
        signinDetails
    }),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    }).then((res) => res.json())
    .then((json) => {
    console.log(json.mes);
        if(json.mes==="Welcome"){
            setCookie("useremail", signinDetails["email"],30);
            location.href="profile.html"
        }
    })
    .catch((error) => {
    console.error(error);
    });
    }else{
        console.log("Empty Fields");
    }
}