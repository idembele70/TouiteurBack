import { APIRequestContext, expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { LoginProps } from '../controllers/auth.controllers';
// '@' is a convention to tag tests
test.describe('It should your describe description', {
  tag: '@your_test_tag_name'
} ,async ()=> {
  // The mode can be serial or parallel depending on the link between the sub-tests
  test.describe.configure({mode:'serial'})

  // Your global variables
  const user = {
    username: "test_setup_username",
    password: "test_setup_password"
  }

  // Add your setup data 
  test.beforeAll( async({ request })=> {
    await addUserSetupFunctionExample(request, user)
  })
  // Clean your setup data 
  test.afterAll( async({request})=> {
    await deleteUserSetupFunctionExample(request, user.username)
  })

  // Your test title should always start with 'It should'
  test('It should do something', async ({request}) => {
    const updatedUsername= "test_setup_updated_username"
    const userId = '12345'
    const response = await request.put(`user/${userId}`, {
      data: { updatedUsername }
    })
    // assert your API controllers's returns
    expect(response.status()).toEqual(StatusCodes.NOT_FOUND)
    const responseBody = (await response.body()).toString()
    expect(responseBody).toContain(`Cannot PUT /user/${userId}`)
  })
})

async function addUserSetupFunctionExample (request: APIRequestContext, data: LoginProps) {
  const token = "setup_function_token"
  await request.post('users/add', {
    data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
async function deleteUserSetupFunctionExample (request: APIRequestContext, username:string) {
  const token = "setup_function_token"
  const userId = '12345'
  await request.delete(`users/${userId}`, {
    data:{
      username
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}