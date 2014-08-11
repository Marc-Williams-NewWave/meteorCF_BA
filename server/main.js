var sys = Meteor.require('sys');
var exec = Meteor.require('child_process').exec;

var sh = Meteor.require('execSync');

Meteor.publish('apps', function() {
    return Apps.find({});
});

Meteor.publish('services_1', function() {
    return Services.find({});
});

Meteor.publish('plans_1', function() {
    return Plans.find({});
});

Meteor.publish('userList', function() {
    return Meteor.users.find({});
});


Meteor.startup(function () {
    var allUsers = Meteor.users.find({}).fetch();
    for(i = 0; i < allUsers.length; i++){
        console.log(allUsers[i].username + " ||\t" + allUsers[i]._id + "||\t"+ allUsers[i].password + "\n");
    }
    console.log("Checking in on the server side - MW");

//    console.log(Services.find());

//    var result = sh.exec('touch ~/Desktop/fileFromMeteor.doc');
//    console.log("return code " + result.code);
//    console.log("stdout + stderr " + result.stdout);
//    var json = JSON.stringify(eval("(" + result.stdout + ")"));
//    console.log(json);
});

Meteor.methods({
    removeApps : function() {
        console.log("clearing Apps");
        return Apps.remove({});
    },
    removeServices : function() {
        console.log("clearing Services");
        return Services.remove({});
    },

    blah : function(){
      console.log('killing some time');
    },
    sendCommand : function(command){
        Future = Npm.require('fibers/future');

        var myFuture = new Future();

        var result = sh.exec(command);
        console.log("return code " + result.code);
        console.log("stdout + stderr " + result.stdout);
        myFuture.return(result.stdout);
        return myFuture.wait();
    }
});
