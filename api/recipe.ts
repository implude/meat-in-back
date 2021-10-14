import { endpoint, HTTPError } from "../endpointTemplate";
import { BRIEF_POST_QUERY } from "./post";

const WHOLE_RECIPE_QUERY = `
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
author {
    name,
    photo,
    id
}
youtube
ingredient
linked_post {
    ${BRIEF_POST_QUERY}
}
`

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

export const getSpecificRecipe = endpoint(async (req, res) => {
    if (typeof req.params.id !== 'string') {
        throw new HTTPError({
            message: "RECIPE_ID_NOT_CORRECT"
        })
    }

    const queried = await req.context.query.Recipe.findOne({
        where: {
            id: req.params.id
        },
        query: WHOLE_RECIPE_QUERY
    })

    if (queried) res.json(queried)
})

export const getRecipeStep = endpoint(async (req, res) => {
    if (typeof req.params.id !== 'string') {
        throw new HTTPError({
            message: "RECIPE_ID_NOT_CORRECT"
        })
    }
    const queried = await req.context.query.Recipe.findOne({
        where: {
            id: req.params.id
        },
        query: "step"
    })
    res.json(queried)
})

export const createRecipe = endpoint(async (req, res) => {
    const createdRecipe = await req.context.query.Recipe.createOne({
        // TODO: IMPLEMENT AUTHOR, EXAMPLE: NUTYWORKS
        data: { ...req.body, author: { connect: { id: "ckuphca1e0164tl9o8xl3iqvs" } } },
        query: WHOLE_RECIPE_QUERY
    })

    if (createdRecipe.id) res.json(createdRecipe)
})

export const getDifficultyLists = endpoint(async (req, res) => {
    const difficulties = await req.context.query.Difficulty.findMany({
        query: `label numeric_level`
    })

    return res.json(difficulties)
})
