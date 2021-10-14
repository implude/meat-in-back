import { list } from "@keystone-next/keystone";
import { text, relationship } from "@keystone-next/keystone/fields";

export const Badge = list({
    fields: {
        image: text({ validation: { isRequired: true } }),
        label: text({ validation: { isRequired: true } }),
        description: text({ validation: { isRequired: true } }),
        owner: relationship({
            ref: 'User.badge_list',
        })
    }
})
