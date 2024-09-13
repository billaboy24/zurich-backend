import { JwtMiddleware } from './jwt.middleware'; // Adjust the path as necessary
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('JwtMiddleware', () => {
  let jwtMiddleware: JwtMiddleware;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtMiddleware,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtMiddleware = module.get<JwtMiddleware>(JwtMiddleware);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(jwtMiddleware).toBeDefined();
  });

  it('should allow request to pass with a valid token', async () => {
    const mockRequest = {
      headers: { authorization: 'Bearer valid.token' },
    } as Request;
    const mockResponse = {} as Response;
    const nextFunction = jest.fn();

    jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: 1 });

    await jwtMiddleware.use(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.headers.authorization).toEqual({ userId: 1 });
  });

  it('should throw Unauthorized when no token is provided', async () => {
    const mockRequest = { headers: {} } as Request;
    const mockResponse = {} as Response;
    const nextFunction = jest.fn();

    await expect(
      jwtMiddleware.use(mockRequest, mockResponse, nextFunction),
    ).rejects.toThrow(
      new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
    );
  });

  it('should throw Unauthorized when an invalid token is provided', async () => {
    const mockRequest = {
      headers: { authorization: 'Bearer invalid.token' },
    } as Request;
    const mockResponse = {} as Response;
    const nextFunction = jest.fn();

    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await expect(
      jwtMiddleware.use(mockRequest, mockResponse, nextFunction),
    ).rejects.toThrow(
      new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
    );
  });
});
