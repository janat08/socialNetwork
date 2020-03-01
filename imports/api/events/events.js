import { ImagesFiles, Categories, Events, Tickets, Instances, Users } from '../cols.js'
import moment from 'moment'
import qr from 'qr-image'



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
                city: rest.administrative_area_level_2,
                frontCover,
                publicity,
            }
        }, { multi: true })
        const { friends, besties, colleague, family, title, description } = rest
        const linksToEvents = Instances.find({ eventId: _id }).fetch().map(x=>{
            return `<a href="/buy/${x._id}> ${x.totalStart}-${x.totalEnd} </a>`
        }).reduce((a,x)=>a+x, " ")
        if (publicity == false) {
            function invite(t) {
                Meteor.call('posts.insert', { friendIds: [t], title, content: description+linksToEvents, imageIds: limitedImages.sort((x,y)=>x == frontCover? -1: 1) })
            }
            const u = Users.findOne(this.userId)
            u.friends.forEach(x => {
                const t = x.type
                if (friends && t == 'friends') {
                    invite('friends')
                }
                else if (besties && t == 'besties') {
                    invite('besties')
                }
                else if (colleague && t == 'colleague') {
                    invite('colleague')
                }
                else if (family) {
                    invite('family')
                }
            })
        }
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
    'test' () {
        const qrr = qr.imageSync('asdff')

        ImagesFiles.write(qrr, {
            // fileName: 'qr.png',
            // fielId: 'abc123myId', //optional
            // type: 'image/png'
        }, function(writeError, fileRef) {
            if (writeError) {
                throw writeError;
            }
            else {
                console.log(fileRef.name + ' is successfully saved to FS. _id: ' + fileRef._id, ImagesFiles.findOne(fileRef._id).link());
                ImagesFiles.findOne(fileRef._id).link()
            }
        });
        return 'asdf'
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

Meteor.call('test')
