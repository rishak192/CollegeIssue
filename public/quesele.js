function ansEle(ques){
    var div=document.createElement("DIV")
    var p=document.createElement("p")
    p.innerText=ques
    div.append(p)
    div.className="contentques"

    return div
}