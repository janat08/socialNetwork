import SimpleSchema from 'simpl-schema';
export default new SimpleSchema({
    kind: {
        type: String
    },
    users: {
        type: Array,
        minCount: 2,
        maxCount: 2
    },
    "users.$": SimpleSchema.RegEx.Id
});