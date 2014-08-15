var sys = Meteor.require('sys');
var exec = Meteor.require('child_process').exec;

var sh = Meteor.require('execSync');

Meteor.publish('apps', function () {
    return Apps.find({});
});

Meteor.publish('services_1', function () {
    return Services.find({});
});

Meteor.publish('plans_1', function () {
    return Plans.find({});
});

Meteor.publish('userList', function () {
    return Meteor.users.find({});
});


Meteor.startup(function () {
    var allUsers = Meteor.users.find({}).fetch();
    for (i = 0; i < allUsers.length; i++) {
        console.log(allUsers[i].username + " ||\t" + allUsers[i]._id + "||\t" + allUsers[i].password + "\n");
    }
    console.log("Checking in on the server side - MW\n\n");
     Meteor.call('sendCommand', 'cf login -a http://api.192.168.4.14.xip.io -u admin -p password -o newwave -s dev', function(err, output){
         if(output){
             console.log(output);
         }
         if(err){
             console.log(err);
         }
     });

    Meteor.call('sendCommand', 'cf curl /v2/services', function (err, result) {
        if (result) {
            console.log(result);

            var jsonResponse_Services = JSON.parse(result);
            var serviceCount = jsonResponse_Services.resources.length;

            for (i = 0; i < serviceCount; i++) {
                var serviceGUID = jsonResponse_Services.resources[i].metadata.guid; // get service guid
                var serviceURL = jsonResponse_Services.resources[i].metadata.url; // get service url
                var serviceCreatedAt = jsonResponse_Services.resources[i].metadata.created_at; // get service created date
                var serviceUpdatedAt = jsonResponse_Services.resources[i].metadata.updated_at; // get service updated date
                var serviceName = jsonResponse_Services.resources[i].entity.label; // get service name (label)
                var serviceDescription = jsonResponse_Services.resources[i].entity.description; // get service description
                var serviceExtraMetaData = jsonResponse_Services.resources[i].entity.extra; // get service extra metadata
                var serviceBrokerGUID = jsonResponse_Services.resources[i].entity.service_broker_guid; // get service broker guid
                var servicePlansURL = jsonResponse_Services.resources[i].entity.service_plans_url; //get service_plans_url


                if (Services.findOne({guid: serviceGUID}) == undefined) {
                    Services.insert({guid: serviceGUID, url: serviceURL, created_at: serviceCreatedAt, updated_at: serviceUpdatedAt, name: serviceName, description: serviceDescription, extra: serviceExtraMetaData, service_broker_guid: serviceBrokerGUID, service_plan_url: servicePlansURL});
                    var getPlansCommand = 'cf curl ' + servicePlansURL;
                    Meteor.call('sendCommand', getPlansCommand, function (err, planResults) {
                        if (planResults ) {
                            console.log(planResults);
                            var jsonResponse_Plans = JSON.parse(planResults);
                            var planCount = jsonResponse_Plans.resources.length;

                            for (z = 0; z < planCount; z++) {
                                var planGUID = jsonResponse_Plans.resources[z].metadata.guid; // get plan guid
                                var planURL = jsonResponse_Plans.resources[z].metadata.url; // get plan url
                                var planCreatedDate = jsonResponse_Plans.resources[z].metadata.created_at; // get plan creation date
                                var planUpdatedDate = jsonResponse_Plans.resources[z].metadata.updated_at; // get plan updated date

                                var planName = jsonResponse_Plans.resources[z].entity.name; // get plan name
                                var planDescription = jsonResponse_Plans.resources[z].entity.description; // get plan description
                                var planExtraMetaData = jsonResponse_Plans.resources[z].entity.extra; // get plan extar metadata
                                var planServiceGUID = jsonResponse_Plans.resources[z].entity.service_guid; // get plan's service_guid
                                var planServiceURL = jsonResponse_Plans.resources[z].entity.service_url; // get plan's service_url
                                var planServiceInstancesURL = jsonResponse_Plans.resources[z].entity.service_instances_url; // get plan's service_instances_url

                                if (Plans.findOne({guid: planGUID}) == undefined) {
                                    Plans.insert({guid: planGUID, url: planURL, created_at: planCreatedDate, updated_at: planUpdatedDate, name: planName, extra: planExtraMetaData, description: planDescription, service_guid: planServiceGUID, service_url: planServiceURL, service_instances_url: planServiceInstancesURL});
                                }
                            }
                        }
                    });
                }
            }
        }
    });

     Meteor.call('sendCommand', 'cf curl /v2/apps', function (err, result) {
        if (result) {
            console.log(result);

            var jsonResponse_Apps = JSON.parse(result);
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

                if (Apps.findOne({guid: appGUID}) == undefined) {
                    Apps.insert({guid: appGUID, url: appURL, created_at: appCreatedDate, updated_at: appUpdatedDate, name: appName,
                        production: appProductionStatus.toString(), memory: appMemory, instance_count: appInstanceCount, diskUsage: appDiskQuota,
                        state: appState, package_state: appPackagestate});
                }
            }
        }
    });


//    Meteor.call('sendCommand', 'cf curl /v2/service_instances', function(err, output){
//       if(output){
//           var jsonResponse_Provisions = JSON.parse(output);
//           var provisionCount = jsonResponse_Provisions.resources.length;
//
//           for(i = 0; i < provisionCount; i++){
//               var provisionGUID = jsonResponse_Provisions.resources[i].metadata.guid;
//               var provisionUrl = jsonResponse_Provisions.resources[i].metadata.url;
//               var provisionCreatedAt = jsonResponse_Provisions.resources[i].metadata.created_at;
//
//               if(jsonResponse_Provisions.resources[i].metadata.updated_at == null){
//                   var provisionUpdatedAt = null;
//               } else {
//                   var provisionUpdatedAt = jsonResponse_Provisions.resources[i].metadata.updated_at;
//               }
//
//
//
//               var provisionName = jsonResponse_Provisions.resources[i].entity.name;
//               var provisionCredentials = jsonResponse_Provisions.resources[i].entity.credentials;
//               var provisionServicePlanGUID = jsonResponse_Provisions.resources[i].entity.service_plan_guid;
//               var provisionSpaceGUID = jsonResponse_Provisions.resources[i].entity.space_guid;
//               var provisionType = jsonResponse_Provisions.resources[i].entity.type;
//               var provisionSpaceURL = jsonResponse_Provisions.resources[i].entity.space_url;
//               var provisionServicePlanURL = jsonResponse_Provisions.resources[i].entity.service_plan_url;
//               var provisionServiceBindingsURL = jsonResponse_Provisions.resources[i].entity.service_bindings_url;
//
//           }
//       }
//    });




});

Meteor.methods({
    removeApps: function () {
        console.log("clearing Apps");
        return Apps.remove({});
    },
    removeServices: function () {
        console.log("clearing Services");
        return Services.remove({});
    },

    blah: function () {
        console.log('killing some time');
    },
    sendCommand: function (command) {
//        console.log("received command -> " + command);
        Future = Npm.require('fibers/future');

        var myFuture = new Future();

        var result = sh.exec(command);
//        console.log("return code " + result.code);
//        console.log("stdout + stderr " + result.stdout);
        myFuture.return(result.stdout);
        return myFuture.wait();
    },
    sendCommand2: function (command) {
//        console.log("received command -> " + command);
        Future = Npm.require('fibers/future');

        var myFuture2 = new Future();

        var result = sh.exec(command);
//        console.log("return code " + result.code);
//        console.log("stdout + stderr " + result.stdout);
        myFuture2.return(result.stdout);
        return myFuture2.wait();
    }
});
