import { getMockReq, getMockRes } from '@jest-mock/express'
import CryptoJS from "crypto-js"
import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { login, LoginCredentials } from '../controllers/auth.controllers'
import User from '../database/models/users.model'

jest.mock('../database/models/users.model.ts');
jest.mock('crypto-js');
type LoginRequest = LoginCredentials & Request
describe('login controllers', () => {
  const {res, clearMockRes} = getMockRes({})
  beforeEach(()=> {
    clearMockRes()
    process.env.PASSWORD_SECRET_KEY = 'password_secret';
  })
  it('should fail to login without providing an username or email', async () => {
    const req = getMockReq<LoginRequest>({
      body: {
        password: 'test_user_password',
      }
    })
    const {res} = getMockRes()
    await login(req ,res)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      error: "An email or username is required"
    })
  })
  it('should fail to login for not providing an empty username', async () => {
    const req = getMockReq<LoginRequest>({
      body: {
        username: '',
        password: 'test_user_password',
      }
    })
    const {res} = getMockRes()
    await login(req ,res)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      error: "An email or username is required"
    })
  })
  it('should fail to login for providing an empty email', async () => {
    const req = getMockReq<LoginRequest>({
      body: {
        email: '',
        password: 'test_user_password',
      }
    })
    const {res} = getMockRes()
    await login(req ,res)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      error: "An email or username is required"
    })
  })
  it('should fail to login without providing an password', async () => {
    const req = getMockReq<LoginRequest>({
      body: {
        email: 'test_user_email@invalid.invalid',
      }
    })
    const {res} = getMockRes()
    await login(req ,res)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      error: "An password is required"
    })
  })
  it('should fail to login for providing an empty password', async () => {
    const req = getMockReq<LoginRequest>({
      body: {
        email: 'test_user_email@invalid.invalid',
        password: '',
      }
    })
    const {res} = getMockRes()
    await login(req ,res)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      error: "An password is required"
    })
  })
  it('should fail to login an unexisting user', async () => {
    const user = {
      email: 'test_user_email@invalid.invalid',
      password: "TOTO"
    };

    (User.findOne as jest.Mock).mockResolvedValue(user);
    (CryptoJS.AES.decrypt as jest.Mock).mockReturnValue({
      toString:()=> 'wrongPassword'
    });
    const req = getMockReq<LoginRequest>({
      body: {
        email: 'test_user_email@invalid.invalid',
        password: 'test_user_password_12345',
      }
    });
    
    await login(req ,res);
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: "An password is required"
    })
  })
})