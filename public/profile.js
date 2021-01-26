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
    var username=document.getElementsByClassName("name")
    var user=getCookie("useremail")
    // console.log(user);

    fetch(('/userdetails/'+user), {
    method: 'post',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    }).then((res) => res.json())
    .then((json) => {
        // console.log(json.mes);
        response=json.mes[0]
        username[0].children[0].children[0].innerHTML=json.mes[0].name
        setCookie("username",json.mes[0].name,30)
        setCookie("uid",json.mes[0]._id,30)
    })
    .catch((error) => {
        console.error(error);
    });
    // console.log(username[0].children[0]);
}


