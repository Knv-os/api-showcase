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
exports.UpdateOrder = void 0;
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
const updateOrderSchema = zod_1.z
    .object({
    id: zod_1.z.string().uuid(),
    totalValue: zod_1.z.number().nonnegative().optional(),
    status: zod_1.z.enum(orderStatus).optional(),
    trialDate: zod_1.z.coerce.date().nullish(),
    deliveryDate: zod_1.z.coerce.date().nullish(),
})
    .refine((data) => Object.keys(data).some((k) => k !== "id"), {
    message: "At least one field to update must be provided",
});
class UpdateOrder {
    constructor(repo) {
        this.repo = repo;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const data = updateOrderSchema.parse(input);
            const updated = yield this.repo.update(data.id, {
                totalValue: data.totalValue,
                status: data.status,
                trialDate: (_a = data.trialDate) !== null && _a !== void 0 ? _a : undefined,
                deliveryDate: (_b = data.deliveryDate) !== null && _b !== void 0 ? _b : undefined,
            });
            return updated;
        });
    }
}
exports.UpdateOrder = UpdateOrder;
