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
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const users_routes_1 = require("./interfaces/http/users.routes");
const clients_routes_1 = require("./interfaces/http/clients.routes");
const orders_routes_1 = require("./interfaces/http/orders.routes");
const app = (0, fastify_1.default)({
    logger: { level: process.env.LOG_LEVEL || "info" },
});
app.register((instance) => __awaiter(void 0, void 0, void 0, function* () {
    instance.addHook("onRequest", (_req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        reply.header("X-Content-Type-Options", "nosniff");
        reply.header("X-Frame-Options", "SAMEORIGIN");
        reply.header("X-XSS-Protection", "0");
    }));
    yield (0, users_routes_1.usersRoutes)(instance);
    yield (0, clients_routes_1.clientsRoutes)(instance);
    yield (0, orders_routes_1.ordersRoutes)(instance);
}));
app.get("/health", () => __awaiter(void 0, void 0, void 0, function* () {
    return { status: "ok" };
}));
app.setErrorHandler((error, _request, reply) => {
    var _a;
    if (error instanceof zod_1.ZodError) {
        return reply
            .status(400)
            .send({ error: "Validation error", issues: error.issues });
    }
    if ((error === null || error === void 0 ? void 0 : error.message) === "User not found" ||
        (error === null || error === void 0 ? void 0 : error.message) === "Client not found" ||
        (error === null || error === void 0 ? void 0 : error.message) === "Order not found") {
        return reply.status(404).send({ error: error.message });
    }
    if ((error === null || error === void 0 ? void 0 : error.message) === "Email already in use" ||
        (error === null || error === void 0 ? void 0 : error.message) === "Client email already in use" ||
        (error === null || error === void 0 ? void 0 : error.message) === "Client document already in use" ||
        (typeof (error === null || error === void 0 ? void 0 : error.message) === "string" &&
            error.message.includes("At least one field"))) {
        return reply.status(400).send({ error: error.message });
    }
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            return reply.status(409).send({
                error: "Unique constraint failed",
                target: (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target,
            });
        }
    }
    app.log.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
});
const PORT = Number(process.env.PORT || 3333);
const HOST = process.env.HOST || "0.0.0.0";
app
    .listen({ port: PORT, host: HOST })
    .then(() => {
    app.log.info(`HTTP server listening on http://${HOST}:${PORT}`);
})
    .catch((err) => {
    app.log.error(err);
    process.exit(1);
});
