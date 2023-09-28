import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { extname } from 'path';

@Controller('/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        filename: (req, file, callback) => {
          let error: null | Error = null;
          if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype))
            error = new Error('Unsupported filetype');
          callback(
            error,
            randomBytes(10).toString('hex') + extname(file.originalname),
          );
        },
        destination: (req, file, callback) => {
          callback(null, './public/avatars/');
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File | undefined) {
    if (!file) throw new BadRequestException();
    return file.filename;
  }
}
