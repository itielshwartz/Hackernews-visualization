var firstLoad = true;

var show = function (id) {
    document.getElementById(id).style.display = 'block';
}
var hide = function (id) {
    document.getElementById(id).style.display = 'none';
    //First boot
    if (id == 'popup2' && firstLoad) {
        $("#new-button").click();
        $("#new-button").focus();
        firstLoad = false;

    }
}

var visible = function (id) {
    document.getElementById(id).style.visibility = 'visible';
}
var hidden = function (id) {
    document.getElementById(id).style.visibility = 'hidden';
}

$(document).click(function (event) {
    if ($(event.target)[0] === $('.faq-wrapper')[0]) {
        hide('popup2')
    }

})