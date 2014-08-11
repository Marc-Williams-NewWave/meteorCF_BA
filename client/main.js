Meteor.subscribe("apps");
Meteor.subscribe("services");
Meteor.subscribe("plans");
Meteor.subscribe("userList");

Meteor.startup(function () {
//     populate();
//    populateServicesAndPlans();

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
    this.route('option1SBM');
    this.route('option2SBM');
    this.route('option3SBM');
    this.route('cfInfo', {path: '/cfInfo'});
    this.route('boshInfo');
    this.route('openstackInfo');
    this.route('jqGridTemplate');
    this.route('terminalPage');
    this.route('modal');
});

//Session.setDefault("output", "huh?");
//Meteor.subscribe("output");


//Session.setDefault('resultingInfo', null);

//Deps.autorun(function () {
//    Meteor.subscribe("results", Session.get("resultingInfo"));
//});

Template.cfInfo.currentUser = function () {
    return Meteor.user();
}

Template.terminalPage.output = function () {

    var jsonResponse_Services = serviceCuler('cf curl /v2/services');
    var serviceGUID = jsonResponse_Services.resources[0].metadata.guid; // get service guid
    var serviceName = jsonResponse_Services.resources[0].entity.label; // get service name (label)
    var serviceDescription = jsonResponse_Services.resources[0].entity.description; // get service description
    var servicePlansURL = jsonResponse_Services.resources[0].entity.service_plans_url; //get service_plans_url

    var jsonResponse_Plans = planCuler('cf curl ' + servicePlansURL);
    var planGUID = jsonResponse_Plans.resources[0].metadata.guid; // get plan guid
    var planName = jsonResponse_Plans.resources[0].entity.name; // get plan name
    var planDescription = jsonResponse_Plans.resources[0].entity.description; // get plan description
    var planSerivceGUID = jsonResponse_Plans.resources[0].entity.service_guid; // get plan's service_guid

//    if(planSerivceGUID == serviceGUID){
//        alert("YES!");
//    }
    return jsonResponse_Services.resources.length;//serviceGUID + " " + serviceName + " & " + serviceDescription + "\n\n" + servicePlansURL + "  ---->>> plan info " + planGUID + " " + planName + " " + planDescription + " " + planSerivceGUID;
}




var populateServicesAndPlans = function(){
    var jsonResponse_Services = serviceCuler('cf curl /v2/services');
    var jsonResponse_Plans = planCuler('cf curl ' + servicePlansURL);

    var serviceCount = jsonResponse_Services.resources.length;
    var planCount = jsonResponse_Plans.resources.length;

    for(i = 0; i < serviceCount; i++){
        var serviceGUID = jsonResponse_Services.resources[i].metadata.guid; // get service guid
        var serviceName = jsonResponse_Services.resources[i].entity.label; // get service name (label)
        var serviceDescription = jsonResponse_Services.resources[i].entity.description; // get service description
        var servicePlansURL = jsonResponse_Services.resources[i].entity.service_plans_url; //get service_plans_url
//        Services.insert({name: "service_" + i + "", description: "lorem ipsum", plans: ["Plan 1", "Plan 2", "Plan 3"]});

        Services.insert( {guid: serviceGUID, name: serviceName, description: serviceDescription, service_plan_url: servicePlansURL} );
    }

    for(z = 0; z < planCount; z++){
        var planGUID = jsonResponse_Plans.resources[0].metadata.guid; // get plan guid
        var planName = jsonResponse_Plans.resources[0].entity.name; // get plan name
        var planDescription = jsonResponse_Plans.resources[0].entity.description; // get plan description
        var planSerivceGUID = jsonResponse_Plans.resources[0].entity.service_guid; // get plan's service_guid

        Plans.insert( {guid: planGUID, name: planName, description: planDescription, service_guid: planSerivceGUID} );
    }

}
var serviceCuler = function(curlCommand){
    Meteor.call('sendCommand', curlCommand, function (err, result){
        if(result){
            Session.set('curlOutput_Services', result);
        }
    });

    return JSON.parse(Session.get('curlOutput_Services'));
}

var planCuler = function(curlCommand){
    Meteor.call('sendCommand', curlCommand, function (err, result){
        if(result){
            Session.set('curlOutput_Plans', result);
        }
    });

    return JSON.parse(Session.get('curlOutput_Plans'));
}

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


Template.statusApp.apps = function(){
    return Apps.find();
}

Template.option1SBM.services = function() {
    return Services.find();
}

Template.option1SBM.plans = function() {
    return Plans.find();
}

