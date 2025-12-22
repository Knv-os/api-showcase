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
exports.UpdateUser = void 0;
const zod_1 = require("zod");
const node_crypto_1 = require("node:crypto");
const updateUserSchema = zod_1.z
    .object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().trim().toLowerCase().email().optional(),
    name: zod_1.z.string().min(1).optional(),
    password: zod_1.z.string().min(6).optional(),
    role: zod_1.z.string().optional(),
})
    .refine((data) => Object.keys(data).some((k) => k !== "id"), {
    message: "At least one field to update must be provided",
});
class UpdateUser {
    constructor(repo) {
        this.repo = repo;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = updateUserSchema.parse(input);
            if (data.email) {
                const existing = yield this.repo.findByEmail(data.email);
                if (existing && existing.id !== data.id) {
                    throw new Error("Email already in use");
                }
            }
            const passwordHash = data.password
                ? (0, node_crypto_1.createHash)("sha256").update(data.password).digest("hex")
                : undefined;
            const updated = yield this.repo.update(data.id, {
                email: data.email,
                name: data.name,
                password: passwordHash,
                role: data.role,
            });
            return updated;
        });
    }
}
exports.UpdateUser = UpdateUser;
