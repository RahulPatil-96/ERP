import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<{ user: { [key: string]: unknown } }> {
    const { email, password } = body;
    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }
    const user = await this.authService.validateUser(email, password);
    // For simplicity, returning user data directly. In production, return JWT token.
    return { user };
  }

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }): Promise<{ user: { [key: string]: unknown } }> {
    const { name, email, password } = body;
    if (!name || !email || !password) {
      throw new UnauthorizedException('Name, email and password are required');
    }
    const user = await this.authService.registerUser(name, email, password);
    return { user };
  }

  @Post('impersonate')
  async impersonate(@Body() body: { userId: string }): Promise<{ user: { [key: string]: unknown } }> {
    const { userId } = body;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    const user = await this.authService.getUserById(userId);
    return { user };
  }
}