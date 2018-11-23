var jq = document.createElement('script');
jq.src = "https://code.jquery.com/jquery-3.3.1.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
// ... give time for script to load, then type (or see below for non wait option);
jQuery.noConflict();


function save_datas(){
    $.ajax({
        url: "http://localhost:2018",
        data: { 
            save : Game.WriteSave(1)
        },
        cache: false,
        type: "GET",
        success: function(response) {

        },
        error: function(xhr) {

        }
    });
}


var my_timeout = setInterval(save_datas, 60000 );

//clearInterval(my_timeout);

/*javascript:(function() {
    Game.LoadMod('https://aktanusa.github.io/CookieMonster/CookieMonster.js');
}());*/

//$("#commentsText").style.display = "none"