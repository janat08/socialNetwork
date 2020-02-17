import './browseEvents.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Users, ImagesFiles } from '/imports/api/cols.js'

Template.browseEvents.onCreated(function() {
    SubsCache.subscribe('images.all')
});

Template.browseEvents.helpers({
    
});

Template.browseEvents.events({
    
});

Template.browseEvents.onDestroyed(function() {})
