import { APIRequestContext } from "@playwright/test"
import { LoggedUserProps, LoginProps, RegisterProps } from "../controllers/auth.controllers"

export async function register(request: APIRequestContext, data: RegisterProps) {
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

export async function deleteUser (request: APIRequestContext, username: string) {
  const adminCredentials: LoginProps = {
    username: "admin",
    password: 'admin'
  }
  const token = await getUserToken(request, adminCredentials)
  await request.delete('users/delete', {
    data: {
      username
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}