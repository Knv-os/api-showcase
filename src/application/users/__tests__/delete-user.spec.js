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
const DeleteUser_1 = require("../DeleteUser");
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
            throw new Error("not used");
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items = this.items.filter((u) => u.id !== id);
        });
    }
}
describe("DeleteUser", () => {
    it("deleta usuário existente", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new InMemoryUserRepo();
        const u = yield repo.create({ email: "a@a.com", name: "A", password: "x" });
        const usecase = new DeleteUser_1.DeleteUser(repo);
        yield usecase.execute({ id: u.id });
        expect(yield repo.findById(u.id)).toBeNull();
    }));
    it("erro ao tentar deletar usuário inexistente", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new InMemoryUserRepo();
        const usecase = new DeleteUser_1.DeleteUser(repo);
        yield expect(usecase.execute({ id: (0, node_crypto_1.randomUUID)() })).rejects.toThrow("User not found");
    }));
});
