Meteor.subscribe("prod_apps");
Meteor.subscribe("prod_services");
Meteor.subscribe("prod_plans");
Meteor.subscribe("prod_provisioned_services");
Meteor.subscribe("prod_buildpacks");
Meteor.subscribe("userList");

Meteor.startup(function () {
    appendRows();
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

Template.serviceStatus.plans = function () {
    return Prod_Plans.find();
}

Template.provisionedServiceStatus.provisionedServices = function () {
    return Prod_Provisioned_Services.find();
}

Template.appMonitor.applications = function(){
    return Prod_Apps.find();
}


Template.provisionedServiceStatus.rendered = function () {
    Meteor.call('syncProvisionsCollections');
}



Template.statusApp.rendered = function () {
//    appendRows();
    Meteor.call('syncAppsCollections');
}

Template.serviceStatus.rendered = function () {
    Meteor.call('syncServicesCollections');
    Meteor.call('syncPlansCollections');
}

Template.statusApp.helpers({
    settings: function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            fields: [
                { key: 'name', label: 'Application Name' },
                { key: 'state', label: 'State'},
                { key: 'production', label: 'Production Status'},
                { key: 'name',
                    label: 'Delete App',
                    fn: function (value) {
                        var html;
                        //    alert("Value -> " + value + "\nObject -> " + object);
                        html = '<button class="appDetailButton" id="' + value +'">' + value +'</button>';
                        return new Spacebars.SafeString(html);
                    }
                }
            ]
        };
    },
    provisionedServices: function () {
        return Prod_Provisioned_Services.find();
    }});

Template.statusApp.helpers({
    provisionedServices: function () {
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
        var neededPlans = Prod_Plans.find({service_guid: this.guid});
        return neededPlans;
    }
});
Template.appMonitor.events({

});

Template.layout.events({
    'click #logout-button': function () {
        Meteor.logout(function (err, result) {
            if (err) {
                alert(err);
            } else {
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

        //validate fields
        //Upon success
        Meteor.loginWithPassword(username, password, function (err) {
            if (err) {
                // alert user login has failed
//                alert(err);
                Router.go('loginScreen');
            } else {
                //user has been logged in
            }
        });

        Router.go('welcomeScreen');
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

Template.statusApp.events({
    'click #launchNewApp': function () {
        $('#appCreationModal').modal();
    },
    'click #launchAppBtn': function () {
//        alert($('#provisionedServiceOption').selected.text());
//        alert($('#provisionedServicesDropDown').find(":selected").text());

//        $('#transparent').show();
        $('#loadingModal').modal();
        Meteor.call('pythonParse', $('#appName').val(), $('#appGitRepo').val(), function (err, result){
            if(result == true){
//                alert("complete!");
                alert("Success!");
                $('#loadingModal').modal('toggle');
                $('#appCreationModal').modal('toggle');
//                $('#transparent').hide();
            }
        });
    },
    'click #provisionedServiceOption': function () {
//        this.dashboard_url
    },
    'click #clearApps': function () {
        Meteor.call('removeApps');
    },
    'click #syncApps': function () {
        Meteor.call('syncAppsCollections');
    },
    'click .appDetailButton' : function(){
//        alert(this.data);

        alert($(this).parent());
        console.log($(this).parent().val());
    }
});

Template.serviceStatus.events({
    'click .viewPlan': function () {
        getCurrentPlanHelper(this.guid);
        $('#myModal').modal();
    },
    'click #launchService': function () {
        var cfCreateServiceCommand = "cf create-service " + $('#myModalLabel').text() + " " + $('#planTitle').text() + " " + $('#serviceNameInput').val();

        $('#loadingServiceModal').modal();
        Meteor.call('sendCommandBoolean', cfCreateServiceCommand, function(err, result){
            if(result == true){
                alert("Success!")
                $('#loadingServiceModal').modal('toggle');
                $('#myModal').modal('toggle');
            }
        });
        Meteor.call('populateRetrieved_Provisions');
    },
    'click #clearServices': function () {
        Meteor.call('removeServices');
    },
    'click #clearPlans': function () {
        Meteor.call('removePlans');
    }
});

Template.provisionedServiceStatus.events({
    'click #clearProvisions': function () {
        Meteor.call('removeProvisions');
    },
    'click .deleteProvision': function () {
        if (confirm('Are you sure you want to delete this service?')) {
            $('#deleteProvModal').modal();
            Meteor.call('removeProvision', this.guid, function(err, result){
                if(result == true){ //may have to change to true or false
                    alert("Success!")
                    $('#deleteProvModal').modal('toggle');
                }
            });
        }
    },
    'click #syncProvisions': function () {
        Meteor.call('syncProvisionsCollections');
    }
});

Template.appMonitor.events({
   'keyup #filter': function() {
//alert("hi");
       var rex = new RegExp($(this).val(), 'i');
       $('.searchable tr').hide();
       $('.searchable tr').filter(function () {
           return rex.test($(this).text());
       }).show();

   }
});

$('#example').dataTable({
    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>", "sPaginationType": "bootstrap", "oLanguage": {
        "sLengthMenu": "_MENU_ records per page"
    }
});

var appendRows = function(){

    $("#specialTable tr:first").append("<td><a href=''>Delete</a> Col "+(1)+"</td>");


//    $('#specialTable > tbody > tr').each(
//        function(){
//            alert(this);
//            var deleteCell = this.insertCell(-1);
//            var button = d
// document.createElement("button");
//            button.val("Delete");

//            button.html("")
//            deleteCell.appendChild(button);

//            deleteCell.html();
//            alert(button.val());

//            deleteCell.html("<td><button>Delete</button></td>");
//        }
//    )
}

var filter = function(selector, query){
    query = $.trim(query);
    query = query.replace(/ /gi, '|');

    $(selector).each(function(){
        ($(this).text().search(new RegExp(query, "i")) < 0) ? $(this).hide().removeClass('visible') : $(this).show().addClass('visible');
    })
}

var appendDelete = function(value, object){
    var html;
//    alert("Value -> " + value + "\nObject -> " + object);
    html = '<button style="color: orange; font-weight: bold">BUTTON</button>';
    return new Spacebars.SafeString(html);
}
var getCurrentPlanHelper = function (planGUID) {
    var currPlan = Prod_Plans.findOne({guid: planGUID});
    var parentPlan = Prod_Services.findOne({guid: currPlan.service_guid});


    $('#planTitle').text(currPlan.name);
    $('#myModalLabel').text(parentPlan.name);
    $('#urlSpan').html(" " + currPlan.url + " <br />");
    $('#createdSpan').html(" " + currPlan.created_at + " <br />");
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