Template.option1SBM.helpers({
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

    serviceJoinPlan: function(){
        alert(this.guid + " from service Join");

     var neededPlans = Plans.find({service_guid : this.guid});
//    alert(Plans.find({service_guid : this.guid}));
//        alert(neededPlans.length);

      return neededPlans;
    },

    currentPlan: function(planGUID){
//        var currPlan = Plans.find({guid : planGUID})
        alert(this + " from currentPlan");

//        return neededPlans;
    }

});

Template.option1SBM.events({
    'click .viewPlan': function () {
        alert(this.name + " .viewPlan event");
//        var currentObj = this;
//        alert(currentObj._id);

//        var testVar = Template.option1SBM.serviceJoinPlan();

//        alert(JSON.stringify(testVar));


//        console.log("length of testVar = " + testVar);



//        console.log("length of testVar = " + testVar[1]);

        getCurrentPlanHelper(this.guid);

//        $('#myModalLabel').text(currentObj.name);
        $('#myModal').modal();
//        Route.go('modal');
    }
})


var getCurrentPlanHelper = function(planGUID){
    alert(planGUID + " from helper");
    var currPlan = Plans.findOne( {guid : planGUID} );
    var parentPlan = Services.findOne({guid: currPlan.service_guid});

    $('#planTitle').text(currPlan.name);
    $('#myModalLabel').text(parentPlan.name);

    return currPlan;
}

Template.jqGridTemplate.service = function(){

    return Services.find();
}

//Template.deleteApp.tableSettings = function () {
//    return {
//        fields: [
//            { key: 'state', label: 'State' },
//            { key: 'since', label: 'Since'}
//        ],
//        useFontAwesome: true
//    };
//};

Template.statusApp.events({
   'click #deleteBtn' : function(){
       Meteor.call('removeApps');
   }
});

Template.jqGridTemplate.events({
    'click #deleteService' : function(){
        Meteor.call('removeServices');
    }
});

Template.loginScreen.events({
    'submit #login-form' : function(e,t){
        e.preventDefault();
        var username = t.find('#login-username').value; //trim '@xyz.com'
        var password = t.find('#login-password').value;
//        alert("Username: " + username + "\nPassword: " + password);

        //validate fields
        //Upon success
        Meteor.loginWithPassword(username, password, function(err) {
            if(err) {
                // alert user login has failed
            } else{
                //user has been logged in
//          var curr = this.userId;
//          alert(this.userId);
//          alert(curr);
            }
        });

        Router.go('cfInfo');
//        var curr = this.userId;
//        alert(this.userId);
//        alert(curr);
        return false;
    }
});

Template.registerScreen.events({
    'submit #register-form' : function(e,t){
        e.preventDefault();
        var username = t.find('#account-username').value;
        var password = t.find('#account-password').value;

        //validate fields
        //Upon success
        // alert("Username: " + username + "\nPassword: " + password);
        Accounts.createUser({username: username, password: password}, function(err){
//            alert("Success1");
            if(err){
//                alert("Success!");
            } else{

            }
        });
        Router.go('loginScreen');
        return false;
    }
});



$('#example').dataTable({
    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>"
    , "sPaginationType": "bootstrap"
    , "oLanguage": {
        "sLengthMenu": "_MENU_ records per page"
    }
});

var populate = function(){
//    for(i = 0; i < 5; i++){
//        if(i % 2 == 0){
//            Apps.insert({name: "app_" + i + "", state: "running", since: "{start date}", cpuUsage: "n out of 1MB", memUsage: "n out of 2GB", diskUsage: "n out of 1GB", boundServices: "N/A"});
//            Services.insert({name: "service_" + i + "", description: "lorem ipsum", plans: ["Plan 1", "Plan 2", "Plan 3"]});
//        } else {
//            Apps.insert({name: "app_" + i + "", state: "stopped", since: "{start date}", cpuUsage: "n out of 1MB", memUsage: "n out of 2GB", diskUsage: "n out of 1GB", boundServices: "N/A"});
//            Services.insert({name: "service_" + i + "", description: "lorem ipsum", plans: ["Plan 1", "Plan 2", "Plan 3"]});
//        }
//    }
//    alert("placing new service");
//    Services.insert( {guid: "91d2dfe7-hhhh-hhhh-hhhh-9412f9f8103e", name: "Marc's Service", description: "Marc Will Made It", service_plan_url: "beMe.blogspot/lulz"} );
//    Plans.insert( {guid: "91d2dfe7-hhhh-hhhh-hhhh-9412f9f8103e", name: "Marc's Dummy Plan", description: "Marc Will Made It (dos)", service_guid: "91d2dfe7-hhhh-hhhh-hhhh-9412f9f8103e"} );

}
