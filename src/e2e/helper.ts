import { expect, request } from "@playwright/test"
import { StatusCodes } from "http-status-codes"
import { LoggedUserProps, LoginProps, RegisterProps } from "../controllers/auth.controllers"

export async function register(data: RegisterProps) {
  const requestContext = await request.newContext()
  await requestContext.post("auth/register", {
    data
  })
}

async function getUserToken (data: LoginProps) {
  const requestContext = await request.newContext()
  const reponse = await requestContext.post('auth/login',{
    data
  })
  const { accessToken} =  (await reponse.json()) as LoggedUserProps
  return accessToken
}

export async function deleteUser (username: string) {
  const requestContext = await request.newContext()
  const adminCredentials: LoginProps = {
    username: "admin",
    password: 'admin'
  }
  const token = await getUserToken(adminCredentials)
  const response = await requestContext.delete('users/delete', {
    data: {
      username
    },
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  expect(response.status()).toEqual(StatusCodes.OK)
}