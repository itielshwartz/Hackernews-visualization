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


$(document).keyup(function (e) {
    if (e.keyCode == 27 && document.getElementById('popup2').style.display == 'block') { // escape key maps to keycode `27`
        hide('popup2')
    }
});

$('.story-type').click(function () {
    if (this.id !== "story-search-box") {
        $('.story-type').removeClass('active');
        $(this).addClass('active');
        console.log(this);
    }
});

$('.story-type').keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        $("#story-search-button").click();
    }
});