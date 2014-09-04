var sys = Meteor.require('sys');
var exec = Meteor.require('child_process').exec;
var sh = Meteor.require('execSync');


Meteor.publish('prod_apps', function () {
    return Prod_Apps.find({});
});

Meteor.publish('prod_services', function () {
    return Prod_Services.find({});
});

Meteor.publish('prod_plans', function () {
    return Prod_Plans.find({});
});

Meteor.publish('prod_provisioned_services', function () {
    return Prod_Provisioned_Services.find({});
});

Meteor.publish('prod_buildpacks', function () {
    return Prod_Buildpacks.find({});
});

Meteor.publish('userList', function () {
    return Meteor.users.find({});
});


//Meteor.publish('retrieved_services', function () {
//    return Retrieved_Services.find({});
//});


Meteor.startup(function () {

    var allUsers = Meteor.users.find({}).fetch();
    for (i = 0; i < allUsers.length; i++) {
        console.log(allUsers[i].username);
    }
    console.log("Checking in on the server side - MW\n\n");
//     Meteor.call('sendCommand', 'cf login -a http://api.192.168.4.14.xip.io -u admin -p password -o newwave-demo -s dev');
//




//    Meteor.call('populateProd_Services');
//    Meteor.call('populateProd_Plans');


    Meteor.call('syncAppsCollections');
    Meteor.call('syncProvisionsCollections');
    Meteor.call('syncServicesCollections');
    Meteor.call('syncPlansCollections');
    Meteor.call('syncBuildpacksCollections');
});

