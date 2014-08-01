Meteor.publish('apps', function() {
    return Apps.find({});
});
// Meteor.publish('clients', function() {
//     return Client.find({});
// });


Meteor.startup(function () {

console.log("Checking in on the server side - MW");
// Users2.remove({});

});

// console.log(Client.find({}));
// // Client.insert({first: "fName", last: "lName", email: "email"});
// var client2 = Client.find({}).fetch();
// console.log(client2);
// console.log(Client.find().count());