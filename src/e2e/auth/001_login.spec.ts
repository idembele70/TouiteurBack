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
  const userData: RegisterProps = {
    email: "existing_user_login@invalid.invalid",
    username: "existing_user_for_login",
    password: "ExistingUserLoginPassword!2024"
  }

  const {email, username, password} = userData;
  // Add setup data
  test.beforeAll( async( )=> {
    await register(userData)
  })
  // Clean setup data
  test.afterAll( async()=> {
    await deleteUser(username)
  })

  test('It should sucessfully login a user using email', async ({ request }) => {
    const timestampBeforeLoginInSecond = Date.now() / OneMillisecond
    const response = await request.post('auth/login', {
      data: {email, password}
    })

    expect(response.status()).toEqual(StatusCodes.OK)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson.exp).toBeGreaterThan(timestampBeforeLoginInSecond)
    expect(responseJson).toEqual(expect.objectContaining({
      email,
      username,
      isAdmin:false,
    }))
  })

  test('It should sucessfully login a user using username', async ({ request }) => {
    const timestampBeforeLoginInSecond = Date.now() / OneMillisecond
    const response = await request.post('auth/login', {
      data: {username, password}
    })
    expect(response.status()).toEqual(StatusCodes.OK)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson.exp).toBeGreaterThan(timestampBeforeLoginInSecond)
    expect(responseJson).toEqual(expect.objectContaining({
      email,
      username,
      isAdmin:false,
    }))
  })

  test('It should fail to login a user with an incorrect password', async ({ request }) => {
    const response = await request.post('auth/login', {
      data: {
        email,
        password: "Invalid_Password!?-2024"
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
        username
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
      data: { email }
    })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson).toEqual({
      error: 'Password is required',
    })
  })

  test('It should fail to login a user with providing only password', async ({ request }) => {
    const response = await request.post('auth/login', {
      data: {password}
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
        username: 'unexisting_username',
        password
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
        email: 'existing_user_email@invalid.invalid',
        password
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
        username,
        password: 'invalid_password_12!?5478'
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
        email,
        password: 'invalid_password_?!:_125478'
      }
    })
    expect(response.status()).toEqual(StatusCodes.FORBIDDEN)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson).toEqual({
      error: 'Invalid password',
    })
  })
  
  test('It should fail to login a user without providing data', async ({request})=> {
    const response = await request.post('auth/login', {
      data: {}
    })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson).toEqual({
     error: 'Email or username with password are required'
    })
  })
})
