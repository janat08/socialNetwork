import { ImagesFiles, Categories, Events, Tickets, Instances } from '../cols.js'
import moment from 'moment'
Meteor.methods({
    'events.start' () {
        return Events.insert({ userId: this.userId, start: true, startDate: new Date() })
    },
    "events.upsert" ({ publicity, _id, top1, bottom1, top2, bottom2, top3, bottom3, images, lat, lng, frontCover, ...rest }) {
        // images length
        console.log('upsert', 'remove excess images', images[0])
        const limitedImages = images.filter((x, i) => i < 11 || x == frontCover)
        images.filter((x, i) => i > 10 || x != frontCover).forEach(x => ImagesFiles.remove(x))
        console.log(limitedImages, limitedImages.length)
        if (!Categories.findOne({ top: top1, bottom: bottom1 })) throw new Meteor.Error('category1 non-existent')
        if (!Categories.findOne({ top: top2, bottom: bottom2 })) throw new Meteor.Error('category2 non-existent')
        if (!Categories.findOne({ top: top3, bottom: bottom3 })) throw new Meteor.Error('category3 non-existent')
        Events.upsert(_id, {
            $set: {
                start: false,
                location: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                top1,
                publicity,
                bottom1,
                top2,
                bottom2,
                top3,
                bottom3,
                ...rest,
                images: limitedImages,
                frontCover,
                userId: this.userId
            }
        })
        Instances.update({ eventId: _id }, {
            $set: {
                top1,
                bottom1,
                top2,
                bottom2,
                top3,
                bottom3,
                location: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                frontCover,
                publicity,
            }
        }, { multi: true })
    },
    "instance.add" (i) {
        if (!i.startTime || !i.endTime) throw new Meteor.Error('specify time')
        i.totalStart = moment(i.start).hour(i.startTime.split(":")[0]).minute(i.startTime.split(":")[1]).toDate()
        i.totalEnd = moment(i.end).hour(i.endTime.split(":")[0]).minute(i.endTime.split(":")[1]).toDate()
        try {
            return Instances.insert({ ...i });
        }
        catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    },
    "instance.edit" (event) {
        console.log(event)
        try {
            return Instances.update(event._id, {
                $set: event
            });
        }
        catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    },
    "instance.remove" (event) {
        try {
            return Instances.remove(event);
        }
        catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    },
    "ticket.buy" ({ _id, totalStart }) {
        if (!this.userId) throw new Meteor.Error('login')
        return Tickets.insert({ instanceId: _id, totalStart, userId: this.userId, paid: false, date: new Date() })
    },
    "ticket.accept" (id) {
        const ticket = Tickets.findOne(id)
        Meteor.call('mail.create', {
            recepients: [this.userId],
            body: `Thank you 
        for purchasing the ticket, the tickets qr code can be found at: ` +
                Meteor.absoluteUrl('buy/' + id),
            subject: 'Ticket for ' + ticket.title
        })
        return Tickets.update(id, { $set: { paid: true } })
    }
})
