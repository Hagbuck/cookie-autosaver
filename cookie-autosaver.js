/**
 * Cookie Auto Saver
 * By Hackbug
 * 2018-11-23
 */


 /**
  * Modules dependencies
  */
var express = require('express')
  , http    = require('http')
  , logger  = require('logger')
  , fs      = require('fs')
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
    
    return day + "-" + month + "-" + year + " " + hours + "-" + minutes + "-" + seconds;
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
});

app.get('/', function(req, res){
    var save = req.query.save;
    var file_path = save_folder + getNow() + '.cc';

    logger.info('SAVE into ' + file_path);

    fs.writeFile(file_path, save, function(err){
        if(err){
            logger.error('Writing save failed');
        } else {
            logger.info('Writing save success');
            rotate();
        }
    });
    res.end();
});

app.listen();