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
const ListClients_1 = require("../ListClients");
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
            const c = new Client_1.Client({
                id: (0, node_crypto_1.randomUUID)(),
                name: data.name,
                email: (_a = data.email) !== null && _a !== void 0 ? _a : null,
                phone: data.phone,
                document: (_b = data.document) !== null && _b !== void 0 ? _b : null,
                createdAt: now,
                updatedAt: now,
            });
            this.items.push(c);
            return c;
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
    findByDocument() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return [...this.items];
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("not used");
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("not used");
        });
    }
}
describe("ListClients", () => {
    it("lista clientes do repositório", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new InMemoryClientRepo();
        yield repo.create({ name: "A", phone: "1" });
        yield repo.create({ name: "B", phone: "2" });
        const usecase = new ListClients_1.ListClients(repo);
        const list = yield usecase.execute();
        expect(list).toHaveLength(2);
        expect(list[0]).toBeInstanceOf(Client_1.Client);
    }));
});
