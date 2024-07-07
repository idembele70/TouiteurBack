import { expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { RegisterProps } from '../../controllers/auth.controllers';
import { deleteUser, register } from '../helper';
test.describe('It should test user register API Endpoints ', {
  tag: '@auth @register'
} ,async ()=> {

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

  test.beforeAll( async( {request} ) => {
    await register(request, setupUserCredentials)
  })

  test.afterAll( async({request})=> {
  await deleteUser(request, setupUserCredentials.username)
  await deleteUser(request, newUserCredentials.username)
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

