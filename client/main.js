Meteor.subscribe("apps");
Meteor.subscribe("services_1");
Meteor.subscribe("plans_1");
Meteor.subscribe("userList");

Meteor.startup(function () {

//    populateServices();
//    populateApps();
//    populatePlans()

});
Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function () {
    this.route('loginScreen', {path: '/', template: 'loginScreen', layoutTemplate: 'layout2'});
    this.route('registerScreen', {path: '/registerUser', layoutTemplate: 'layout2'});
    // this.route('placeHolder' , {path: '/'});
    this.route('launchApp');
    this.route('deleteApp');
    this.route('statusApp');
    this.route('createService');
    this.route('deleteService');
    this.route('listService');
    this.route('bindService');
    this.route('unbindService');
    this.route('serviceStatus');
    this.route('option2SBM');
    this.route('option3SBM');
    this.route('cfInfo', {path: '/cfInfo'});
    this.route('boshInfo');
    this.route('openstackInfo');
//    this.route('jqGridTemplate');
    this.route('terminalPage');
});

Template.cfInfo.currentUser = function () {
    return Meteor.user();
}

//Template.terminalPage.output = function () {
//
//    var jsonResponse_Services = serviceCuler('cf curl /v2/services');
//    var serviceGUID = jsonResponse_Services.resources[0].metadata.guid; // get service guid
//    var serviceName = jsonResponse_Services.resources[0].entity.label; // get service name (label)
//    var serviceDescription = jsonResponse_Services.resources[0].entity.description; // get service description
//    var servicePlansURL = jsonResponse_Services.resources[0].entity.service_plans_url; //get service_plans_url
//
//    var jsonResponse_Plans = planCuler('cf curl ' + servicePlansURL);
//    var planGUID = jsonResponse_Plans.resources[0].metadata.guid; // get plan guid
//    var planName = jsonResponse_Plans.resources[0].entity.name; // get plan name
//    var planDescription = jsonResponse_Plans.resources[0].entity.description; // get plan description
//    var planSerivceGUID = jsonResponse_Plans.resources[0].entity.service_guid; // get plan's service_guid
//
//    return serviceGUID + " " + serviceName + " & " + serviceDescription + "\n\n" + servicePlansURL + "  ---->>> plan info " + planGUID + " " + planName + " " + planDescription + " " + planSerivceGUID;
//}


//Template.terminalPage.events({
//    'click #terminalBtn' : function () {
//        var text;
//        var curlServices = 'cf curl /v2/services';
//        var label;
//        var x;
//        Meteor.call('sendCommand', curlServices, function (err, result){
//            if(result){
//                Meteor.call('blah');
//
//                Session.set('resultingInfo', result);
//                x = speak(Session.get('resultingInfo'));
//                alert("from within call --->>> " + JSON.parse(result).resources[0].entity.label);
//                label = JSON.parse(result).resources[0].entity.label;
//                text = result;
//
//            }
//        });
//
////    Meteor.call('blah');
////    console.log('1 ' + text);
////    console.log('2 ' + text);
////    x = Session.get("resultingInfo");
//        alert("looks like session var is " + Session.get('resultingInfo'));
//        alert(x);
////    alert(text);
//
//        var jsonResponse_Services = JSON.parse(text);
//
//        var serviceLabel = jsonResponse_Services.resources[0].entity.label; // get service name (label)
//        var servicePlansURL = jsonResponse_Services.resources[0].entity.service_plans_url; //get service_plans_url
//        var serviceDescription = jsonResponse_Services.resources[0].entity.description; // get service description
//
//        //get plans for mongo collection by executing curl
//        var plansText;
//        var curlPlans = 'cf curl ' + servicePlansURL;
//
//        Meteor.call('sendCommand', curlPlans, function (err, result){
//            if(result){
//                alert(curlPlans);
//                plansText = result;
//                alert("results were --->>>> \n\n\n" + result);
//            }
//        });
//        Meteor.call('blah');
//        console.log('1 ' + plansText);
//        console.log('2 ' + plansText);
//        alert(plansText);
//
//
//        alert("service plan url " + servicePlansURL);
//        alert(serviceLabel + " & " + serviceDescription);
//
//        return serviceLabel + " & " + serviceDescription + "\n\n" + servicePlansURL + "  ---->>> planText " + plansText;
//    }});


Template.statusApp.apps = function () {
    return Apps.find();
}

Template.serviceStatus.services = function () {
    return Services.find();
}

Template.statusApp.helpers({
    settings: function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            fields: [
                { key: 'name', label: 'Application Name' },
                { key: 'state', label: 'State'},
                {key: 'production', label: 'Production Status'}
            ]
        };
    }})


