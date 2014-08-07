Meteor.subscribe("apps");
Meteor.subscribe("services");
Meteor.subscribe("userList");

Meteor.startup(function () {
//     populate();
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
});

//Session.setDefault("output", "huh?");
//Meteor.subscribe("output");

Template.cfInfo.currentUser = function () {
    return Meteor.user();
}

Template.terminalPage.output = function () {
    var text;
    var curlServices = 'cf curl /v2/services';
    Meteor.call('sendCommand', curlServices, function (err, result){
        if(result){
            text = result;
        }
    });

    Meteor.call('blah');
    console.log('1 ' + text);
    console.log('2 ' + text);
     alert(text);

    var jsonResponse_Services = JSON.parse(text);

    var serviceLabel = jsonResponse_Services.resources[0].entity.label;
    var servicePlansURL = "";
    //get plans for mongo collection by executing curl
//    Meteor.call('sendCommand', servicePlansURL)

    var serviceDescription = jsonResponse_Services.resources[0].entity.description;

    alert(serviceLabel + " & " + serviceDescription);
    return serviceLabel + " & " + serviceDescription;
    }

//Template.terminalPage.rendered = function () {
//    var text;
//    Meteor.call('sendCommand', function (err, result){
//        if(result){
//            text = result;
//        }
//    });
//    return text;
//
////    alert(text);
//}


Template.terminalPage.events({
   'click #terminalBtn' : function(){
       var curlServices = 'cf curl /v2/services';
   Meteor.call('sendCommand', curlServices, function (err, result){
       if(result){
           alert(result);
       }
   });
//       var z = Session.get("output");
//       alert(z);
//       alert(output);


   }
});

Template.statusApp.apps = function(){
    return Apps.find();
}

Template.option1SBM.services = function() {
    return Services.find();
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
    for(i = 0; i < 5; i++){
        if(i % 2 == 0){
            Apps.insert({name: "app_" + i + "", state: "running", since: "{start date}", cpuUsage: "n out of 1MB", memUsage: "n out of 2GB", diskUsage: "n out of 1GB", boundServices: "N/A"});
            Services.insert({name: "service_" + i + "", description: "lorem ipsum", plans: ["Plan 1", "Plan 2", "Plan 3"]});
        } else {
            Apps.insert({name: "app_" + i + "", state: "stopped", since: "{start date}", cpuUsage: "n out of 1MB", memUsage: "n out of 2GB", diskUsage: "n out of 1GB", boundServices: "N/A"});
            Services.insert({name: "service_" + i + "", description: "lorem ipsum", plans: ["Plan 1", "Plan 2", "Plan 3"]});
        }
    }
}