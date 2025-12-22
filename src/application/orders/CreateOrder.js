"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrder = void 0;
const zod_1 = require("zod");
const orderStatus = [
    "DRAFT",
    "MEASURING",
    "CUTTING",
    "STITCHING",
    "TRIAL",
    "READY",
    "DELIVERED",
    "CANCELLED",
];
const createOrderSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid(),
    totalValue: zod_1.z.number().nonnegative(),
    status: zod_1.z.enum(orderStatus).optional(),
    trialDate: zod_1.z.coerce.date().nullish(),
    deliveryDate: zod_1.z.coerce.date().nullish(),
});
class CreateOrder {
    constructor(repo) {
        this.repo = repo;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const data = createOrderSchema.parse(input);
            const order = yield this.repo.create({
                clientId: data.clientId,
                totalValue: data.totalValue,
                status: (_a = data.status) !== null && _a !== void 0 ? _a : "DRAFT",
                trialDate: (_b = data.trialDate) !== null && _b !== void 0 ? _b : null,
                deliveryDate: (_c = data.deliveryDate) !== null && _c !== void 0 ? _c : null,
            });
            return order;
        });
    }
}
exports.CreateOrder = CreateOrder;
