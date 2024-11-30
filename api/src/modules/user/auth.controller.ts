import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { login: string; password: string }) {
    try {
      const user = await this.authService.validateUser(
        body.login,
        body.password,
      );
      return { message: 'Login successful', user };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Invalid login or password');
    }
  }
}
