import SimpleSchema from 'simpl-schema';
export default new SimpleSchema({
    ownerIds: {
        type: Array,
        optional: true,
    },
    "ownerIds.$": {
        type: SimpleSchema.RegEx.Id,
    },
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
    }
})
