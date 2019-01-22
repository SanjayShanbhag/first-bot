const builder = require('botbuilder');
const http = require('http');
const restify = require('restify');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('Server is running on %s', server.url);
});

var connector = new builder.ChatConnector({
  appId: '18f1b04a-70d4-4438-8d35-c3c7e43040d0',
  appPassword: 'cjIWLD13+_*_jnflaVIB683'
});
var bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());

bot.dialog('/', (session, args) => {
  if (!session.userData.greeting) {
    session.send('Hi! What\'s your name?');
    session.userData.greeting = true;
  } else if(!session.userData.name) {
    getName(session);
  } else if (!session.userData.email) {
    getEmail(session);
  } else if(!session.userData.password) {
    getPassword(session);
  } else {
    session.userData = null;
  }

  session.endDialog();
});


var getName = (session) => {
  name = session.message.text;
  session.userData.name = name;
  session.send(`Hello ${name}, What's your Email ID?`);
};

var getEmail = (session) => {
  email = session.message.text;
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(re.test(email)) {
    session.userData.email = email;
    session.send(`Thank You, ${email}! Set a new Password.`);
  } else {
    session.send(`Please enter a valid email address. For example: xyz@anything.com`);
  }
};

var getPassword = (session) => {
  password = session.message.text;
  var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  if(re.test(password)) {
    session.userData.password = password;
    session.send('Your account has been successfully created, ' + session.userData.name + '!');
    session.userData = null;
  } else {
    session.send('Password is not valid. It must contain atleast 8 characters, 1 number,1 uppercase letter, 1 lowercase letter and 1 special charatcter. Example: abc@123');
  }
};
