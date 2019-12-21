import SimpleSchema from 'simpl-schema';
export default new SimpleSchema({
    status: {
        type: String //accepted, rejected, ignored, pending
    },
    date: {
        type: String
    },
    requestee: {
        type: SimpleSchema.RegEx.Id
    },
    requester: {
        type: SimpleSchema.RegEx.Id
    }
});