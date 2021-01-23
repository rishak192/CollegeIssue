function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
}

function logout(){
    console.log("Logout");
    setCookie("useremail", null, 0);
    setCookie("username", null, 0);
    setCookie("uid",null,0)
    location.replace("homepage.html")
}