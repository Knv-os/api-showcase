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
const DeleteOrder_1 = require("../DeleteOrder");
const CreateOrder_1 = require("../CreateOrder");
const Order_1 = require("../../../domain/order/Order");
const node_crypto_1 = require("node:crypto");
class InMemoryOrderRepo {
    constructor() {
        this.items = [];
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const now = new Date();
            const created = new Order_1.Order({
                id: (0, node_crypto_1.randomUUID)(),
                clientId: data.clientId,
                status: (_a = data.status) !== null && _a !== void 0 ? _a : "DRAFT",
                totalValue: data.totalValue,
                trialDate: (_b = data.trialDate) !== null && _b !== void 0 ? _b : null,
                deliveryDate: (_c = data.deliveryDate) !== null && _c !== void 0 ? _c : null,
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
            return (_a = this.items.find((o) => o.id === id)) !== null && _a !== void 0 ? _a : null;
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
            const idx = this.items.findIndex((o) => o.id === id);
            if (idx < 0)
                throw new Error("not found");
            const prev = this.items[idx];
            const updated = new Order_1.Order({
                id: prev.id,
                clientId: prev.clientId,
                status: (_a = data.status) !== null && _a !== void 0 ? _a : prev.status,
                totalValue: (_b = data.totalValue) !== null && _b !== void 0 ? _b : prev.totalValue,
                trialDate: (_c = data.trialDate) !== null && _c !== void 0 ? _c : prev.trialDate,
                deliveryDate: (_d = data.deliveryDate) !== null && _d !== void 0 ? _d : prev.deliveryDate,
                createdAt: prev.createdAt,
                updatedAt: new Date(),
            });
            this.items[idx] = updated;
            return updated;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items = this.items.filter((o) => o.id !== id);
        });
    }
}
describe("DeleteOrder", () => {
    it("remove o pedido e depois não encontra mais", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new InMemoryOrderRepo();
        const create = new CreateOrder_1.CreateOrder(repo);
        const del = new DeleteOrder_1.DeleteOrder(repo);
        const created = yield create.execute({
            clientId: (0, node_crypto_1.randomUUID)(),
            totalValue: 75,
        });
        expect(yield repo.findById(created.id)).not.toBeNull();
        yield del.execute({ id: created.id });
        expect(yield repo.findById(created.id)).toBeNull();
    }));
    it("lança erro se tentar deletar id inexistente", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new InMemoryOrderRepo();
        const del = new DeleteOrder_1.DeleteOrder(repo);
        yield expect(del.execute({ id: (0, node_crypto_1.randomUUID)() })).rejects.toThrow("Order not found");
    }));
});
