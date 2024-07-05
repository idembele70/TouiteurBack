import { APIRequestContext, expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { LoggedUserCredentials, LoginCredentials } from '../controllers/auth.controllers';
test.describe('It should test user register API Endpoints', async ()=> {

  test.describe.configure({mode:'serial'})

  const newUserCredentials: LoginCredentials= {
    username: 'test_registered_user',
    email: 'test_registered_user@invalid.invalid',
    password: 'E{.X-A8UhV~()*mRpbjgDc',
  }
  const adminCredentials: Partial<LoginCredentials> = {
    username: "admin",
    password: 'admin'
  }

  test.afterAll( async({request})=> {
  const token = await getUserToken(request, adminCredentials)
  await deleteUser(request, newUserCredentials.username, token)
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
      data: {...newUserCredentials, username: "test_username"}
    })
    const responseJson = await response.json()
    expect(responseJson).toEqual({
      error: `A user with that email already exists`
    })
    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
  })

  test('It should not allow registration with an existing username', async ({request}) => {
    const response = await request.post("auth/register", {
      data: {...newUserCredentials, email: "test_registered_user_second_email@invalid.invalid"}
    })
    const responseJson = await response.json()
    expect(responseJson).toEqual({
      error: `A user with that username already exists`
    })
    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
  })

  test('It should fail registering a new user without a username', async ({request}) => {
    const credentialsWithoutUsername = {...newUserCredentials} as Partial<LoginCredentials>
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
    const credentialsWithoutEmail = {...newUserCredentials} as Partial<LoginCredentials>
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
    const credentialsWithoutPassword = {...newUserCredentials} as Partial<LoginCredentials>
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

async function getUserToken (request: APIRequestContext, loginCredentials: Partial<LoginCredentials>) {
  const reponse = await request.post('auth/login',{
    data: loginCredentials
  })

  const { accessToken } =  (await reponse.json()) as LoggedUserCredentials
  return accessToken
}

async function deleteUser (request: APIRequestContext, username: string, token:string) {
  const response = await request.delete('users/delete', {
    data: {
      username
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}