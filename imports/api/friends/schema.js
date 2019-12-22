import SimpleSchema from 'simpl-schema';
export default new SimpleSchema({
    type: {
        type: String //besties, family, friends, colleague
    },
    owner: {
        type: String,
        optional: true,
    },
    target: {
        type: String
    },
    blocked: {
        type: Boolean,
        optional: true,
    },
    startDate: {
        type: String
    }
});