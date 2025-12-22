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
exports.PrismaOrderRepository = void 0;
const client_1 = require("../prisma/client");
const Order_1 = require("../../domain/order/Order");
const node_crypto_1 = require("node:crypto");
class PrismaOrderRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const created = yield client_1.prisma.order.create({
                data: {
                    id: (0, node_crypto_1.randomUUID)(),
                    clientId: data.clientId,
                    totalValue: data.totalValue,
                    status: (_a = data.status) !== null && _a !== void 0 ? _a : "DRAFT",
                    trialDate: (_b = data.trialDate) !== null && _b !== void 0 ? _b : null,
                    deliveryDate: (_c = data.deliveryDate) !== null && _c !== void 0 ? _c : null,
                },
            });
            return new Order_1.Order({
                id: created.id,
                clientId: created.clientId,
                status: created.status,
                totalValue: Number(created.totalValue),
                trialDate: created.trialDate,
                deliveryDate: created.deliveryDate,
                createdAt: created.createdAt,
                updatedAt: created.updatedAt,
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield client_1.prisma.order.findUnique({ where: { id } });
            if (!found)
                return null;
            return new Order_1.Order({
                id: found.id,
                clientId: found.clientId,
                status: found.status,
                totalValue: Number(found.totalValue),
                trialDate: found.trialDate,
                deliveryDate: found.deliveryDate,
                createdAt: found.createdAt,
                updatedAt: found.updatedAt,
            });
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield client_1.prisma.order.findMany({
                orderBy: { createdAt: "desc" },
            });
            return rows.map((r) => new Order_1.Order({
                id: r.id,
                clientId: r.clientId,
                status: r.status,
                totalValue: Number(r.totalValue),
                trialDate: r.trialDate,
                deliveryDate: r.deliveryDate,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
            }));
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield client_1.prisma.order.update({
                where: { id },
                data: {
                    totalValue: data.totalValue,
                    status: data.status,
                    trialDate: data.trialDate,
                    deliveryDate: data.deliveryDate,
                },
            });
            return new Order_1.Order({
                id: updated.id,
                clientId: updated.clientId,
                status: updated.status,
                totalValue: Number(updated.totalValue),
                trialDate: updated.trialDate,
                deliveryDate: updated.deliveryDate,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_1.prisma.order.delete({ where: { id } });
        });
    }
}
exports.PrismaOrderRepository = PrismaOrderRepository;
