import { list } from "@keystone-next/keystone";
import { text, relationship, timestamp } from "@keystone-next/keystone/fields";

export const Comment = list({
    fields: {
        content: text({ validation: { isRequired: true } }),
        author: relationship({
            ref: "User.uploaded_comment",
        }),
        post: relationship({
            ref: "Post.comment"
        }),
        created_at: timestamp({ db: { updatedAt: true } })
    }
})