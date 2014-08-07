//var sys = Meteor.require('sys');
//var exec = Meteor.require('child_process').exec;
//
//var sh = Meteor.require('execSync');

Meteor.publish('apps', function() {
    return Apps.find({});
});

Meteor.publish('services', function() {
    return Services.find({});
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
    }

//    blah : function(){
//      console.log('killing some time');
//    },
//    sendCommand : function(){
//        var result = sh.exec('cf curl /v2/service_plans');
//        console.log("return code " + result.code);
//        console.log("stdout + stderr " + result.stdout);
////         Session.set("output", result.stdout);
//
//            return result.stdout;
//
////        return result.stdout;
//    }

});
