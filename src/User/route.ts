import { Router } from "express"
import { endpoint, HTTPError } from "../../endpointTemplate";

export const createUser = endpoint(async (req, res) => {
    req.context.query.User.createOne({
        data: { 
            ...req.body
        }
    })
})

const router = Router()
router.post('/', createUser)

export { router as recipeRouter }
