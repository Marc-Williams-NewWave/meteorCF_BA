Meteor.subscribe("prod_apps");
Meteor.subscribe("prod_services");
Meteor.subscribe("prod_plans");
Meteor.subscribe("prod_provisioned_services");
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
    this.route('provisionedServiceStatus');
});

Template.cfInfo.currentUser = function () {
    return Meteor.user();
}

Template.statusApp.apps = function () {
    return Prod_Apps.find();
}

Template.serviceStatus.services = function () {
    return Prod_Services.find();
}

Template.provisionedServiceStatus.provisionedServices = function(){
    return Prod_Provisioned_Services.find();
}

Template.provisionedServiceStatus.events({
    'click #clearProvisions': function(){
//        populateServices();
//        alert("Done!");
        Meteor.call('removeProvisions');
    },
    'click .deleteProvision': function(){
//        alert(this.guid);
        if(confirm('Are you sure you want to delete this service?')) {
            Meteor.call('removeProvision', this.guid);
        }
    }
});

Template.provisionedServiceStatus.rendered = function(){
    Meteor.call('syncProvisionsCollections');
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

Template.statusApp.rendered = function () {
    Meteor.call('syncAppsCollections');
}

Template.serviceStatus.plans = function () {
    return Prod_Plans.find();
}

Template.statusApp.helpers({
    provisionedServices: function(){
        return Prod_Provisioned_Services.find();
    }
});
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
//        alert(this.name  + " guid -> " + this.guid + " from service Join");

        var neededPlans = Prod_Plans.find({service_guid: this.guid});
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

//    $('#planOptions_' + this.id).css("background-color", "red");
//        alert(this._id);
//        alert(this.guid);


//        $('#planID_'+this.id)


//        alert( $('#planOptions_' + this._id +  ' option:selected' ).text() );

//        $('.viewPlan').click();
//        var currentServiceName = this.name;

//        alert($(this).html());
//        $(this).closest("td").css("background-color", "red" );


//            var buttonCell = $('#viewPlanCell')[0];
//        var leftCell = buttonCell.prev;
//        alert(  $(leftCell).html()  );

//         console.log(buttonText);

//        alert(currentServiceName);
//        var currName = "planOptions_" + this.name;

//        var select = $('#planOptions_'+this.name);
//        alert();

//        alert( $("#planOptions_" + this.name +  " option:selected" ).text() );

//        console.log($( "#" + currName + " option:selected" ).text() );


//        $('#planTitle').text($( "#" + currName + " option:selected" ).text() );
//        console.log($('#' + currName).data());


//        console.log(currPlan2.data);
//        alert("name : " + this.name + "\ndescription: " + this.description + "\nguid: " + this.guid);



        getCurrentPlanHelper(this.guid);

//        $('#myModalLabel').text(currentObj.name);


        $('#myModal').modal();




//        Route.go('modal');
    },
    'click #launchService' : function(){
//        alert("You launched with name " + $('#serviceNameInput').val());
        var cfCreateServiceCommand = "cf create-service " + $('#myModalLabel').text() + " " + $('#planTitle').text() + " " + $('#serviceNameInput').val();
//        alert(cfCreateServiceCommand);
        Meteor.call('sendCommand', cfCreateServiceCommand);
//        Meteor.call('sendCommand', 'cf curl /v2/service_instances');
        Meteor.call('populateRetrieved_Provisions');
        $('#myModal').modal('toggle');

    },
    'click #clearServices': function(){
//        populateServices();
//        alert("Done!");
        Meteor.call('removeServices');
    },
    'click #clearPlans': function(){
        Meteor.call('removePlans');
    }
});


