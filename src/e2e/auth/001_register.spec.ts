import { expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { RegisterProps } from '../../controllers/auth.controllers';
import { deleteUser, register } from '../helper';
test.describe('It should test user register API Endpoints ', {
  tag: '@auth @register'
} ,async ()=> {

  const userData: RegisterProps = {
    username: 'new_user_for_registration',
    email: 'new_user_for_registration@invalid.invalid',
    password: 'NewUserRegistrationPassword!2024',
  }

  const {email, username, password} = userData;
  // Clean setup data
  test.afterAll( async()=> {
  await deleteUser(username)
  })

  test('It should successfully register a new user', async ({request}) => {
    const response = await request.post("auth/register", {
      data: userData
    })
    const responseJson = await response.json()
    expect(responseJson).toEqual({
       message: "Your account is created.", 
       username: userData.username 
    })
    expect(response.status()).toEqual(StatusCodes.OK)
  })
  
  test('It should not allow registration with an existing email', async ({request}) => {
    const response = await request.post("auth/register", {
      data: {email: email, password, username: "unexisting_username"}
    })
    const responseJson = await response.json()
    expect(responseJson).toEqual({
      error: 'A user with that email already exists'
    })
    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
  })

  test('It should not allow registration with an existing username', async ({request}) => {
    const response = await request.post("auth/register", {
      data: {username, password, email: "unexisting_email@invalid.invalid"}
    })
    const responseJson = await response.json()
    expect(responseJson).toEqual({
      error: 'A user with that username already exists'
    })
    expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
  })

  test('It should fail registering a new user without a username', async ({request}) => {
    const response = await request.post("auth/register", {
      data: {email, password}
    })

    const responseJson = await response.json()
    expect(responseJson).toEqual({
       error: "Username is required"
      })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
  })

  test('It should fail registering a new user without an email', async ({request}) => {
    const response = await request.post("auth/register", {
      data: {username, password}
    })

    const responseJson = await response.json()
    expect(responseJson).toEqual({
       error: "Email is required"
      })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
  })

  test('It should fail registering a new user without a password', async ({request}) => {
    const response = await request.post("auth/register", {
      data: {username, email}
    })

    const responseJson = await response.json()
    expect(responseJson).toEqual({
       error: "Password is required"
      })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
  })
  
  test('It should fail registering a new user without any information', async ({request}) => {
    const response = await request.post("auth/register", {
      data: {}
    })

    const responseJson = await response.json()
    expect(responseJson).toEqual({
      error: 'Email, username & password are required'
      })
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST)
  })
})

