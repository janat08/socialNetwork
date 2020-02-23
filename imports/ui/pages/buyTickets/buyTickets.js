import './buyTickets.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tickets, Events } from '/imports/api/cols.js'
import r from 'ramda'
import moment from 'moment'


Template.buyTickets.onCreated(function() {
    SubsCache.subscribe('events.all')
    SubsCache.subscribe('tickets.all')
});

Template.buyTickets.helpers({
    event() {
        return Events.findOne(FlowRouter.getParam('id'))
    }
});

Template.buyTickets.events({
    'click .buyJs' (e, t) {
        Meteor.call('ticket.buy', this, (err, res) => {
            if (res) {
                Session.set('purchasingTicket', res)
            }
        })
    },
    'click .acceptJs' (e, t) {
        const ticket = Session.get('purchasingTicket')
        if (!ticket) {
            alert('no purchasing')
            return
        }
        Meteor.call('ticket.accept', ticket, (err, res) => {
            if (res) {
                Session.set('purchasingTicket', false)
            }
        })
    }
});

Template.buyTickets.onDestroyed(function() {})

Template.buyTickets.onRendered(function() {
    this.autorun(() => {
        if (SubsCache.ready()) {
            const {_id} = Tickets.findOne({ userId: Meteor.userId(), eventId: FlowRouter.getParam('id') })
            if (_id) {
                $('#qrcode').qrcode({
                    size: 400,
                    text: _id
                });
            }
        }
    })
})
