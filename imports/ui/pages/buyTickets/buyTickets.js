import './buyTickets.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Categories, Events } from '/imports/api/cols.js'
import r from 'ramda'
import moment from 'moment'


Template.buyTickets.onCreated(function() {
    SubsCache.subscribe('events.all')

});

Template.buyTickets.helpers({
    event() {
        return Events.findOne(FlowRouter.getParam('id'))
    }
});

Template.buyTickets.events({
'click .buyJs'(e,t){
    Meteor.call('ticket.buy', this, (err, res)=>{
        if (res){
            Session.set('purchasingTicket', res)
        }
    })
},
'click .acceptJs'(e,t){
    const ticket = Session.get('purchasingTicket')
    if (!ticket) {
        alert('no purchasing')
        return
    }
    Meteor.call('ticket.accept', ticket, (err,res)=>{
        if (res){
            Session.set('purchasingTicket', false)
        }
    })
}
});

Template.buyTickets.onDestroyed(function() {})

Template.buyTickets.onRendered(function() {
    console.log('sdf', $('#qrcode'))
    this.autorun(()=>{
        if (SubsCache.ready()){
            console.log(123)
        }
    })
    $('#qrcode').qrcode({
      size: 400,
      text: "http://larsjung.de/qrcode"
    });
})