Template.serviceStatus.plans = function () {
    return Plans.find();
}

Template.serviceStatus.helpers({
    settings: function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            fields: [
                { key: 'name', label: 'Service Name' },
                { key: 'description', label: 'Description'},
                { key: 'service_plan_url', label: 'Plan URL'}
            ]
        };
    },

    serviceJoinPlan: function () {
//        alert(this.guid + " from service Join");

        var neededPlans = Plans.find({service_guid: this.guid});
//    alert(Plans.find({service_guid : this.guid}));
//        alert(neededPlans.length);

        return neededPlans;
    },

    currentPlan: function (planGUID) {
//        var currPlan = Plans.find({guid : planGUID})
//        alert(this + " from currentPlan");

//        return neededPlans;
    }

});

Template.serviceStatus.events({
    'click .viewPlan': function () {
//        alert(this.name + " .viewPlan event");
//        var currentObj = this;
//        alert(currentObj._id);

//        var testVar = Template.serviceStatus.serviceJoinPlan();

//        alert(JSON.stringify(testVar));


//        console.log("length of testVar = " + testVar);


//        console.log("length of testVar = " + testVar[1]);

        getCurrentPlanHelper(this.guid);

//        $('#myModalLabel').text(currentObj.name);
        $('#myModal').modal();
//        Route.go('modal');
    },
    'click #launchService' : function(){
        alert("You launched with name " + $('#serviceNameInput').val());
    }
//    },
//    'click #populateCollections': function(){
//        populateServices();
//        alert("Done!");
//    }
})


var getCurrentPlanHelper = function (planGUID) {
//    alert(planGUID + " from helper");
    var currPlan = Plans.findOne({guid: planGUID});
    var parentPlan = Services.findOne({guid: currPlan.service_guid});

//    var jsonResponse_Services = serviceCuler('cf curl /v2/services');
//    var jsonResponse_Plans = planCuler('cf curl ' + parentPlan.service_plans_url);


    $('#planTitle').text(currPlan.name);
    $('#myModalLabel').text(parentPlan.name);
    $('#urlSpan').html(" " + currPlan.url + " <br />");
    $('#createdSpan').html(" " + currPlan.created_at  + " <br />");
    $('#updatedSpan').html(" " + currPlan.updated_at + " <br />");
    $('#descriptionSpan').html(" " + currPlan.description + " <br />");
    $('#serviceURLSpan').html(" " + currPlan.service_url + " <br />");
    $('#serviceInstanceURLSpan').html(" " + currPlan.service_instances_url + " <br />");


//    return currPlan;
}

//Template.jqGridTemplate.service = function(){
//
//    return Services.find();
//}

Template.statusApp.events({
    'click #launchBtn_1': function () {
//       alert("populating apps...");
//       populateApps();
    }
});

//Template.jqGridTemplate.events({
//    'click #deleteService' : function(){
//        Meteor.call('removeServices');
//    }
//});

Template.loginScreen.events({
    'submit #login-form': function (e, t) {
        e.preventDefault();
        var username = t.find('#login-username').value;
        var password = t.find('#login-password').value;
//        alert("Username: " + username + "\nPassword: " + password);

        //validate fields
        //Upon success
        Meteor.loginWithPassword(username, password, function (err) {
            if (err) {
                // alert user login has failed
//                alert(err);
                Router.go('loginScreen');
            } else {
                //user has been logged in
//          var curr = this.userId;
//          alert(this.userId);
//          alert(curr);
            }
        });

        Router.go('cfInfo');
        return false;
    }
});

Template.registerScreen.events({
    'submit #register-form': function (e, t) {
        e.preventDefault();
        var username = t.find('#account-username').value;
        var password = t.find('#account-password').value;

        //validate fields
        //Upon success
        // alert("Username: " + username + "\nPassword: " + password);
        Accounts.createUser({username: username, password: password}, function (err) {
//            alert("Success1");
            if (err) {
                alert(this);
                e.preventDefault();
                alert(err);
                Router.go('registerScreen');
            } else {

            }
        });
        Router.go('loginScreen');
        return false;
    }
});


$('#example').dataTable({
    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>", "sPaginationType": "bootstrap", "oLanguage": {
        "sLengthMenu": "_MENU_ records per page"
    }
});

