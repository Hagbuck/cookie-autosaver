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
 * constants
 */
var max_save_files  =   10;
var save_folder     =   __dirname + '\\saves\\'

/**
 * function get now date and time
 */
function getNow(){
    var date = new Date(); 
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    
    if (day < 10) {
          day = "0" + day;
    }
    
    if (month < 10) {
          month = "0" + month;
    }
    
    if (hours < 10) {
          hours = "0" + hours;
    }
    
    if (minutes < 10) {
          minutes = "0" + minutes;
    }

    if (seconds < 10) {
          seconds = "0" + seconds;
    } 
    
    return year + "-" + month + "-" + day + " " + hours + "-" + minutes + "-" + seconds;
                    ;
    return datetime;
}

/**
 * function who rotate the X last files
 */
function rotate(){
    console.log("----------- ROTATE -----------");
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
        
        console.log(items);
     
        if(items.length > max_save_files){
            console.log("DELETE ONE FILE");
            var remove_file = save_folder + items[0];
            logger.info('Remove : ' + remove_file)
            fs.unlinkSync(remove_file, (err) => {
                if(err){
                    logger.error(err);
                    throw err;
                }
            });
            rotate();
        }
    });
}

/**
 * Main execution
 */

logger = logger.createLogger();

var app = express();
app.set('port', process.env.PORT || 2018);

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