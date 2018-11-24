var jq = document.createElement('script');
jq.src = "https://code.jquery.com/jquery-3.3.1.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

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

function start(){
    var my_timeout = setInterval(save_datas, 600000 );
    console.log("[INFO] Autosaver addon launched !");
}

var my_addon = setTimeout(start, 2000);