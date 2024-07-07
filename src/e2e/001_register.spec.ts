import { APIRequestContext, expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { LoggedUserProps, LoginProps, RegisterProps } from '../controllers/auth.controllers';
test.describe('It should test user register API Endpoints @auth', async ()=> {

  const setupUserCredentials: RegisterProps = {
    username: 'setup_user',
    email: 'setup_user@invalid.invalid',
    password: 'Setup_user_password',
  }
  const newUserCredentials: RegisterProps = {
    username: 'test_registered_user',
    email: 'test_registered_user@invalid.invalid',
    password: 'E{.X-A8UhV~()*mRpbjgDc',
  }
  const adminCredentials: LoginProps = {
    username: "admin",
    password: 'admin'
  }

  test.beforeAll( async( {request} ) => {
    await register(request, setupUserCredentials)
  })

  test.afterAll( async({request})=> {
  const token = await getUserToken(request, adminCredentials)
  setupUserCredentials.username && await deleteUser(request, setupUserCredentials.username, token)
  newUserCredentials.username && await deleteUser(request, newUserCredentials.username, token)
  })

  test('It should successfully register a new user', async ({request}) => {
    const response = await request.post("auth/register", {
      data: newUserCredentials
    })
    const responseJson = await response.json()
    expect(responseJson).toEqual({
       message: "Your account is created.", 
       username: newUserCredentials.username 
    })
    expect(response.status()).toEqual(StatusCodes.OK)
  })
  
  test('It should not allow registration with an existing email', async ({request}) => {
    const response = await request.post("auth/register", {
      data: {...setupUserCredentials, username: "test_username"}
    })
    const responseJson = await response.json()
    expect(responseJson).toEqual({
      error: 'A user with that email already exists'
    })
    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
  })

  test('It should not allow registration with an existing username', async ({request}) => {
    const response = await request.post("auth/register", {
      data: {...setupUserCredentials, email: "test_registered_user_second_email@invalid.invalid"}
    })
    const responseJson = await response.json()
    expect(responseJson).toEqual({
      error: `A user with that username already exists`
    })
    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
  })

  test('It should fail registering a new user without a username', async ({request}) => {
    const credentialsWithoutUsername = {...setupUserCredentials} as Partial<RegisterProps>
    delete credentialsWithoutUsername.username
    const response = await request.post("auth/register", {
      data: credentialsWithoutUsername
    })

    const responseJson = await response.json()
    expect(responseJson).toEqual({
       error: "Username is required"
      })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
  })

  test('It should fail registering a new user without an email', async ({request}) => {
    const credentialsWithoutEmail = {...setupUserCredentials} as Partial<RegisterProps>
    delete credentialsWithoutEmail.email
    const response = await request.post("auth/register", {
      data: credentialsWithoutEmail
    })

    const responseJson = await response.json()
    expect(responseJson).toEqual({
       error: "Email is required"
      })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
  })

  test('It should fail registering a new user without a password', async ({request}) => {
    const credentialsWithoutPassword = {...setupUserCredentials} as Partial<RegisterProps>
    delete credentialsWithoutPassword.password
    const response = await request.post("auth/register", {
      data: credentialsWithoutPassword
    })

    const responseJson = await response.json()
    expect(responseJson).toEqual({
       error: "Password is required"
      })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
  })
})

async function register(request: APIRequestContext, data: RegisterProps) {
  await request.post("auth/register", {
    data
  })
}

async function getUserToken (request: APIRequestContext, AuthProps: LoginProps) {
  const reponse = await request.post('auth/login',{
    data: AuthProps
  })

  const { accessToken } =  (await reponse.json()) as LoggedUserProps
  return accessToken
}

async function deleteUser (request: APIRequestContext, username: string, token:string) {
  await request.delete('users/delete', {
    data: {
      username
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}