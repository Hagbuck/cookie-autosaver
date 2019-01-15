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
  , fs              = require('fs')
  , props_reader    = require('properties-reader')
  , body_parser     = require('body-parser')
  , compression     = require('compression')
;

/**
 * default value and constants
 */
var port            =   2018;
var max_save_files  =   10;
var save_folder     =   __dirname + '\\saves\\';
var properties_file =   __dirname + '\\conf.properties';
var web_folder      =   __dirname + '\\public';
var users_file      =   __dirname + '\\users.properties';
var signin_enable   =   false;
var no_login_allow  =   false;

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
 * Create a simply logger
 */
var logger = {
    info_lvl    : true,
    debug_lvl   : true,
    error_lvl   : true,

    info: function(str){
        if(this.info_lvl)
            console.log(Bright + FgGreen + '[INFO]\t ' + str + Reset);
    },
    debug: function(str){
        if(this.debug_lvl)
            console.log(Bright + FgCyan + '[DEBUG]\t ' + str + Reset);
    },
    error: function(str){
        if(this.error_lvl)
            console.error(Bright + FgRed + '[ERROR]\t ' + str + Reset);
    }
};

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
    
    day     =  (day >= 10)       ? day       : "0" + day;
    month   =  (month >= 10)     ? month     : "0" + month;
    hours   =  (hours >= 10)     ? hours     : "0" + hours;
    minutes =  (minutes >= 10)   ? minutes   : "0" + minutes;
    seconds =  (seconds >= 10)   ? seconds   : "0" + seconds;
    
    return year + "-" + month + "-" + day + " " + hours + "-" + minutes + "-" + seconds;
}

/**
 * Rotate the X last files
 */
