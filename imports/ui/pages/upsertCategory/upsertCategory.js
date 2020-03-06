import './upsertCategory.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Categories } from '/imports/api/cols.js'
import r from 'ramda'

Template.upsertCategory.onCreated(function() {
    SubsCache.subscribe('categories.all')
});

Template.upsertCategory.helpers({
    category() {
        const bottom = FlowRouter.getParam('bottom')
        return Categories.findOne({ bottom }) || {}
    },
    cats(){
        return Categories.find().fetch()
    }
});

Template.upsertCategory.events({
    'click .updateAllTop' (e,t){
        Meteor.call('categories.updateAllTop', {bot: FlowRouter.getParam('bottom'), val: $('.topJs').val()})
    },
    'click .deleteJs' (e, t) {
        Meteor.call('categories.remove', FlowRouter.getParam('bottom'))
    },
    'submit #upsertCategory' (e, t) {
        e.preventDefault();
        const target = e.target;

        const {
            top: { value: tV },
            bottom: { value: bV },
        } = target

        var document = {
            top: tV,
            bottom: bV
        }

        Meteor.call('categories.upsert', { oldBot: FlowRouter.getParam('bottom'), ...document }, (err, suc) => {
            if (suc) {
                $('.topJs').val("")
                $('.botJs').val('')
            }
        })
    }
});

Template.upsertCategory.onDestroyed(function() {

})