Meteor.methods({
    removeApps: function () {
        console.log("clearing Apps");
        return Prod_Apps.remove({});
    },
    removeServices: function () {
        console.log("clearing Services");
        return Prod_Services.remove({});
    },
    removeProvisions: function(){
        console.log("clearing Provisions");
        return Prod_Provisioned_Services.remove({});
    },
    removePlans: function(){
        console.log("clearing Plans");
        return Prod_Plans.remove({});
    },
    removeProvision: function(guid){
        var prov = Prod_Provisioned_Services.findOne({guid:guid});
        Meteor.call('sendCommandBoolean', 'cf delete-service ' + prov.name + ' -f', function(err, result){
            if(result){
//                Retrieved_Provisioned_Services.remove({guid:guid});
                console.log(result);
                Meteor.call('syncProvisionsCollections');
                return result;
            }
            if(err){
                console.log("ERROR -> " + err);
            }
        });

    },
    sendCommandBoolean: function (command) {
        console.log("received command -> " + command);
        Future = Npm.require('fibers/future');

        var myFuture = new Future();

        var result = sh.exec(command);

        console.log("return code " + result.code);
        console.log("stdout + stderr " + result.stdout);

//        myFuture.return(result.stdout);
        if(result.code == 0){
            myFuture.return(true);
        }else{
            myFuture.return(false);
        }
        return myFuture.wait();
    },
    sendCommand: function (command) {
        console.log("received command -> " + command);
        Future = Npm.require('fibers/future');

        var myFuture = new Future();

        var result = sh.exec(command);

        console.log("return code " + result.code);
        console.log("stdout + stderr " + result.stdout);

        myFuture.return(result.stdout);

        return myFuture.wait();
    },
    pythonParse: function (name, gitURL) {
        Future = Npm.require('fibers/future');
        var myFuture2 = new Future();
        console.log(name + ' ' + gitURL);
        var parseScript  = process.env.PWD + '/public/jenkins/parse.py ' + name + ' ' + gitURL;
        var result = sh.exec('python ' + parseScript);

        console.log("return code " + result.code);
        console.log("stdout + stderr " + result.stdout);

        if(result.code == 0){
            myFuture2.return(true);
        } else{
            myFuture2.return(false);
        }
//        myFuture2.return(true);

//        myFuture2.return(result.stdout);
        return myFuture2.wait();
    },
    syncAppsCollections: function(){
        console.log("\t\t--------------- SYNCING APPS ---------------");
        Meteor.call('populateRetrieved_Apps');
        var retrieved_apps = Retrieved_Apps.find({}).fetch();
        var prod_apps = Prod_Apps.find({}).fetch();

        for(i = 0; i < retrieved_apps.length; i++){
            if(Prod_Apps.findOne({guid: retrieved_apps[i].guid}) == undefined){ //a service has been pulled from cf that is not in the prod_apps collection, so it will be inserted into prod
                var currentApp = Retrieved_Apps.findOne({guid: retrieved_apps[i].guid});
                Prod_Apps.insert(  Retrieved_Apps.findOne({guid: retrieved_apps[i].guid}) );
            }
        }

        for(i = 0; i < prod_apps.length; i++){
//            console.log("current prod app is -> " + prod_apps[i].name + " with guid -> " + prod_apps[i].guid);
//            console.log(Retrieved_Apps.findOne({guid: prod_apps[i].guid}));
            if(Retrieved_Apps.findOne({guid: prod_apps[i].guid}) == undefined){ // an app in production cannot be found in the apps pulled from cf, meaning it should be removed from prod
                Prod_Apps.remove({guid: prod_apps[i].guid});
            }
        }

        console.log("\t\tDONE SYNCING APPS");
    },
    syncServicesCollections: function(){
        console.log("\t\t--------------- SYNCING SERVICES ---------------");
        Meteor.call('populateRetrieved_Services');
        var retrieved_apps = Retrieved_Services.find({}).fetch();
        var prod_apps = Prod_Services.find({}).fetch();

        for(i = 0; i < retrieved_apps.length; i++){
            if(Prod_Services.findOne({guid: retrieved_apps[i].guid}) == undefined){ //a service has been pulled from cf that is not in the prod_apps collection, so it will be inserted into prod
                var currentApp = Retrieved_Services.findOne({guid: retrieved_apps[i].guid});
                Prod_Services.insert(  Retrieved_Services.findOne({guid: retrieved_apps[i].guid}) );
            }
        }

        for(i = 0; i < prod_apps.length; i++){
//            console.log("current prod app is -> " + prod_apps[i].name + " with guid -> " + prod_apps[i].guid);
//            console.log(Retrieved_Services.findOne({guid: prod_apps[i].guid}));
            if(Retrieved_Services.findOne({guid: prod_apps[i].guid}) == undefined){ // a service in production cannot be found in the apps pulled from cf, meaning it should be removed from prod
                Prod_Services.remove({guid: prod_apps[i].guid});
            }
        }

        console.log("\t\tDONE SYNCING SERVICES");
    },
    syncPlansCollections: function(){
        console.log("\t\t--------------- SYNCING PLANS ---------------");
        Meteor.call('populateRetrieved_Plans');
        var retrieved_apps = Retrieved_Plans.find({}).fetch();
        var prod_apps = Prod_Plans.find({}).fetch();

        for(i = 0; i < retrieved_apps.length; i++){
            if(Prod_Plans.findOne({guid: retrieved_apps[i].guid}) == undefined){ //a plan has been pulled from cf that is not in the prod_apps collection, so it will be inserted into prod
//                var currentApp = Retrieved_Plans.findOne({guid: retrieved_apps[i].guid});
                Prod_Plans.insert(  Retrieved_Plans.findOne({guid: retrieved_apps[i].guid}) );
            }
        }

        for(i = 0; i < prod_apps.length; i++){
//            console.log("current prod app is -> " + prod_apps[i].name + " with guid -> " + prod_apps[i].guid);
//            console.log(Retrieved_Plans.findOne({guid: prod_apps[i].guid}));
            if(Retrieved_Plans.findOne({guid: prod_apps[i].guid}) == undefined){ // a plan in production cannot be found in the plans pulled from cf, meaning it should be removed from prod
                Prod_Plans.remove({guid: prod_apps[i].guid});
            }
        }

        console.log("\t\tDONE SYNCING PLANS");
    },
    syncProvisionsCollections: function(){
        console.log("\t\tSYNCING PROVISIONS");
        Meteor.call('populateRetrieved_Provisions');

        var retrieved_provisions = Retrieved_Provisioned_Services.find({}).fetch();
        var prod_provisions = Prod_Provisioned_Services.find({}).fetch();

        for(i = 0; i < retrieved_provisions.length; i++){
//            console.log(Retrieved_Provisioned_Services.findOne({guid: retrieved_provisions[i].guid}));
            if(Prod_Provisioned_Services.findOne({guid: retrieved_provisions[i].guid}) == undefined){ //a service has been pulled from cf that is not in the prod_provisions collection, so it will be inserted into prod
                Prod_Provisioned_Services.insert(  Retrieved_Provisioned_Services.findOne({guid: retrieved_provisions[i].guid}) );
            }
        }

        for(i = 0; i < prod_provisions.length; i++){
            console.log("\n\ncurrent prod provision is -> " + prod_provisions[i].name + " with guid -> " + prod_provisions[i].guid);
            console.log("\n\n" + Retrieved_Provisioned_Services.findOne({guid: prod_provisions[i].guid}));
            if(Retrieved_Provisioned_Services.findOne({guid: prod_provisions[i].guid}) == undefined){ // a service in production cannot be found in the provisions pulled from cf, meaning it should be removed from prod
                Prod_Provisioned_Services.remove({guid: prod_provisions[i].guid});
            }
        }

        console.log("\t\tDONE SYNCING PROVISIONS");
    },
    syncBuildpacksCollections: function(){
        console.log("\t\t--------------- SYNCING BUILDPACKS ---------------");
        Meteor.call('populateRetrieved_Buildpacks');
        var retrieved_buildpacks = Retrieved_Buildpacks.find({}).fetch();
        var prod_buildpacks = Prod_Buildpacks.find({}).fetch();

        for(i = 0; i < retrieved_buildpacks.length; i++){
            if(Prod_Buildpacks.findOne({guid: retrieved_buildpacks[i].guid}) == undefined){ //a service has been pulled from cf that is not in the prod_apps collection, so it will be inserted into prod
//                var currentApp = Retrieved_Buildpacks.findOne({guid: retrieved_buildpacks[i].guid});
                Prod_Buildpacks.insert(  Retrieved_Buildpacks.findOne({guid: retrieved_buildpacks[i].guid}) );
            }
        }

        for(i = 0; i < prod_buildpacks.length; i++){
            if(Retrieved_Buildpacks.findOne({guid: prod_buildpacks[i].guid}) == undefined){ // an app in production cannot be found in the apps pulled from cf, meaning it should be removed from prod
                Prod_Buildpacks.remove({guid: prod_buildpacks[i].guid});
            }
        }

        console.log("\t\tDONE SYNCING BUILDPACKS");
    },
    populateProd_Apps: function(){
        Meteor.call('sendCommand', 'cf curl /v2/apps', function (err, result) {
            if (result) {
                console.log("-------------------------------------------------------------------------------------------------------- ");
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

                    if (Prod_Apps.findOne({guid: appGUID}) == undefined) {
                        Prod_Apps.insert({guid: appGUID, url: appURL, created_at: appCreatedDate, updated_at: appUpdatedDate, name: appName,
                            production: appProductionStatus.toString(), memory: appMemory, instance_count: appInstanceCount, diskUsage: appDiskQuota,
                            state: appState, package_state: appPackagestate});
                    }
                }
            }
            console.log("-------------------------------------------------------------------------------------------------------- ");
        });
    },
    populateRetrieved_Apps: function(){
        Retrieved_Apps.remove({});
        Meteor.call('sendCommand', 'cf curl /v2/apps', function (err, result) {
            if (result) {
                console.log("-------------------------------------------------------------------------------------------------------- ");
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

//                    if (Retrieved_Apps.findOne({guid: appGUID}) == undefined) {
                        Retrieved_Apps.insert({guid: appGUID, url: appURL, created_at: appCreatedDate, updated_at: appUpdatedDate, name: appName,
                            production: appProductionStatus.toString(), memory: appMemory, instance_count: appInstanceCount, diskUsage: appDiskQuota,
                            state: appState, package_state: appPackagestate});
//                    }
                }
            }
            console.log("-------------------------------------------------------------------------------------------------------- ");
        });
    },
    populateProd_Services: function(){
        Meteor.call('sendCommand', 'cf curl /v2/services', function (err, result) {
            if (result) {
                console.log("-------------------------------------------------------------------------------------------------------- ");
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


                    if (Prod_Services.findOne({guid: serviceGUID}) == undefined) {
                        Prod_Services.insert({guid: serviceGUID, url: serviceURL, created_at: serviceCreatedAt, updated_at: serviceUpdatedAt, name: serviceName, description: serviceDescription, extra: serviceExtraMetaData, service_broker_guid: serviceBrokerGUID, service_plans_url: servicePlansURL});
                    }
                }
                console.log("-------------------------------------------------------------------------------------------------------- ");
            }
        });
    },
    populateRetrieved_Services: function(){
        Retrieved_Services.remove({});
        Meteor.call('sendCommand', 'cf curl /v2/services', function (err, result) {
            if (result) {
                console.log("-------------------------------------------------------------------------------------------------------- ");
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


//                    if (Retrieved_Services.findOne({guid: serviceGUID}) == undefined) {
                        Retrieved_Services.insert({guid: serviceGUID, url: serviceURL, created_at: serviceCreatedAt, updated_at: serviceUpdatedAt, name: serviceName, description: serviceDescription, extra: serviceExtraMetaData, service_broker_guid: serviceBrokerGUID, service_plans_url: servicePlansURL});
//                    }
                }
                console.log("-------------------------------------------------------------------------------------------------------- ");
            }
        });
    },
    populateRetrieved_Plans: function(){
        Retrieved_Plans.remove({});

        var retrievedServicesArray = Retrieved_Services.find({}).fetch();

        for(i = 0; i < retrievedServicesArray.length; i++) {
            Meteor.call('sendCommand', 'cf curl ' + retrievedServicesArray[i].service_plans_url, function (err, planResults) {
                if (planResults) {
                    console.log("-------------------------------------------------------------------------------------------------------- ");
                    console.log(planResults);
                    var jsonResponse_Plans = JSON.parse(planResults);
                    for (z = 0; z < jsonResponse_Plans.resources.length; z++) {
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

//                        if (Retrieved_Plans.findOne({guid: planGUID}) == undefined) {
                            Retrieved_Plans.insert({guid: planGUID, url: planURL, created_at: planCreatedDate, updated_at: planUpdatedDate, name: planName, extra: planExtraMetaData, description: planDescription, service_guid: planServiceGUID, service_url: planServiceURL, service_instances_url: planServiceInstancesURL});
//                        }
                    }
                }
                console.log("-------------------------------------------------------------------------------------------------------- ");
            });
        }
    },
    populateProd_Plans: function(){
        var prodServicesArray = Prod_Services.find({}).fetch();

        for(i = 0; i < prodServicesArray.length; i++) {
            Meteor.call('sendCommand', 'cf curl ' + prodServicesArray[i].service_plans_url, function (err, planResults) {
                if (planResults) {
                    console.log("-------------------------------------------------------------------------------------------------------- ");
                    console.log(planResults);
                    var jsonResponse_Plans = JSON.parse(planResults);
                    for (z = 0; z < jsonResponse_Plans.resources.length; z++) {
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

                        if (Prod_Plans.findOne({guid: planGUID}) == undefined) {
                            Prod_Plans.insert({guid: planGUID, url: planURL, created_at: planCreatedDate, updated_at: planUpdatedDate, name: planName, extra: planExtraMetaData, description: planDescription, service_guid: planServiceGUID, service_url: planServiceURL, service_instances_url: planServiceInstancesURL});
                        }
                    }
                }
                console.log("-------------------------------------------------------------------------------------------------------- ");
            });
        }
    },
    populateProd_Provisions: function(){
        Meteor.call('sendCommand', 'cf curl /v2/service_instances', function(err, output){
            if(output){
                console.log("-------------------------------------------------------------------------------------------------------- ");
                var jsonResponse_Provisions = JSON.parse(output);
                var provisionCount = jsonResponse_Provisions.resources.length;

                for(i = 0; i < provisionCount; i++){
                    var provisionGUID = jsonResponse_Provisions.resources[i].metadata.guid;
                    var provisionURL = jsonResponse_Provisions.resources[i].metadata.url;
                    var provisionCreatedAt = jsonResponse_Provisions.resources[i].metadata.created_at;

                    if(jsonResponse_Provisions.resources[i].metadata.updated_at == null){
                        var provisionUpdatedAt = null;
                    } else {
                        var provisionUpdatedAt = jsonResponse_Provisions.resources[i].metadata.updated_at;
                    }

                    var provisionName = jsonResponse_Provisions.resources[i].entity.name;
                    var provisionCredentials = jsonResponse_Provisions.resources[i].entity.credentials;
                    var provisionServicePlanGUID = jsonResponse_Provisions.resources[i].entity.service_plan_guid;
                    var provisionSpaceGUID = jsonResponse_Provisions.resources[i].entity.space_guid;
                    var provisionType = jsonResponse_Provisions.resources[i].entity.type;
                    var provisionDashboardURL = jsonResponse_Provisions.resources[i].entity.dashboard_url;
                    var provisionSpaceURL = jsonResponse_Provisions.resources[i].entity.space_url;
                    var provisionServicePlanURL = jsonResponse_Provisions.resources[i].entity.service_plan_url;
                    var provisionServiceBindingsURL = jsonResponse_Provisions.resources[i].entity.service_bindings_url;

                    if(Prod_Provisioned_Services.findOne({guid: provisionGUID}) == undefined){
                        Prod_Provisioned_Services.insert({guid: provisionGUID, url: provisionURL, created_at: provisionCreatedAt, updated_at: provisionUpdatedAt, name: provisionName, credentials: provisionCredentials,
                            service_plan_guid: provisionServicePlanGUID, space_guid: provisionSpaceGUID, dashboard_url: provisionDashboardURL, type: provisionType, space_url: provisionSpaceURL,
                            service_plan_url: provisionServicePlanURL, service_bindings_url: provisionServiceBindingsURL});
                    }
                }
            }
            console.log("-------------------------------------------------------------------------------------------------------- ");
        });
    },
    populateRetrieved_Provisions: function(){
        Retrieved_Provisioned_Services.remove({});
        Meteor.call('sendCommand', 'cf curl /v2/service_instances', function(err, output){
            if(output){
                console.log("---------------------CALLING populateRetrieved_Provisions----------------------------------------------------------------------------------- ");
                var jsonResponse_Provisions = JSON.parse(output);
                var provisionCount = jsonResponse_Provisions.resources.length;

                for(i = 0; i < provisionCount; i++){
                    var provisionGUID = jsonResponse_Provisions.resources[i].metadata.guid;
                    var provisionURL = jsonResponse_Provisions.resources[i].metadata.url;
                    var provisionCreatedAt = jsonResponse_Provisions.resources[i].metadata.created_at;

                    if(jsonResponse_Provisions.resources[i].metadata.updated_at == null){
                        var provisionUpdatedAt = null;
                    } else {
                        var provisionUpdatedAt = jsonResponse_Provisions.resources[i].metadata.updated_at;
                    }

                    var provisionName = jsonResponse_Provisions.resources[i].entity.name;
                    var provisionCredentials = jsonResponse_Provisions.resources[i].entity.credentials;
                    var provisionServicePlanGUID = jsonResponse_Provisions.resources[i].entity.service_plan_guid;
                    var provisionSpaceGUID = jsonResponse_Provisions.resources[i].entity.space_guid;
                    var provisionType = jsonResponse_Provisions.resources[i].entity.type;
                    var provisionDashboardURL = jsonResponse_Provisions.resources[i].entity.dashboard_url;
                    var provisionSpaceURL = jsonResponse_Provisions.resources[i].entity.space_url;
                    var provisionServicePlanURL = jsonResponse_Provisions.resources[i].entity.service_plan_url;
                    var provisionServiceBindingsURL = jsonResponse_Provisions.resources[i].entity.service_bindings_url;

//                    if(Retrieved_Provisioned_Services.findOne({guid: provisionGUID}) == undefined){
                        Retrieved_Provisioned_Services.insert({guid: provisionGUID, url: provisionURL, created_at: provisionCreatedAt, updated_at: provisionUpdatedAt, name: provisionName, credentials: provisionCredentials,
                            service_plan_guid: provisionServicePlanGUID, space_guid: provisionSpaceGUID, dashboard_url: provisionDashboardURL, type: provisionType, space_url: provisionSpaceURL,
                            service_plan_url: provisionServicePlanURL, service_bindings_url: provisionServiceBindingsURL});

//                        console.log(Retrieved_Provisioned_Services.findOne({guid: provisionGUID}));
//                    }
                }
            }
            console.log("---------------------LEAVING populateRetrieved_Provisions----------------------------------------------------------------------------------- ");
        });
    },
    populateRetrieved_Buildpacks: function(){
        Retrieved_Buildpacks.remove({});
        Meteor.call('sendCommand', 'cf curl /v2/buildpacks', function (err, result) {
            if (result) {
                console.log("-------------------------------------------------------------------------------------------------------- ");
                console.log(result);

                var jsonResponse_Buildpacks = JSON.parse(result);
                var buildpackCount = jsonResponse_Buildpacks.resources.length;

                for (i = 0; i < buildpackCount; i++) {
                    var buildpackGUID = jsonResponse_Buildpacks.resources[i].metadata.guid; // get buildpack guid
                    var buildpackURL = jsonResponse_Buildpacks.resources[i].metadata.url; // get buildpack url
                    var buildpackCreatedAt = jsonResponse_Buildpacks.resources[i].metadata.created_at; // get buildpack created date
                    var buildpackUpdatedAt = jsonResponse_Buildpacks.resources[i].metadata.updated_at; // get buildpack updated date
                    var buildpackName = jsonResponse_Buildpacks.resources[i].entity.name; // get buildpack name (label)
                    var buildpackPosition = jsonResponse_Buildpacks.resources[i].entity.position; // get buildpack position
                    var buildpackEnabled = jsonResponse_Buildpacks.resources[i].entity.enabled; // get buildpack enabled status
                    var buildpackLocked = jsonResponse_Buildpacks.resources[i].entity.locked; // get buildpack locked status
                    var buildpackFileName = jsonResponse_Buildpacks.resources[i].entity.filename; //get buildpack filename

                    Retrieved_Buildpacks.insert({guid: buildpackGUID, url: buildpackURL, created_at: buildpackCreatedAt, updated_at: buildpackUpdatedAt, name: buildpackName, position: buildpackPosition, enabled: buildpackEnabled.toString(), locked: buildpackLocked.toString(), filename: buildpackFileName});
                }
                console.log("-------------------------------------------------------------------------------------------------------- ");
            }
        });
    },

    getTargetInfo: function(){
        Meteor.call('sendCommand', 'cf t', function(err, output){
            if(output){
                console.log(output);
            }
        });
    }

});
