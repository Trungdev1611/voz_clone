import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthCookieGuard } from 'src/auth/guards/auth-cookie.guard';
import { OptionalAuthCookieGuard } from 'src/auth/guards/optional-auth-cookie.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthCookieGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    return this.commentsService.create(createCommentDto, req.user!);
  }

  @Get()
  @UseGuards(OptionalAuthCookieGuard)
  findAllByThread(@Query() query: QueryCommentDto, @Req() req: Request) {
    return this.commentsService.findAllByThread(query, req.user);
  }

  @Get(':id')
  @UseGuards(OptionalAuthCookieGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.commentsService.findOne(id, req.user);
  }

  @UseGuards(AuthCookieGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    return this.commentsService.update(id, updateCommentDto, req.user!);
  }

  @UseGuards(AuthCookieGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.commentsService.remove(id, req.user!);
  }
}
