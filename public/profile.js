function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    // console.log(expires);
    document.cookie = cname + "=" + cvalue + ";" + expires;
}

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

var reponse;

function updateprofile(){
    var topbar=document.getElementsByClassName("topbar")[0]
    topbar.style.display="none"
    var username=document.getElementsByClassName("name")
    var user=getCookie("useremail")

    fetch(('/userdetails/'+user), {
    method: 'get',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    }).then((res) => res.json())
    .then((json) => {
        console.log(json.mes);
        response=json.mes
        username[0].children[0].children[0].innerHTML=response.name
        setCookie("username",response.name,30)
        setCookie("uid",response._id,30)
        uname=getCookie("username")
        userid=getCookie("uid")
        topbar.style.display="flex"
    })
    .catch((error) => {
        console.error(error);
    });
}

function account(){
    location.href="/account.html"
}


