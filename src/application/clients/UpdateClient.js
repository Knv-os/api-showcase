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
exports.UpdateClient = void 0;
const zod_1 = require("zod");
const updateClientSchema = zod_1.z
    .object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().trim().toLowerCase().email().nullish(),
    phone: zod_1.z.string().min(1).optional(),
    document: zod_1.z.string().trim().nullish(),
})
    .refine((data) => Object.keys(data).some((k) => k !== "id"), {
    message: "At least one field to update must be provided",
});
class UpdateClient {
    constructor(repo) {
        this.repo = repo;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const data = updateClientSchema.parse(input);
            if (data.email) {
                const existing = yield this.repo.findByEmail(data.email);
                if (existing && existing.id !== data.id) {
                    throw new Error("Client email already in use");
                }
            }
            if (data.document) {
                const existing = yield this.repo.findByDocument(data.document);
                if (existing && existing.id !== data.id) {
                    throw new Error("Client document already in use");
                }
            }
            const updated = yield this.repo.update(data.id, {
                name: data.name,
                email: (_a = data.email) !== null && _a !== void 0 ? _a : undefined,
                phone: data.phone,
                document: (_b = data.document) !== null && _b !== void 0 ? _b : undefined,
            });
            return updated;
        });
    }
}
exports.UpdateClient = UpdateClient;
