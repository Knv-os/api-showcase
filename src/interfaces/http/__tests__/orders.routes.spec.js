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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const orders_routes_1 = require("../orders.routes");
const node_crypto_1 = require("node:crypto");
// Mock do repositório Prisma usado nas rotas
jest.mock("../../../infrastructure/repositories/PrismaOrderRepository", () => {
    class InMemoryOrderRepo {
        constructor() {
            this.items = [];
        }
        create(data) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const now = new Date();
                const created = {
                    id: (0, node_crypto_1.randomUUID)(),
                    clientId: data.clientId,
                    status: (_a = data.status) !== null && _a !== void 0 ? _a : "DRAFT",
                    totalValue: data.totalValue,
                    trialDate: (_b = data.trialDate) !== null && _b !== void 0 ? _b : null,
                    deliveryDate: (_c = data.deliveryDate) !== null && _c !== void 0 ? _c : null,
                    createdAt: now,
                    updatedAt: now,
                };
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
                // imita orderBy desc por createdAt
                return [...this.items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            });
        }
        update(id, data) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const idx = this.items.findIndex((o) => o.id === id);
                if (idx < 0)
                    throw new Error("not found");
                const prev = this.items[idx];
                const updated = Object.assign(Object.assign({}, prev), { status: (_a = data.status) !== null && _a !== void 0 ? _a : prev.status, totalValue: (_b = data.totalValue) !== null && _b !== void 0 ? _b : prev.totalValue, trialDate: (_c = data.trialDate) !== null && _c !== void 0 ? _c : prev.trialDate, deliveryDate: (_d = data.deliveryDate) !== null && _d !== void 0 ? _d : prev.deliveryDate, updatedAt: new Date() });
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
    return { PrismaOrderRepository: InMemoryOrderRepo };
});
function buildApp() {
    const app = (0, fastify_1.default)();
    app.setErrorHandler((error, _req, reply) => {
        if (typeof (error === null || error === void 0 ? void 0 : error.message) === "string" &&
            error.message.includes("At least one field")) {
            return reply.status(400).send({ error: error.message });
        }
        if ((error === null || error === void 0 ? void 0 : error.message) === "Order not found") {
            return reply.status(404).send({ error: error.message });
        }
        return reply.status(500).send({ error: "Internal Server Error" });
    });
    return app;
}
describe("Orders HTTP routes", () => {
    it("POST /orders cria um pedido", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = buildApp();
        yield (0, orders_routes_1.ordersRoutes)(app);
        const res = yield app.inject({
            method: "POST",
            url: "/orders",
            payload: { clientId: (0, node_crypto_1.randomUUID)(), totalValue: 123.45 },
        });
        expect(res.statusCode).toBe(201);
        const body = res.json();
        expect(body.id).toBeDefined();
        expect(body.status).toBe("DRAFT");
        expect(body.totalValue).toBe(123.45);
    }));
    it("GET /orders lista pedidos", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = buildApp();
        yield (0, orders_routes_1.ordersRoutes)(app);
        yield app.inject({
            method: "POST",
            url: "/orders",
            payload: { clientId: (0, node_crypto_1.randomUUID)(), totalValue: 10 },
        });
        yield app.inject({
            method: "POST",
            url: "/orders",
            payload: { clientId: (0, node_crypto_1.randomUUID)(), totalValue: 20 },
        });
        const res = yield app.inject({ method: "GET", url: "/orders" });
        expect(res.statusCode).toBe(200);
        const list = res.json();
        expect(Array.isArray(list)).toBe(true);
        expect(list.length).toBeGreaterThanOrEqual(2);
    }));
    it("GET /orders/:id retorna pedido", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = buildApp();
        yield (0, orders_routes_1.ordersRoutes)(app);
        const created = yield app.inject({
            method: "POST",
            url: "/orders",
            payload: { clientId: (0, node_crypto_1.randomUUID)(), totalValue: 33 },
        });
        const id = created.json().id;
        const res = yield app.inject({ method: "GET", url: `/orders/${id}` });
        expect(res.statusCode).toBe(200);
        expect(res.json().id).toBe(id);
    }));
    it("PUT /orders/:id atualiza status e totalValue", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = buildApp();
        yield (0, orders_routes_1.ordersRoutes)(app);
        const created = yield app.inject({
            method: "POST",
            url: "/orders",
            payload: { clientId: (0, node_crypto_1.randomUUID)(), totalValue: 40 },
        });
        const id = created.json().id;
        const res = yield app.inject({
            method: "PUT",
            url: `/orders/${id}`,
            payload: { status: "READY", totalValue: 55 },
        });
        expect(res.statusCode).toBe(200);
        expect(res.json().status).toBe("READY");
        expect(res.json().totalValue).toBe(55);
    }));
    it("DELETE /orders/:id remove o pedido", () => __awaiter(void 0, void 0, void 0, function* () {
        const app = buildApp();
        yield (0, orders_routes_1.ordersRoutes)(app);
        const created = yield app.inject({
            method: "POST",
            url: "/orders",
            payload: { clientId: (0, node_crypto_1.randomUUID)(), totalValue: 70 },
        });
        const id = created.json().id;
        const res = yield app.inject({ method: "DELETE", url: `/orders/${id}` });
        expect(res.statusCode).toBe(204);
        const notFound = yield app.inject({ method: "GET", url: `/orders/${id}` });
        expect(notFound.statusCode).toBe(404);
    }));
});
