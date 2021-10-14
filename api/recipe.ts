import { endpoint } from "../endpointTemplate";

export const getCuratedRecipe = endpoint(async (req, res) => {
    const allBriefRecipe = await req.context.query.Recipe.findMany({
        query: `
            name
            thumbnail
            meat_type {
                label
            }
            duration
            difficulty {
                label
                numeric_level
            }
            created_at
            hearted_user {
                id
            }
        `
    })
    res.json(
        [...allBriefRecipe]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5)
            .map(recipe => ({
                ...recipe,
                heart: {
                    count: recipe.hearted_user.length,
                    hearted: Math.random() > 0.5
                },
                hearted_user: undefined
            }))
    )
})
