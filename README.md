# cookie-autosaver

## What is this ?

**Cookie-autosaver** is Server-client application for cookie clicker to auto save your progress on your hard drive automatically

## How does it work ?

A *node.js* server will run on your computer. His job is to receive your save and store it into a file.

You will add the *client* **addon** into your cookie clicker game. It will send each **X** minutes your actually save to the server.

To be sure the server will not erased your *saved save*, it will keep on your hard drive, **X** last save. It can be usefull in the case which, by accident, you remove your cookie (Ctrl + F5) for exemple.

To save manually, press `Ctrl + ²`

## How can I install it ?

Firstly, download the whole project. 

### Server

Next you have to install Node.js : https://nodejs.org/en/

Start the *Node.js command prompt* and go into the poject folder.

Execute `npm install express http fs logger properties-reader` to install all the dependencies.

By the way, the project should be runnable. Execute `node cookie-autosaver.js` to launch the server.


### Client

Execute simply this command into the console developper tools.

```
javascript:(function() {
    Game.LoadMod('http://hackbug.fr/cookie-autosaver/autosaver-client.js');
}());
```

## What's next ?

As soon as possible, the project will grow :

* Transform the client into a real addon customizable
* To allow the user to easily edit the server parameters