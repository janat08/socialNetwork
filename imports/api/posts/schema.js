import SimpleSchema from 'simpl-schema';
export default new SimpleSchema({
    authorId: {
        type: SimpleSchema.RegEx.Id
    },
    content: {
        type: String,
        optional: true
    },
    imageId: {
        type: SimpleSchema.RegEx.Id,
        optional: true,
    },
    title: {
        type: String,
    },
    instanceIds: {
        type: Array,
        optional: true,
    },
    "instanceIds.$": {
        type: String
    }
})
