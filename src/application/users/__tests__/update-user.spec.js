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
const UpdateUser_1 = require("../UpdateUser");
const User_1 = require("../../../domain/user/User");
const node_crypto_1 = require("node:crypto");
class InMemoryUserRepo {
    constructor() {
        this.items = [];
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const now = new Date();
            const u = new User_1.User({
                id: (0, node_crypto_1.randomUUID)(),
                email: data.email,
                name: data.name,
                password_hash: data.password,
                role: (_a = data.role) !== null && _a !== void 0 ? _a : "STAFF",
                createdAt: now,
                updatedAt: now,
            });
            this.items.push(u);
            return u;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.items.find((u) => u.id === id)) !== null && _a !== void 0 ? _a : null;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.items.find((u) => u.email === email)) !== null && _a !== void 0 ? _a : null;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return [...this.items];
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const idx = this.items.findIndex((u) => u.id === id);
            if (idx < 0)
                throw new Error("not found");
            const prev = this.items[idx];
            const updated = new User_1.User({
                id: prev.id,
                email: (_a = data.email) !== null && _a !== void 0 ? _a : prev.email,
                name: (_b = data.name) !== null && _b !== void 0 ? _b : prev.name,
                password_hash: (_c = data.password) !== null && _c !== void 0 ? _c : prev.password_hash,
                role: (_d = data.role) !== null && _d !== void 0 ? _d : prev.role,
                createdAt: prev.createdAt,
                updatedAt: new Date(),
            });
            this.items[idx] = updated;
            return updated;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            /* noop */
        });
    }
}
describe("UpdateUser", () => {
    it("atualiza com hash de senha quando fornecida", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new InMemoryUserRepo();
        const u = yield repo.create({ email: "a@a.com", name: "A", password: "x" });
        const usecase = new UpdateUser_1.UpdateUser(repo);
        const updated = yield usecase.execute({ id: u.id, password: "newPass123" });
        const expectedHash = (0, node_crypto_1.createHash)("sha256")
            .update("newPass123")
            .digest("hex");
        expect(updated.password_hash).toBe(expectedHash);
    }));
    it("erro ao atualizar e-mail duplicado", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new InMemoryUserRepo();
        const u1 = yield repo.create({
            email: "a@a.com",
            name: "A",
            password: "x",
        });
        const u2 = yield repo.create({
            email: "b@b.com",
            name: "B",
            password: "y",
        });
        const usecase = new UpdateUser_1.UpdateUser(repo);
        yield expect(usecase.execute({ id: u2.id, email: "a@a.com" })).rejects.toThrow("Email already in use");
    }));
});
