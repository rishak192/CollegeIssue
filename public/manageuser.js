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
  
function checkCookie() {
var user=getCookie("useremail");
// console.log(user);
if (user != "") {
    location.replace("/login")
} else {
    
}
}