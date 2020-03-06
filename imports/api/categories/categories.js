import { Categories, Events, Instances } from '../cols.js'

Meteor.methods({
    "categories.upsert" ({ oldBot, ...rest }) {
        return Categories.upsert({ bottom: oldBot ? oldBot : false }, { $set: rest }, (err, res) => {
            if (err) {
                throw new Meteor.Error(err)
            }
            if (!res.insertedId) {
                const { top: t, bottom: b } = rest
                Events.update({ bottom1: oldBot }, { $set: { bottom1: b, top1: t } }, { multi: true })
                Events.update({ bottom2: oldBot }, { $set: { bottom2: b, top2: t } }, { multi: true })
                Events.update({ bottom3: oldBot }, { $set: { bottom3: b, top3: t } }, { multi: true })
                Instances.update({ bottom1: oldBot }, { $set: { bottom1: b, top1: t } }, { multi: true })
                Instances.update({ bottom2: oldBot }, { $set: { bottom2: b, top2: t } }, { multi: true })
                Instances.update({ bottom3: oldBot }, { $set: { bottom3: b, top3: t } }, { multi: true })
            }
        })
    },
    "categories.remove" (bottom) {
        Categories.remove({ bottom })
        const b = bottom
        Events.update({ bottom1: b }, { $unset: { bottom1: "", top1: "" } }, { multi: true })
        Events.update({ bottom2: b }, { $unset: { bottom2: "", top2: "" } }, { multi: true })
        Events.update({ bottom3: b }, { $unset: { bottom3: "", top3: "" } }, { multi: true })
        Instances.update({ bottom1: b }, { $unset: { bottom1: "", top1: "" } }, { multi: true })
        Instances.update({ bottom2: b }, { $unset: { bottom2: "", top2: "" } }, { multi: true })
        Instances.update({ bottom3: b }, { $unset: { bottom3: "", top3: "" } }, { multi: true })
    },
    "categories.updateAllTop" ({ bot, val }) {
        const { top } = Categories.findOne({ bottom: bot })
        var t=val
        Categories.update({ top }, { $set: { top: val } }, { multi: true })
        Events.update({ top1: top }, { $set: { top1: t } }, { multi: true })
        Events.update({ top2: top }, { $set: { top2: t } }, { multi: true })
        Events.update({ top3: top }, { $set: { top3: t } }, { multi: true })
        Instances.update({ top1: top }, { $set: { top1: t } }, { multi: true })
        Instances.update({ top2: top }, { $set: { top2: t } }, { multi: true })
        Instances.update({ top3: top }, { $set: { top3: t } }, { multi: true })
    },
})
