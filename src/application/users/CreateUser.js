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
exports.CreateUser = void 0;
const zod_1 = require("zod");
const node_crypto_1 = require("node:crypto");
const createUserSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase(),
    name: zod_1.z.string().min(1),
    password: zod_1.z.string().min(6),
    role: zod_1.z.string().optional(),
});
class CreateUser {
    constructor(repo) {
        this.repo = repo;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = createUserSchema.parse(input);
            const existing = yield this.repo.findByEmail(data.email);
            if (existing)
                throw new Error("Email already in use");
            const password_hash = (0, node_crypto_1.createHash)("sha256")
                .update(data.password)
                .digest("hex");
            const user = yield this.repo.create({
                email: data.email,
                name: data.name,
                password: password_hash,
                role: (_a = data.role) !== null && _a !== void 0 ? _a : "STAFF",
            });
            return user;
        });
    }
}
exports.CreateUser = CreateUser;
