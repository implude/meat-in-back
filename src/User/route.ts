import { KeystoneContext } from "@keystone-next/keystone/types";
import { Router } from "express"
import { checkReq, endpoint, HTTPError } from "../../endpointTemplate";

const LOGIN_QUERY = `mutation($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
        ... on UserAuthenticationWithPasswordSuccess {
            sessionToken
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
    console.log(authedUser)
    return authedUser.authenticateUserWithPassword.sessionToken
}

export const createUser = endpoint(async (req, res) => {
    checkReq(req.body, ['name', 'photo', 'email', 'password'])
    const createdUser = await req.context.query.User.createOne({
        data: {
            ...req.body
        }
    })

    const accessToken = await getTokenWithEmailAndPassword(req.body.email, req.body.password, req.context)
    console.log(accessToken)
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

const router = Router()
router.post('/', createUser)

export { router as userRouter }