var getCurrentPlanHelper = function (planGUID) {
    var currPlan = Prod_Plans.findOne({guid: planGUID});
    var parentPlan = Prod_Services.findOne({guid: currPlan.service_guid});


    $('#planTitle').text(currPlan.name);
    $('#myModalLabel').text(parentPlan.name);
    $('#urlSpan').html(" " + currPlan.url + " <br />");
    $('#createdSpan').html(" " + currPlan.created_at  + " <br />");
    $('#updatedSpan').html(" " + currPlan.updated_at + " <br />");
    $('#descriptionSpan').html(" " + currPlan.description + " <br />");
    $('#serviceURLSpan').html(" " + currPlan.service_url + " <br />");
    $('#serviceInstanceURLSpan').html(" " + currPlan.service_instances_url + " <br />");

    var extraMetadata = JSON.parse(currPlan.extra);
//    alert(extraMetadata.name);
//    $('#extraMetaDataSpan').html(" " + currPlan.extra + " <br />");
    $('#extraMetaDataIDSpan').html(" " + extraMetadata.id + " <br />");
    $('#extraMetaDataNameSpan').html(" " + extraMetadata.name + " <br />");
    $('#extraMetaDataDescriptionSpan').html(" " + extraMetadata.description + " <br />");
    $('#extraMetaDataBulletsSpan').html(" " + extraMetadata.bullets + " <br />");
    $('#extraMetaDataProfileNameSpan').html(" " + extraMetadata.profilename + " <br />");
    $('#extraMetaDataNodeNameSpan').html(" " + extraMetadata.nodename + " <br />");
    $('#extraMetaDataHostnameSpan').html(" " + extraMetadata.hostname + " <br />");
    $('#extraMetaDataMngdNodeNameSpan').html(" " + extraMetadata.mngdnodename + " <br />");
    $('#extraMetaDataCellNameSpan').html(" " + extraMetadata.cellname + " <br />");
    $('#extraMetaDataAppNodeNameSpan').html(" " + extraMetadata.appnodename + " <br />");
    $('#extraMetaDataAdminConsoleSpan').html(" " + extraMetadata.adminconsole + " <br />");
}

//Template.jqGridTemplate.service = function(){
//
//    return Services.find();
//}

Template.statusApp.events({
    'click #launchNewApp': function () {
        $('#appCreationModal').modal();
//       alert("populating apps...");
//       populateApps();
    },
    'click #launchAppBtn': function(){
//        alert("creating app with name " + $('#appName').val() + "\nand git repo " + $('#appGitRepo').val());

//        alert($('#provisionedServiceOption').selected.text());
//        alert($('#provisionedServicesDropDown').find(":selected").text());

        Meteor.call('pythonParse', $('#appName').val(), $('#appGitRepo').val());
//        var base = path.resolve('.');
//        alert(base);
    },
    'click #provisionedServiceOption': function(){
//        this.dashboard_url
    },
    'click #clearApps': function(){
//        populateServices();
//        alert("Done!");
        Meteor.call('removeApps');
    },
    'click #syncApps': function(){
        Meteor.call('syncAppsCollections');
    }
});

Template.layout.events({
   'click #logout-button': function(){
       Meteor.logout(function(err, result){
           if(err){
               alert(err);
           } else{
//               alert("Logging Out");
               Router.go('loginScreen');
           }
       });
   }
});
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

        if (Prod_Apps.findOne({guid: appGUID}) == undefined) {
            Prod_Apps.insert({guid: appGUID, url: appURL, created_at: appCreatedDate, updated_at: appUpdatedDate, name: appName,
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


        if (Prod_Services.findOne({guid: serviceGUID}) == undefined) {
            Prod_Services.insert({guid: serviceGUID, name: serviceName, description: serviceDescription, service_plan_url: servicePlansURL});
//            populatePlans(servicePlansURL);
        }
    }

}

var populatePlans = function () {
    var serviceCount = Prod_Services.find().count();
    var serviceArry = Prod_Services.find({}).fetch();

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

            if (Prod_Plans.findOne({guid: planGUID}) == undefined) {
                Prod_Plans.insert({guid: planGUID, url: planURL, created_at: planCreatedDate, updated_at: planUpdatedDate, name: planName, description: planDescription, service_guid: planServiceGUID, service_url: planServiceURL, service_instances_url: planServiceInstancesURL});
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