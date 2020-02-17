import './upsertCategory.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Categories } from '/imports/api/cols.js'

Template.upsertCategory.onCreated(function() {
    SubsCache.subscribe('categories.all')
});

Template.upsertCategory.helpers({
    category() {
        const bottom = FlowRouter.getParam('bottom')
        return Categories.findOne({ bottom }) || {}
    }
});

Template.upsertCategory.events({
    'deleteJs' (e, t) {
        Meteor.call('category.remove', FlowRouter.getParam('bottom'))
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
        
        Meteor.call('categories.upsert', {oldBot: FlowRouter.getParam('bottom'), ...document}, (err, suc)=>{
            if (suc){
                FlowRouter.go('App.upsertCategoryBt', {bottom: bV})
            }
        })
    }
});

Template.upsertCategory.onDestroyed(function() {

})
