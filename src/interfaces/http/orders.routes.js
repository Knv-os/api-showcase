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
exports.ordersRoutes = ordersRoutes;
const zod_1 = require("zod");
const PrismaOrderRepository_1 = require("../../infrastructure/repositories/PrismaOrderRepository");
const CreateOrder_1 = require("../../application/orders/CreateOrder");
const GetOrder_1 = require("../../application/orders/GetOrder");
const ListOrders_1 = require("../../application/orders/ListOrders");
const UpdateOrder_1 = require("../../application/orders/UpdateOrder");
const DeleteOrder_1 = require("../../application/orders/DeleteOrder");
function ordersRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const repo = new PrismaOrderRepository_1.PrismaOrderRepository();
        const createOrder = new CreateOrder_1.CreateOrder(repo);
        const getOrder = new GetOrder_1.GetOrder(repo);
        const listOrders = new ListOrders_1.ListOrders(repo);
        const updateOrder = new UpdateOrder_1.UpdateOrder(repo);
        const deleteOrder = new DeleteOrder_1.DeleteOrder(repo);
        const orderStatus = [
            "DRAFT",
            "MEASURING",
            "CUTTING",
            "STITCHING",
            "TRIAL",
            "READY",
            "DELIVERED",
            "CANCELLED",
        ];
        app.post("/orders", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const bodySchema = zod_1.z.object({
                clientId: zod_1.z.string().uuid(),
                totalValue: zod_1.z.number().nonnegative(),
                status: zod_1.z.enum(orderStatus).optional(),
                trialDate: zod_1.z.coerce.date().nullish(),
                deliveryDate: zod_1.z.coerce.date().nullish(),
            });
            const body = bodySchema.parse(request.body);
            const order = yield createOrder.execute(body);
            return reply.code(201).send(order);
        }));
        app.get("/orders", (_request, reply) => __awaiter(this, void 0, void 0, function* () {
            const orders = yield listOrders.execute();
            return reply.send(orders);
        }));
        app.get("/orders/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const paramsSchema = zod_1.z.object({ id: zod_1.z.string().uuid() });
            const { id } = paramsSchema.parse(request.params);
            const order = yield getOrder.execute({ id });
            return reply.send(order);
        }));
        app.put("/orders/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const paramsSchema = zod_1.z.object({ id: zod_1.z.string().uuid() });
            const bodySchema = zod_1.z.object({
                totalValue: zod_1.z.number().nonnegative().optional(),
                status: zod_1.z.enum(orderStatus).optional(),
                trialDate: zod_1.z.coerce.date().nullish(),
                deliveryDate: zod_1.z.coerce.date().nullish(),
            });
            const { id } = paramsSchema.parse(request.params);
            const body = bodySchema.parse(request.body);
            const order = yield updateOrder.execute(Object.assign({ id }, body));
            return reply.send(order);
        }));
        app.delete("/orders/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const paramsSchema = zod_1.z.object({ id: zod_1.z.string().uuid() });
            const { id } = paramsSchema.parse(request.params);
            yield deleteOrder.execute({ id });
            return reply.code(204).send();
        }));
    });
}
