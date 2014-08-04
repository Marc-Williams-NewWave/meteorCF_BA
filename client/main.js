Meteor.subscribe("apps");
Meteor.subscribe("userList");

Meteor.startup(function () {
    // populate();
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
});



Template.cfInfo.currentUser = function () {
    // insertClient();
    // var count = Apps.find().count();
    // return Users2.find().count();

    // return Meteor.users.find();
//     var count = userList.find().count();
//     alert(count);
//    return userList.findOne({_id:"xvvwgAbLjkf2Z5KT6"});
    // return count;
//     var curr = Meteor.users.findOne({username:"Loki"});
//     alert(curr.username);
    return Meteor.user();
}

Template.deleteApp.apps = function(){
    return Apps.find();
}

Template.deleteApp.tableSettings = function () {
    return {
        fields: [
            { key: 'state', label: 'State' },
            { key: 'since', label: 'Since'}
        ],
        useFontAwesome: true
    };
};

Template.loginScreen.events({
    'submit #login-form' : function(e,t){
        e.preventDefault();
        var username = t.find('#login-username').value; //trim '@xyz.com'
        var password = t.find('#login-password').value;
        alert("Username: " + username + "\nPassword: " + password);

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
        var curr = this.userId;
        alert(this.userId);
        alert(curr);
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
            alert("Success1");
            if(err){
                alert("Success!");
            } else{

            }
        });
        Router.go('loginScreen');
        return false;
    }
});

Template.launchApp.events({
    'click #launchBtn1' : function(){
        alert("launch clicked");
        var count = Meteor.users.find().count();
        alert(count);

        var user = Meteor.user();
        alert(user.username);
//        var curr = Meteor.users.findOne({username:"Loki"});
//        var curr = this.userId;
//        alert(this.userId);
//        alert(curr);
    }
});


var populate = function(){
    for(i = 0; i < 5; i++){
        if(i % 2 == 0){
            Apps.insert({name: "app_" + i + "", state: "running", since: "{start date}", cpuUsage: "n out of 1MB", memUsage: "n out of 2GB", diskUsage: "n out of 1GB", boundServices: "N/A"});
        } else {
            Apps.insert({name: "app_" + i + "", state: "stopped", since: "{start date}", cpuUsage: "n out of 1MB", memUsage: "n out of 2GB", diskUsage: "n out of 1GB", boundServices: "N/A"});
        }
    }
}