import { list } from "@keystone-next/keystone";
import { text } from "@keystone-next/keystone/fields";

export const Ad = list({
    fields: {
        image: text({ validation: { isRequired: true } }),
        title: text({ validation: { isRequired: true } }),
        description: text({ validation: { isRequired: true } }),
        target_url: text({ validation: { isRequired: true } }),
    }
})
