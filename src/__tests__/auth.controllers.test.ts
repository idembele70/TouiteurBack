import { getMockReq, getMockRes } from '@jest-mock/express'
import { describe, it } from '@jest/globals'
import { StatusCodes } from 'http-status-codes'
import { login } from '../controllers/auth.controllers'

jest.mock('../database/models/users.model.ts')

describe('login controllers', () => {
  it('should handle login', async () => {
    // (User.findOne as jest.Mock).mockResolvedValue(null)
    const req = getMockReq({
      body: {
        email: 'admin',
        password: 'admin',
      }
    })
    const {res} = getMockRes()
    await login(req ,res)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({
      toto:""
    })
  })
})