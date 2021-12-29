import { list } from "@keystone-next/keystone";
import { text } from "@keystone-next/keystone/fields";

export const MeatType = list({
    fields: {
        label: text({ validation: { isRequired: true } })
    }
})