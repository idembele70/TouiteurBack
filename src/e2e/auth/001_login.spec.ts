import { APIRequestContext, expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { LoggedUserProps, LoginProps, RegisterProps } from '../../controllers/auth.controllers';
import { deleteUser, register } from '../helper';
// '@' is a convention to tag tests
test.describe('It should test user login API endpoints', {
  tag: '@auth @login'
} ,async () => {
  // The mode can be serial or parallel depending on the link between the sub-tests
  test.describe.configure({mode:'serial'})

  // Your global variables
  const userCredentials: RegisterProps = {
    email: "test_setup_email@invalid.invalid",
    username: "test_setup_username",
    password: "test_setup_password"
  }

  // Add your setup data 
  test.beforeAll( async({ request })=> {
    await register(request, userCredentials)
  })
  // Clean your setup data 
  test.afterAll( async({request})=> {
    await deleteUser(request, userCredentials.username)
  })

  test('It should sucessfully login a user', async ({request}) => {
    const loginCredentials: LoginProps = {...userCredentials}
    delete loginCredentials.username
    const OneMillisecond = 1000
    const timestampBeforeLogininSecond = Date.now() / OneMillisecond
    const response = await request.post('auth/login', {
      data: loginCredentials
    })
    expect(response.status()).toEqual(StatusCodes.OK)
    const responseJson = await response.json() as LoggedUserProps
    expect(responseJson.exp).toBeGreaterThan(timestampBeforeLogininSecond)
    expect(responseJson).toEqual(expect.objectContaining({
      email: userCredentials.email,
      username: userCredentials.username,
      isAdmin:false,
    }))
  })
})
