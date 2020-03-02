import './buyTickets.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tickets, Events, Instances, Users } from '/imports/api/cols.js'
import r from 'ramda'
import moment from 'moment'
import '/imports/ui/components/imageShow/imageShow.js'


Template.buyTickets.onCreated(function() {
    SubsCache.subscribe('events.all')
    SubsCache.subscribe('instances.all')
    SubsCache.subscribe('tickets.all')
    SubsCache.subscribe('users.all')

    this.autorun(() => {
        if (SubsCache.ready()) {
            this.event = Events.findOne(Instances.findOne(FlowRouter.getParam('id')).eventId)
            this.instance = Instances.findOne(FlowRouter.getParam('id'))
            const {event: e, instance: i} = this
            if (!e || !e.publicity){
                const u = Users.findOne(event.userId)
                const f = u.friends.filter(x=>{
                    return x.targetId == Meteor.userId() && !!event[x.type]
                })
                if (f.length = 0){
                    FlowRouter.go('App.home')
                }
            }
        }
    })
});

Template.buyTickets.helpers({
    event() {
        const a = Events.findOne(Instances.findOne(FlowRouter.getParam('id')).eventId)
        return a
    },
    instance() {
        return Instances.findOne(FlowRouter.getParam('id'))
    },
    images() {
        const a = Events.findOne(Instances.findOne(FlowRouter.getParam('id')).eventId).images
        return a
    },
});

Template.buyTickets.events({
    'click .buyJs' (e, t) {
        Meteor.call('ticket.buy', t.instance, (err, res) => {
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
    },
    'click .testJs'(){
        Meteor.call('test', (err,res)=>{
            console.log(res)
        })
    }
});

Template.buyTickets.onDestroyed(function() {})

Template.buyTickets.onRendered(function() {
    this.autorun(() => {
        if (SubsCache.ready()) {
            const tk = Tickets.findOne({ userId: Meteor.userId(), instanceId: FlowRouter.getParam('id'), paid: true })
            if (tk) {
                $('#qrcode').qrcode({
                    size: 400,
                    text: tk._id
                });
            }
        }
    })
})
