/**
 * Cookie Auto Saver
 * By Hackbug
 * Addon
 */


/**
 * constantes
 */
var server  = "http://localhost";
var port    = 2018

/**
 * function which load JQuery
 */
function load_jquery(){
    var jq = document.createElement('script');
    jq.src = "https://code.jquery.com/jquery-3.3.1.min.js";
    document.getElementsByTagName('head')[0].appendChild(jq);
}

/**
 * This function send your save to the server
 */
function save_datas(){
    console.log("[INFO] Sending save to " + server + ":" + port + " at : " + new Date);
    $.ajax({
        url         : server + ":" + port,
        data        : { 
                        save : Game.WriteSave(1)
                      },
        cache       : false,
        type        : "GET",
        crossDomain : true,
        dataType    : 'text',
        success     : function(response) {
                        console.log("[INFO] Save success !");
                        Game.Notify('[INFO] Game save succesfully', server);
                      },
        error       : function(xhr) {
                        console.log("[ERROR] Save failed !");
                        console.log(xhr);
                        Game.Notify('[ERROR] Game save failed', server);
                      }
    });
}

/**
 * This function start the automaticaly save
 */
function start(){
    var my_timeout = setInterval(save_datas, 600000);

    key_binding_save();

    console.log("[INFO] Autosaver addon launched !");
}

/**
 * Bind the manully save to the command Ctrl + ²
 */
function key_binding_save(){
    window.addEventListener("keydown", event => {
        if (event.key == "²" && event.ctrlKey) {
            console.log("[INFO] Manual save!");
            save_datas();
        }
    });
}

/**
 * Main execution
 */
load_jquery();
var my_addon = setTimeout(start, 2000);