Meteor.subscribe("apps");
// Meteor.subscribe("clients");

Meteor.startup(function () { 
  // populate();
});
Router.configure({ 
   layoutTemplate: 'layout'
 });

Router.map(function () {
  this.route('loginScreen', {path: '/', template: 'loginScreen', layoutTemplate: 'layout2'});
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



 Template.launchApp.apps = function () {
    // insertClient();
    var count = Apps.find().count();
    // return Users2.find().count();

    return Apps.find();
    // return count;
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



  Template.launchApp.events({
    'click #launchBtn' : function(){
      alert("launch clicked");
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