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
    console.log("Checking in on the server side - MW\n\n");

//    sendAppCommand();

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
    sendAppCommand : function(command){
        console.log("received command -> " + command);
//        Future = Npm.require('fibers/future');

//        var myFuture = new Future();

        var result = sh.exec(command);
        console.log("return code " + result.code);
        console.log("stdout + stderr " + result.stdout);
//        myFuture.return(result.stdout);
        var jsonResponse_Apps = result.stdout///
        var appCount = jsonResponse_Apps.resources.length;

        for (i = 0; i < appCount; i++) {
            var appGUID = jsonResponse_Apps.resources[i].metadata.guid;
            var appURL = jsonResponse_Apps.resources[i].metadata.url;
            var appCreatedDate = jsonResponse_Apps.resources[i].metadata.created_at;
            var appUpdatedDate = jsonResponse_Apps.resources[i].metadata.updated_at;
            var appName = jsonResponse_Apps.resources[i].entity.name;
            var appProductionStatus = jsonResponse_Apps.resources[i].entity.production;
            var appMemory = jsonResponse_Apps.resources[i].entity.memory;
            var appInstanceCount = jsonResponse_Apps.resources[i].entity.instances;
            var appDiskQuota = jsonResponse_Apps.resources[i].entity.disk_quota;
            var appState = jsonResponse_Apps.resources[i].entity.state;
            var appPackagestate = jsonResponse_Apps.resources[i].entity.package_state;

            if(Apps.findOne({guid: appGUID}) == undefined){
                Apps.insert({guid: appGUID, url: appURL, created_at: appCreatedDate, updated_at: appUpdatedDate, name: appName,
                    production: appProductionStatus.toString(), memory: appMemory, instance_count: appInstanceCount, diskUsage: appDiskQuota,
                    state: appState, package_state: appPackagestate});
            }
        }


//        return myFuture.wait();
    },
    sendCommand : function(command){
        console.log("received command -> " + command);
        Future = Npm.require('fibers/future');

        var myFuture = new Future();

        var result = sh.exec(command);
        console.log("return code " + result.code);
        console.log("stdout + stderr " + result.stdout);
        myFuture.return(result.stdout);
        return myFuture.wait();
    },
    sendCommand2 : function(command){
        console.log("received command -> " + command);
        Future = Npm.require('fibers/future');

        var myFuture2 = new Future();

        var result = sh.exec(command);
        console.log("return code " + result.code);
        console.log("stdout + stderr " + result.stdout);
        myFuture2.return(result.stdout);
        return myFuture2.wait();
    }
});
