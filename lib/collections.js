Prod_Apps = new Meteor.Collection("prod_apps", {idGeneration : 'MONGO'});
Retrieved_Apps = new Meteor.Collection("retrieved_apps", {idGeneration : 'MONGO'});
//Test_Prod_Apps = new Meteor.Collection("test_prod_apps", {idGeneration : 'MONGO'});



Prod_Services = new Meteor.Collection("prod_services", {idGeneration : 'MONGO'});
Retrieved_Services = new Meteor.Collection("retrieved_services", {idGeneration : 'MONGO'});

Prod_Plans = new Meteor.Collection("prod_plans", {idGeneration : 'MONGO'});
Retrieved_Plans = new Meteor.Collection("retrieved_plans", {idGeneration : 'MONGO'});

Prod_Provisioned_Services = new Meteor.Collection("prod_provisioned_services", {idGeneration : 'MONGO'});
Retrieved_Provisioned_Services = new Meteor.Collection("retrieved_provisioned_services", {idGeneration : 'MONGO'});