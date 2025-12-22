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
const ListUsers_1 = require("../ListUsers");
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
    findById() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    findByEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
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
            throw new Error("not used");
        });
    }
}
describe("ListUsers", () => {
    it("lista usuários do repositório", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new InMemoryUserRepo();
        yield repo.create({ email: "a@a.com", name: "A", password: "x" });
        yield repo.create({ email: "b@b.com", name: "B", password: "y" });
        const usecase = new ListUsers_1.ListUsers(repo);
        const list = yield usecase.execute();
        expect(list).toHaveLength(2);
        expect(list[0]).toBeInstanceOf(User_1.User);
    }));
});
