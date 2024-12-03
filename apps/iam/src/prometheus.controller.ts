import { Controller, Get, Res } from '@nestjs/common';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { Response } from 'express';
import { Public } from '@app/common/iam/decorators/public.decorator';

@Controller()
export class PrometheusControllerImpl extends PrometheusController {
  @Public()
  @Get('/metrics')
  async index(@Res({ passthrough: true }) response: Response) {
    return super.index(response);
  }
}