function rotate(folder, full_rotate = false){
    logger.debug("----------- ROTATE (" + folder + ':' + max_save_files + ") -----------");
    fs.readdir(folder, function(err, items) { // Read dir with option object instead of string
        if(err){
            logger.error(err);
            if (!fs.existsSync(folder)){
                logger.info('Creating : ' + folder);
                fs.mkdirSync(folder, (err) => {
                    logger.error(err);
                    return
                    //throw err;
                });
                rotate();
                return;
            }
        }
        
        /** Remove folder : dirty way, to change ! **/
        for(var i = 0; i < items.length; ++i){
            if(fs.lstatSync(folder + '\\' + items[i]).isDirectory()){
                if(full_rotate)
                    rotate(folder + items[i]);
                items.splice(i, 1);
                --i;
            }
        }

        if(items.length > max_save_files){
            var remove_file = folder + items[0];
            logger.debug('Remove : ' + remove_file)
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
    var props_port          = props.get('server.port');
    var props_save_folder   = props.get('server.save.folder');
    var props_save_limit    = props.get('server.save.limit');
    var props_signin_enable = props.get('server.signin.enable');
    var props_users_file    = props.get('server.users.file');
    var props_nologin_allow = props.get('server.nologin.allow');

    if(props_port)
        port = props_port;
    if(props_save_folder)
        save_folder = props_save_folder + '\\';
    if(props_save_limit
        && props_save_limit > 0)
        max_save_files = props_save_limit;
    if(props_signin_enable)
        signin_enable = props_signin_enable;
    if(props_users_file)
        users_file = props_users_file;
    if(props_nologin_allow)
        no_login_allow = props_nologin_allow;
}

/**
 * Read all properties from a properties object
 */
function read_all_properties(props){
    props.each((key, value) => {
        logger.debug("[" + key + "] : " + value);
    });
}

/**
 * Write an entry into a file
 * Used for write a new user into the properties file
 */
function write_entry_into_file(entry, file){
    fs.appendFile(file, entry, function (err) {
        if (err) {
            logger.error(err);
        }
    });  
}

/**
 * Create a file path
 */
function create_file_path(file){
    var dir = file.substr(0, file.lastIndexOf('\\'));

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

/**
 * Check if a user already exists
 */
function check_user_exists(users, username){
    if(users && users.get(username))
        return true;
    return false;
}

/**
 * Check a combinaison user / password
 */
function check_user_password(users, username, password){
    if(users){
        var pw_from_users = users.get(username);
        if(pw_from_users == password)
            return true;
    }
    return false;
}

/**
 * Main execution
 */
var properties;
var users;

try{
    logger.info('Load properties from : ' + properties_file);
    properties = props_reader(properties_file);
    read_all_properties(properties);
    apply_properties(properties);
}catch(err){
    logger.error(err);
}

try{
    logger.info('Load users from : ' + users_file);
    users = props_reader(users_file);
    read_all_properties(users);
}catch(err){
    logger.error(err);
}

var app = express();
var router = express.Router();

app.use(body_parser.json());
app.use(express.static(web_folder));
app.use(compression());

app.set('port', process.env.PORT || port);

http.createServer(app).listen(app.get('port'), function(){
    logger.info('Express server listening on port ' + app.get('port'));
    logger.info('Startup completed');
    rotate(save_folder, true);
});

app.get('/', function(req, res){

    /* Allow cross origin */
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    /* request parameters */
    var save = req.query.save;
    var username = req.query.username;
    var password = req.query.password;

    if(!save){
        logger.error('[ERROR] Any save received');
        res.sendStatus(400);
        return;
    }

    var save_folder_path = save_folder;
    var file_path = save_folder + getNow() + '.cc';

    if(username){
        if(check_user_password(users, username, password)){
            save_folder_path = save_folder + username + '\\';
            file_path = save_folder_path + getNow() + '.cc';
        }
        else{
            logger.debug('Writing save failed : error credentials');
            return res.sendStatus(400);
        }
    } else if(!no_login_allow){
        logger.debug('Writing save failed : Trying to save without login. No loging wirting is disable');
        return res.sendStatus(400);
    }

    logger.debug('SAVE into ' + file_path);

    /* Write the save */
    create_file_path(file_path);
    fs.writeFile(file_path, save, function(err){

        rotate(save_folder_path); // rotate the current folder

        if(err){
            logger.error('Writing save failed');
            return res.sendStatus(400);
        } else {
            logger.debug('Writing save success');
            return res.sendStatus(200);
        }
    });
});

app.get('/signin', function(req, res){
    res.sendFile(__dirname + "/views/signin.html");
});

app.post('/signin', function(req, res){
    /**
     * Response object
     */
    var response = {
        /**
         * Type : success, error, incomplete
         */
        type    : 'success',
        /**
         * msg : some informations about the registration
         */
        msg     : username + ' registration success'
    };

    if(!users || !signin_enable){
        response.type='error';
        response.msg='Signin feature is disable';
        return res.send(response);
    }

    var username = req.body.username;
    var pass1 = req.body.pass1;
    var pass2 = req.body.pass2;

    logger.info('Register ' + username);

    /**
     * Response object
     */
    var response = {
        /**
         * Type : success, error, incomplete
         */
        type    : 'success',
        /**
         * msg : some informations about the registration
         */
        msg     : username + ' registration success'
    };

    if(!username || !pass1 || !pass2){
        response.type = 'incomplete';
        response.msg = 'All yield are not filled';
    }else if(pass1 != pass2){
        response.type = 'error';
        response.msg = 'Password are not the same';
    } else if(check_user_exists(users, username)){
        response.type = 'error';
        response.msg = username + ' already exists';
    }

    if(response.type == 'success'){
        users.set(username, pass1);
        read_all_properties(users);
        write_entry_into_file('\n'+username+'='+pass1, users_file);
    }

    logger.info(response.type + ' : ' + response.msg);
    return res.send(response);
})

app.use("*",function(req,res){
    res.sendFile(__dirname + "/views/404.html");
});

app.listen();