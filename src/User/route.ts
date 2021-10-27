import { KeystoneContext } from "@keystone-next/keystone/types";
import { Router } from "express"
import jwt from "jsonwebtoken"
import { sessionSecret } from "../../auth";
import { checkReq, endpoint, HTTPError, needAuth } from "../../endpointTemplate";

const LOGIN_QUERY = `mutation($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
        ... on UserAuthenticationWithPasswordSuccess {
            sessionToken
            item {
                id
                name
            }
        }
    }
}`

const getTokenWithEmailAndPassword = async (email: string, password: string, context: KeystoneContext) => {
    const authedUser = await context.graphql.run({
        query: LOGIN_QUERY,
        variables: {
            email: email,
            password: password
        }
    })

    const token = jwt.sign({
        id: authedUser.authenticateUserWithPassword.item.id,
        name: authedUser.authenticateUserWithPassword.item.name,
    }, sessionSecret)

    return token
}

export const createUser = endpoint(async (req, res) => {
    checkReq(req.body, ['name', 'photo', 'email', 'password'])
    await req.context.query.User.createOne({
        data: {
            ...req.body
        }
    })

    const accessToken = await getTokenWithEmailAndPassword(req.body.email, req.body.password, req.context)
    res.json({
        accessToken
    })
})

export const loginWithUserNameAndPassword = endpoint(async (req, res) => {
    const accessToken = await getTokenWithEmailAndPassword(req.body.email, req.body.password, req.context)
    res.json({
        accessToken
    })
})

export const getMyInfo = endpoint(async (req, res) => {
    const authed = needAuth(req)

    const user = await req.context.query.User.findOne({
        where: {
            id: authed.id
        },
        query: `
            name,
            photo,
            rep_badge {
                image
                label
            }
        `
    })

    console.log(user)
    res.json(user)
})

const router = Router()
router.post('/', createUser)
router.post('/login', loginWithUserNameAndPassword)
router.get('/me', getMyInfo)

export { router as userRouter }
