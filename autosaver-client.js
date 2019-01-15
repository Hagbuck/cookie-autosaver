/**
 * Cookie Auto Saver
 * By Hackbug
 * Addon
 */


var Autosaver = {
    version : '0.0.6',

    server  : 'localhost',
    port    : 2018,
    url     : function(){return 'http://' + this.server + ':' + this.port;},

    username: null,
    password: null,

    interval_autosave : 600000
}

/**
 * function which load JQuery
 */
function load_jquery(){
    var jq = document.createElement('script');
    jq.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
    document.getElementsByTagName('head')[0].appendChild(jq);
}

/**
 * This function send your save to the server
 */
function save_datas(){
    $.ajax({
        url         : Autosaver.url(),
        data        : { 
                        save : Game.WriteSave(1),
                        username: Autosaver.username,
                        password: Autosaver.password
                      },
        cache       : false,
        type        : 'GET',
        crossDomain : true,
        dataType    : 'text',
        success     : function(response) {
                        Game.Notify('<p style="color:green;">[INFO] Game save succesfully</p>', Autosaver.url());
                      },
        error       : function(xhr) {
                        Game.Notify('<p style="color:red;">[ERROR] Game save failed<p>', Autosaver.url());
                      }
    });
}

/**
 * This function start the automaticaly save
 */
function start(){
    var my_timeout = setInterval(save_datas, Autosaver.interval_autosave);

    key_binding_save();

    Game.Notify('<p style="color:green;">[INFO] Cookie autosaver '+ Autosaver.version +' loaded</p>', Autosaver.url());
}

/**
 * Bind the manully save to the command Ctrl + ²
 */
function key_binding_save(){
    window.addEventListener('keydown', event => {
        if (event.key == '²' && event.ctrlKey) {
            save_datas();
        }
    });
}

/**
 * Main execution
 */
load_jquery();
var my_addon = setTimeout(start, 2000);