import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    _id: { type: String },
    emails: { type: Array },
    'emails.$': { type: Object },
    'emails.$.address': { type: String },
    'emails.$.verified': { type: Boolean },
    createdAt: { type: Date },
    services: { type: Object, blackbox: true },
    profile: {
        type: Object,
        optional: true
    },
    'profile.firstname': {
        type: String,
        optional: true
    },
    'profile.lastname': {
        type: String,
        optional: true
    },
    friendsIds: {
        type: Array
    },
    "friendsIds.$": {
        type: SimpleSchema.RegEx.Id
    },
    requestsIds: {
        type: Array
    },
    "requestsIds.$": {
        type: SimpleSchema.RegEx.Id
    },
    wallIds: {
        type: Array
    },
    "wallIds.$": {
        type: SimpleSchema.RegEx.Id
    },
});
