import { ApiProperty } from '@nestjs/swagger';
export class ResultData {
  constructor(code = 200, msg?: string, data?: any) {
    this.code = code;
    this.msg = msg || '请求成功';
    this.data = data || null;
  }

  @ApiProperty({ type: 'number', default: 200 })
  code: number;

  @ApiProperty({ type: 'string', default: '请求成功' })
  msg?: string;

  data?: any;

  static success(data?: any, msg?: string): ResultData {
    return new ResultData(200, msg, data);
  }
  static fail(code: number, msg?: string, data?: any): ResultData {
    return new ResultData(code || 500, msg || 'fail', data);
  }
}
