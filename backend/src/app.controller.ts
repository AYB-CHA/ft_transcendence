import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HelloTranscendence } from './types';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}
}
