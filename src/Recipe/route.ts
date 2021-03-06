import { Router } from "express"
import { endpoint, HTTPError, needAuth } from "../../endpointTemplate";
import { BRIEF_POST_QUERY } from "../Post/route";
import { img2uri } from "../utils/imgur";

const WHOLE_RECIPE_QUERY = `
name
id
thumbnail
meat_type {
    label
    id
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
description
ingredient
linked_post {
    ${BRIEF_POST_QUERY}
}
`

export const getCuratedRecipe = endpoint(async (req, res) => {
    const allBriefRecipe = await req.context.query.Recipe.findMany({
        query: `
            id
            name
            thumbnail
            description
            meat_type {
                label
                id
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
                hearted_user: undefined,
                created_at: +new Date(recipe.created_at)
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

    if (queried) res.json({
        ...queried,
        linked_post: queried.linked_post.map((post: Record<string, string | number>) =>
        ({
            ...post, created_at: +new Date(post.created_at)
        })),
        created_at: +new Date(queried.created_at)
    })
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
        query: "steps"
    })
    res.json({
        ...queried,
        created_at: +new Date(queried.created_at)
    })
})

export const createRecipe = endpoint(async (req, res) => {
    const authed = needAuth(req)

    if (req.body.youtube && !req.body.youtube.match(/^[a-zA-Z0-9_-]{11}$/)) throw new HTTPError({
        message: "YOUTUBE_ID_NOT_CORRECT"
    })

    const createdRecipe = await req.context.query.Recipe.createOne({
        data: {
            ...req.body,
            author: { connect: { id: authed.id } },
            difficulty: {
                connect: {
                    id: req.body.difficulty
                }
            }
        },
        query: WHOLE_RECIPE_QUERY
    })

    res.json(createdRecipe)
})

export const getDifficultyLists = endpoint(async (req, res) => {
    const difficulties = await req.context.query.Difficulty.findMany({
        query: `label, numeric_level, id`
    })

    return res.json(difficulties)
})

const heartRecipe = endpoint(async (req, res) => {
    const authed = needAuth(req)
    const update = await req.context.query.Recipe.updateOne({
        where: {
            id: req.params.id
        },
        data: {
            hearted_user: {
                connect: {
                    id: authed.id
                }
            }
        }
    })

    return res.json(update)
})

const bookmarkRecipe = endpoint(async (req, res) => {
    const authed = needAuth(req)
    const update = await req.context.query.Recipe.updateOne({
        where: {
            id: req.params.id
        },
        data: {
            bookmarked_user: {
                connect: {
                    id: authed.id
                }
            }
        }
    })

    return res.json(update)
})

const unheartRecipe = endpoint(async (req, res) => {
    const authed = needAuth(req)
    const update = await req.context.query.Recipe.updateOne({
        where: {
            id: req.params.id
        },
        data: {
            hearted_user: {
                disconnect: {
                    id: authed.id
                }
            }
        }
    })

    return res.json(update)
})

const unbookmarkRecipe = endpoint(async (req, res) => {
    const authed = needAuth(req)
    const update = await req.context.query.Recipe.updateOne({
        where: {
            id: req.params.id
        },
        data: {
            bookmarked_user: {
                disconnect: {
                    id: authed.id
                }
            }
        }
    })

    return res.json(update)
})

const router = Router()
router.get('/curated', getCuratedRecipe);
router.get('/difficulty', getDifficultyLists);
router.post('/:id/heart', heartRecipe);
router.post('/:id/bookmark', bookmarkRecipe);
router.delete('/:id/heart', unheartRecipe);
router.delete('/:id/bookmark', unbookmarkRecipe);
router.get('/:id/step', getRecipeStep);
router.get('/:id', getSpecificRecipe);
router.post('/', createRecipe);

export { router as recipeRouter }
