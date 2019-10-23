import {
  Controller,
  Get,
  Render,
} from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  public showHome() {
    const user = { name: 'NestJS' };
    return { user };
  }
}
