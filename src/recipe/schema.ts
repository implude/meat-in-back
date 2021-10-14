import { list } from "@keystone-next/keystone";
import { text, relationship, integer, json, timestamp } from "@keystone-next/keystone/fields";

export const Recipe = list({
    fields: {
        "thumbnail": text({ validation: { isRequired: true } }),
        "name": text({ validation: { isRequired: true } }),
        "description": text({ validation: { isRequired: true } }),
        "author": relationship({
            ref: 'User.uploaded_recipe',
        }),
        "duration": integer({ validation: { isRequired: true } }),
        "difficulty": relationship({
            ref: 'Difficulty',
        }),
        "hearted_user": relationship({
            ref: 'User.hearted_recipe',
            many: true
        }),
        "youtube": text({ validation: { isRequired: true } }),
        "ingredient": json(),
        "linked_post": relationship({
            ref: 'Post.linked_recipe',
            many: true
        }),
        created_at: timestamp({ db: { updatedAt: true } }),
        "meat_type": relationship({
            ref: "MeatType",
        }),
        bookmarked_user: relationship({
            ref: "User.bookmarked_recipe",
            many: true
        }),
        "steps": json()
    }
})
