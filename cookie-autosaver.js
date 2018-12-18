/**
 * Cookie Auto Saver
 * By Hackbug
 * Server
 */


 /**
  * Modules dependencies
  */
var express         = require('express')
  , http            = require('http')
  , logger          = require('logger')
  , fs              = require('fs')
  , props_reader    = require('properties-reader')
;

/**
 * default value and constants
 */
var port            =   2018;
var max_save_files  =   10;
var save_folder     =   __dirname + '\\saves\\';
var properties_file =   __dirname + '\\conf.properties';

/**
 * Colors
 */
var Reset       = "\x1b[0m";
var Bright      = "\x1b[1m";
var Dim         = "\x1b[2m";
var Underscore  = "\x1b[4m";
var Blink       = "\x1b[5m";
var Reverse     = "\x1b[7m";
var Hidden      = "\x1b[8m";

var FgBlack     = "\x1b[30m";
var FgRed       = "\x1b[31m";
var FgGreen     = "\x1b[32m";
var FgYellow    = "\x1b[33m";
var FgBlue      = "\x1b[34m";
var FgMagenta   = "\x1b[35m";
var FgCyan      = "\x1b[36m";
var FgWhite     = "\x1b[37m";

var BgBlack     = "\x1b[40m";
var BgRed       = "\x1b[41m";
var BgGreen     = "\x1b[42m";
var BgYellow    = "\x1b[43m";
var BgBlue      = "\x1b[44m";
var BgMagenta   = "\x1b[45m";
var BgCyan      = "\x1b[46m";
var BgWhite     = "\x1b[47m";

/**
 * function get now date and time
 */
function getNow(){
    var date    = new Date(); 
    var day     = date.getDate();
    var month   = date.getMonth()+1;
    var year    = date.getFullYear();
    var hours   = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    
    day     =  (day < 10)       ? day       : "0" + day;
    month   =  (month < 10)     ? month     : "0" + month;
    hours   =  (hours < 10)     ? hours     : "0" + hours;
    minutes =  (minutes < 10)   ? minutes   : "0" + minutes;
    seconds =  (seconds < 10)   ? seconds   : "0" + seconds;
    
    return year + "-" + month + "-" + day + " " + hours + "-" + minutes + "-" + seconds;
}

/**
 * Rotate the X last files
 */
function rotate(){
    console.log("----------- ROTATE (" + max_save_files + ") -----------");
    fs.readdir(save_folder, function(err, items) {
        if(err){
            logger.error(err);
            if (!fs.existsSync(save_folder)){
                logger.info('Creating : ' + save_folder);
                fs.mkdirSync(save_folder, (err) => {
                    logger.error(err);
                    throw err;
                });
                rotate();
                return;
            }
        }
        
        //console.log(items);
     
        if(items.length > max_save_files){
            var remove_file = save_folder + items[0];
            logger.info('Remove : ' + remove_file)
            fs.unlinkSync(remove_file, (err) => {
                if(err){
                    logger.error(err);
                    //throw err;
                }
            });
            rotate();
        }
    });
}

/**
 * Apply all properties to the server
 * This function must be called before the server start
 */
function apply_properties(props){
    console.log("[INFO] Read properties :");
    props.each((key, value) => {
        console.log("[" + key + "] : " + value);
    })

    var props_port          = props.get('server.port');
    var props_save_folder   = props.get('server.save.folder');
    var props_save_limit    = props.get('server.save.limit');

    if(props_port)
        port = props_port;
    if(props_save_folder)
        save_folder = props_save_folder;
    if(props_save_limit
        && props_save_limit > 0)
        max_save_files = props_save_limit;
}

/**
 * Main execution
 */
logger = logger.createLogger();
var properties = props_reader(properties_file);
apply_properties(properties);

var app = express();
app.set('port', process.env.PORT || port);

http.createServer(app).listen(app.get('port'), function(){
  logger.info('Express server listening on port ' + app.get('port'));
  logger.info('Startup completed');
  rotate();
});

app.get('/', function(req, res){

    /* Allow cross origin */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");


    var save = req.query.save;
    if(!save){
        logger.error('[ERROR] Any save received');
        res.sendStatus(400);
        return;
    }
    var file_path = save_folder + getNow() + '.cc';

    logger.info('SAVE into ' + file_path);

    /* Write the save */
    fs.writeFile(file_path, save, function(err){
        if(err){
            logger.error('Writing save failed');
            res.sendStatus(400);
        } else {
            logger.info('Writing save success');
            res.sendStatus(200);
            rotate();
        }
    });
});

app.listen();