import SimpleSchema from 'simpl-schema';
export default new SimpleSchema({
    accepted: {
        type: Boolean,
        optional: true
    },
    rejected: {
        type: Boolean,
        optional: true
    },
    ignored: {
        type: Boolean,
        optional: true
    },
    pending: {
        type: Boolean,
    },
    dateSent: {
        type: String
    },
    requestee: {
        type: SimpleSchema.RegEx.Id
    },
    requester: {
        type: SimpleSchema.RegEx.Id
    },
    dateReplied: {
        type: String,
        optional: true,
    }
});