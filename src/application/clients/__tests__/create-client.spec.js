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
const CreateClient_1 = require("../CreateClient");
const Client_1 = require("../../../domain/client/Client");
const node_crypto_1 = require("node:crypto");
class InMemoryClientRepo {
    constructor() {
        this.items = [];
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const now = new Date();
            const created = new Client_1.Client({
                id: (0, node_crypto_1.randomUUID)(),
                name: data.name,
                email: (_a = data.email) !== null && _a !== void 0 ? _a : null,
                phone: data.phone,
                document: (_b = data.document) !== null && _b !== void 0 ? _b : null,
                createdAt: now,
                updatedAt: now,
            });
            this.items.push(created);
            return created;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.items.find((c) => c.id === id)) !== null && _a !== void 0 ? _a : null;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.items.find((c) => c.email === email)) !== null && _a !== void 0 ? _a : null;
        });
    }
    findByDocument(document) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = this.items.find((c) => c.document === document)) !== null && _a !== void 0 ? _a : null;
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
            const idx = this.items.findIndex((c) => c.id === id);
            if (idx < 0)
                throw new Error("not found");
            const prev = this.items[idx];
            const updated = new Client_1.Client({
                id: prev.id,
                name: (_a = data.name) !== null && _a !== void 0 ? _a : prev.name,
                email: (_b = (data.email === undefined ? prev.email : data.email)) !== null && _b !== void 0 ? _b : null,
                phone: (_c = data.phone) !== null && _c !== void 0 ? _c : prev.phone,
                document: (_d = (data.document === undefined ? prev.document : data.document)) !== null && _d !== void 0 ? _d : null,
                createdAt: prev.createdAt,
                updatedAt: new Date(),
            });
            this.items[idx] = updated;
            return updated;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items = this.items.filter((c) => c.id !== id);
        });
    }
}
describe("CreateClient", () => {
    it("cria cliente validando unicidade de email/documento", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new InMemoryClientRepo();
        const usecase = new CreateClient_1.CreateClient(repo);
        const c = yield usecase.execute({
            name: "ACME",
            email: "acme@ex.com",
            phone: "123",
            document: "111",
        });
        expect(c).toBeInstanceOf(Client_1.Client);
        yield expect(usecase.execute({ name: "Other", email: "acme@ex.com", phone: "999" })).rejects.toThrow("Client email already in use");
        yield expect(usecase.execute({ name: "Other2", phone: "999", document: "111" })).rejects.toThrow("Client document already in use");
    }));
});