var populateApps = function () {
    var jsonResponse_Apps = appCurler('cf curl /v2/apps');
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

var populateServices = function () {
    var jsonResponse_Services = serviceCurler('cf curl /v2/services');
    var serviceCount = jsonResponse_Services.resources.length;

    for (i = 0; i < serviceCount; i++) {
        var serviceGUID = jsonResponse_Services.resources[i].metadata.guid; // get service guid
        var serviceName = jsonResponse_Services.resources[i].entity.label; // get service name (label)
        var serviceDescription = jsonResponse_Services.resources[i].entity.description; // get service description
        var servicePlansURL = jsonResponse_Services.resources[i].entity.service_plans_url; //get service_plans_url


        if (Services.findOne({guid: serviceGUID}) == undefined) {
            Services.insert({guid: serviceGUID, name: serviceName, description: serviceDescription, service_plan_url: servicePlansURL});
//            populatePlans(servicePlansURL);
        }
    }

}

var populatePlans = function () {
    var serviceCount = Services.find().count();
    var serviceArry = Services.find({}).fetch();

//    var jsonResponse_Plans = planCurler('cf curl ' + servicePlanURL);
//    var planCount = jsonResponse_Plans.resources.length;

    for (x = 0; x < serviceCount; x++) {
        var currentServicePlanURL = serviceArry[x].service_plan_url;
        var jsonResponse_Plans = planCurler('cf curl ' + currentServicePlanURL);
        var planCount = jsonResponse_Plans.resources.length;

        for (z = 0; z < planCount; z++) {
            var planGUID = jsonResponse_Plans.resources[z].metadata.guid; // get plan guid
            var planURL = jsonResponse_Plans.resources[z].metadata.url; // get plan url
            var planCreatedDate = jsonResponse_Plans.resources[z].metadata.created_at; // get plan creation date
            var planUpdatedDate = jsonResponse_Plans.resources[z].metadata.updated_at; // get plan updated date

            var planName = jsonResponse_Plans.resources[z].entity.name; // get plan name
            var planDescription = jsonResponse_Plans.resources[z].entity.description; // get plan description
            var planServiceGUID = jsonResponse_Plans.resources[z].entity.service_guid; // get plan's service_guid
            var planServiceURL = jsonResponse_Plans.resources[z].entity.service_url; // get plan's service_url
            var planServiceInstancesURL = jsonResponse_Plans.resources[z].entity.service_instances_url; // get plan's service_instances_url

            if (Plans.findOne({guid: planGUID}) == undefined) {
                Plans.insert({guid: planGUID, url: planURL, created_at: planCreatedDate, updated_at: planUpdatedDate, name: planName, description: planDescription, service_guid: planServiceGUID, service_url: planServiceURL, service_instances_url: planServiceInstancesURL});
            }
        }

    }


//    for(z = 0; z < planCount; z++) {
//        var planGUID = jsonResponse_Plans.resources[z].metadata.guid; // get plan guid
//        var planURL = jsonResponse_Plans.resources[z].metadata.url; // get plan url
//        var planCreatedDate = jsonResponse_Plans.resources[z].metadata.created_at; // get plan creation date
//        var planUpdatedDate = jsonResponse_Plans.resources[z].metadata.updated_at; // get plan updated date
//
//        var planName = jsonResponse_Plans.resources[z].entity.name; // get plan name
//        var planDescription = jsonResponse_Plans.resources[z].entity.description; // get plan description
//        var planServiceGUID = jsonResponse_Plans.resources[z].entity.service_guid; // get plan's service_guid
//        var planServiceURL = jsonResponse_Plans.resources[z].entity.service_url; // get plan's service_url
//        var planServiceInstancesURL = jsonResponse_Plans.resources[z].entity.service_instances_url; // get plan's service_instances_url
//
//        if (Plans.findOne({guid: planGUID}) == undefined) {
//            Plans.insert({guid: planGUID, url: planURL, created_at: planCreatedDate, updated_at: planUpdatedDate, name: planName, description: planDescription, service_guid: planServiceGUID, service_url: planServiceURL, service_instances_url: planServiceInstancesURL});
//        }
//    }
}


var appCurler = function (curlCommand) {
//    alert("inside appCurler");
    Meteor.call('sendCommand', curlCommand, function (err, result) {
        if (result) {
            Session.set('curlOutput_App', result);
        }
    });

    alert("DONE! in app");
    return JSON.parse(Session.get('curlOutput_App'));
}

var serviceCurler = function (curlCommand) {
    Meteor.call('sendCommand', curlCommand, function (err, result) {
        if (result) {
            Session.set('curlOutput_Services', result);
        }
    });

    alert("DONE! in service");
    return JSON.parse(Session.get('curlOutput_Services'));
}

var planCurler = function (curlCommand) {
    Meteor.call('sendCommand2', curlCommand, function (err, result) {
        if (result) {
            Session.set('curlOutput_Plans', result);
        }
    });

    alert("DONE! in plan");
    return JSON.parse(Session.get('curlOutput_Plans'));
}