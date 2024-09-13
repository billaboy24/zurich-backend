import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = this.jwtService.verify(token);
      req.headers.authorization = decodedToken;

      next();
    } catch (e) {
      console.log(e);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
