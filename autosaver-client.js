/**
 * constantes
 */
var server = "http://localhost:2018";

function load_jquery(){
    var jq = document.createElement('script');
    jq.src = "https://code.jquery.com/jquery-3.3.1.min.js";
    document.getElementsByTagName('head')[0].appendChild(jq);
}

function save_datas(){
    console.log("[INFO] Sending save to " + server + " at : " + new Date);
    $.ajax({
        url: server,
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
    var my_timeout = setInterval(save_datas, 600000);

    key_binding_save();

    console.log("[INFO] Autosaver addon launched !");


}

function key_binding_save(){
    window.addEventListener("keydown", event => {
        if (event.key == "²" && event.ctrlKey) {
            console.log("Manual save!");
            save_datas();
        }
    });
}

load_jquery();
var my_addon = setTimeout(start, 2000);