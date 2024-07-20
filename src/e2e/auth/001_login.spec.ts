import { expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { LoggedUserProps, login, LoginProps, RegisterProps } from '../../controllers/auth.controllers';
import { deleteUser, register } from '../helper';
test.describe('It should test user login API endpoints', {
  tag: '@auth @login'
} ,async () => {
  // The mode can be serial or parallel depending on the link between the sub-tests
  test.describe.configure({mode:'serial'})
  const OneMillisecond = 1000
  const userCredentials: RegisterProps = {
    email: "test_setup_email@invalid.invalid",
    username: "test_setup_username",
    password: "test_setup_password"
  }
  const loginWithUsernameCredentials: LoginProps = {
    username: "test_setup_username",
    password: "test_setup_password"
  }
  const loginWithEmailCredentials: LoginProps = {
    email: "test_setup_email@invalid.invalid",
    password: "test_setup_password"
  }


  // Add your setup data
  test.beforeAll( async( )=> {
    await register(userCredentials)
  })
  // Clean your setup data
  test.afterAll( async()=> {
    await deleteUser(userCredentials.username)
  })

  test('It should sucessfully login a user using email', async ({ request }) => {
    const timestampBeforeLoginInSecond = Date.now() / OneMillisecond
    const response = await request.post('auth/login', {
      data: loginWithEmailCredentials
    })

    expect(response.status()).toEqual(StatusCodes.OK)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson.exp).toBeGreaterThan(timestampBeforeLoginInSecond)
    expect(responseJson).toEqual(expect.objectContaining({
      email: userCredentials.email,
      username: userCredentials.username,
      isAdmin:false,
    }))
  })

  test('It should sucessfully login a user using username', async ({ request }) => {
    const timestampBeforeLoginInSecond = Date.now() / OneMillisecond
    const response = await request.post('auth/login', {
      data: loginWithUsernameCredentials
    })
    expect(response.status()).toEqual(StatusCodes.OK)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson.exp).toBeGreaterThan(timestampBeforeLoginInSecond)
    expect(responseJson).toEqual(expect.objectContaining({
      email: userCredentials.email,
      username: userCredentials.username,
      isAdmin:false,
    }))
  })

  test('It should fail to login a user with an incorrect password', async ({ request }) => {
    const response = await request.post('auth/login', {
      data: {
        email: loginWithEmailCredentials.email,
        password: "incorrect_Password"
      }
    })
    expect(response.status()).toEqual(StatusCodes.FORBIDDEN)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson).toEqual({
      error: 'Invalid password',
    })
  })

  test('It should fail to login a user with providing only username', async ({ request }) => {
    const response = await request.post('auth/login', {
      data: {
        username: loginWithUsernameCredentials.username
      }
    })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson).toEqual({
      error: 'Password is required',
    })
  })

  test('It should fail to login a user with providing only email', async ({ request }) => {
    const response = await request.post('auth/login', {
      data: {
        email: loginWithEmailCredentials.email
      }
    })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson).toEqual({
      error: 'Password is required',
    })
  })

  test('It should fail to login a user with providing only password', async ({ request }) => {
    const response = await request.post('auth/login', {
      data: {
        password: loginWithEmailCredentials.password
      }
    })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson).toEqual({
      error: 'Email or username is required',
    })
    })

  test('It should fail to login a username that doesn\'t exist', async ({ request }) => {
    const response = await request.post('auth/login', {
      data: {
        username: 'unexisting_user',
        password: loginWithEmailCredentials.password
      }
    })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson).toEqual({
      error: 'A user with that username doesn\'t exists',
    })
    })
  
  test('It should fail to login a email that doesn\'t exist', async ({ request }) => {
    const response = await request.post('auth/login', {
      data: {
        email: 'existing_user@invalid.invalid',
        password: loginWithEmailCredentials.password
      }
    })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson).toEqual({
      error: 'A user with that email doesn\'t exists',
    })
    })
  
  test('It should fail to login a user using a good username but a wrong password', async ({request})=> {
    const response = await request.post('auth/login', {
      data: {
        username: loginWithUsernameCredentials.username,
        password: 'invalid_password_125478'
      }
    })
    expect(response.status()).toEqual(StatusCodes.FORBIDDEN)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson).toEqual({
      error: 'Invalid password',
    })
  })

  test('It should fail to login a user using a good email but a wrong password', async ({request})=> {
    const response = await request.post('auth/login', {
      data: {
        email: loginWithEmailCredentials.email,
        password: 'invalid_password_125478'
      }
    })
    expect(response.status()).toEqual(StatusCodes.FORBIDDEN)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson).toEqual({
      error: 'Invalid password',
    })
  })
})
