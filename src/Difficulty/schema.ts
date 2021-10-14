import { list } from "@keystone-next/keystone";
import { text, integer } from "@keystone-next/keystone/fields";

export const Difficulty = list({
    fields: {
        label: text({ validation: { isRequired: true } }),
        numeric_level: integer({ validation: { isRequired: true } }),
    }
})