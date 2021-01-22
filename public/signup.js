var signupDetails={
    username:"",
    password:"",
    email:"",
}

function handleChange(e){
signupDetails[e.name]=e.value
console.log(e.name+" "+signupDetails[e.name]);
}

function validate(e){
console.log("validating "+e+" "+signupDetails[e]);
if(signupDetails[e]!==""){
    console.log(e+" not empty");
    signupDetails[e]=signupDetails[e].trim()
    return true
}else{
    return false
}
}

function signup(e){
console.log(signupDetails);

e.preventDefault()
var keys=["username","password","email"]
var validated=true;
keys.map(item=>{
console.log(item);
    if(!validate(item)){
        console.log(item+" not validated");
        validated=false
    }
    console.log(item+" validated");
})

if(signupDetails["password"].length<6){
    validated=false
}

if(validated){
    fetch('/signup', {
    method: 'post',
    body : JSON.stringify({
        signupDetails
    }),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    }).then((res) => res.json())
    .then((json) => {
    console.log(json.mes);
    })
    .catch((error) => {
    console.error(error);
    });
    }else{
        console.log("Empty Fields");
    }
}