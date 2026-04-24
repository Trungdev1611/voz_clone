import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthCookieGuard } from 'src/auth/guards/auth-cookie.guard';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { QueryThreadDto } from './dto/query-thread.dto';
import { OptionalAuthCookieGuard } from 'src/auth/guards/optional-auth-cookie.guard';

@Controller('thread')
// @UseGuards(AuthCookieGuard)
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @UseGuards(AuthCookieGuard)
  @Post()
  createThread(@Body() createThreadDto: CreateThreadDto, @Req() req: Request) {
    return this.threadService.create(createThreadDto, req.user!);
  }

  @Get()
  findAllAndPaginate(@Query() query: QueryThreadDto) { 
    return this.threadService.findAllAndPaginate(query);
  }

  @UseGuards(OptionalAuthCookieGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.threadService.findOne(+id, req.user!.id);
  }

  @UseGuards(AuthCookieGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThreadDto: UpdateThreadDto) {
    return this.threadService.update(+id, updateThreadDto);
  }

  @UseGuards(AuthCookieGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.threadService.remove(+id);
  }
}
