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
const CreateUser_1 = require("../CreateUser");
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
            const created = new User_1.User({
                id: (0, node_crypto_1.randomUUID)(),
                email: data.email,
                name: data.name,
                password_hash: data.password,
                role: (_a = data.role) !== null && _a !== void 0 ? _a : "STAFF",
                createdAt: now,
                updatedAt: now,
            });
            it("falha quando senha for curta (< 6)", () => __awaiter(this, void 0, void 0, function* () {
                const repo = new InMemoryUserRepo();
                const usecase = new CreateUser_1.CreateUser(repo);
                yield expect(usecase.execute({ email: "x@x.com", name: "X", password: "123" })).rejects.toThrow();
            }));
            it("falha quando nome for vazio", () => __awaiter(this, void 0, void 0, function* () {
                const repo = new InMemoryUserRepo();
                const usecase = new CreateUser_1.CreateUser(repo);
                yield expect(usecase.execute({ email: "x@x.com", name: "", password: "123456" })).rejects.toThrow();
            }));
            this.items.push(created);
            return created;
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
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items = this.items.filter((u) => u.id !== id);
        });
    }
}
describe("CreateUser", () => {
    it("cria usuário com password hash e role padrão", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new InMemoryUserRepo();
        const usecase = new CreateUser_1.CreateUser(repo);
        const user = yield usecase.execute({
            email: "john@example.com",
            name: "John",
            password: "secret123",
        });
        expect(user).toBeInstanceOf(User_1.User);
        expect(user.email).toBe("john@example.com");
        // senha deve ter sido hasheada pelo caso de uso
        const expectedHash = (0, node_crypto_1.createHash)("sha256").update("secret123").digest("hex");
        expect(user.password_hash).toBe(expectedHash);
        expect(user.role).toBe("STAFF");
    }));
    it("erro quando e-mail já existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new InMemoryUserRepo();
        const usecase = new CreateUser_1.CreateUser(repo);
        // cria primeiro
        yield usecase.execute({
            email: "dupe@example.com",
            name: "A",
            password: "abc12345",
        });
        yield expect(usecase.execute({
            email: "dupe@example.com",
            name: "B",
            password: "abcdef",
        })).rejects.toThrow("Email already in use");
    }));
});
