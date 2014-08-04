Meteor.publish('apps', function() {
    return Apps.find({});
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
});
