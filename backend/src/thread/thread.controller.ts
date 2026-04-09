import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { PaginateAndSearchDTO } from 'src/common/dto/pagination-and-search.dto';
import { QueryThreadDto } from './dto/query-thread.dto';

@Controller('thread')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post()
  createThread(@Body() createThreadDto: CreateThreadDto) {
    return this.threadService.create(createThreadDto);
  }

  @Get()
  findAllAndPaginate(@Query() query: QueryThreadDto) { 
    return this.threadService.findAllAndPaginate(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.threadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThreadDto: UpdateThreadDto) {
    return this.threadService.update(+id, updateThreadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.threadService.remove(+id);
  }
}
