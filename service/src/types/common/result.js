"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ResultData = void 0;
var swagger_1 = require("@nestjs/swagger");
var ResultData = /** @class */ (function () {
    function ResultData(code, msg, data) {
        if (code === void 0) { code = 200; }
        this.code = code;
        this.msg = msg || '请求成功';
        this.data = data || null;
    }
    ResultData.success = function (data, msg) {
        return new ResultData(200, msg, data);
    };
    ResultData.fail = function (code, msg, data) {
        return new ResultData(code || 500, msg || 'fail', data);
    };
    __decorate([
        (0, swagger_1.ApiProperty)({ type: 'number', "default": 200 })
    ], ResultData.prototype, "code");
    __decorate([
        (0, swagger_1.ApiProperty)({ type: 'string', "default": '请求成功' })
    ], ResultData.prototype, "msg");
    return ResultData;
}());
exports.ResultData = ResultData;
