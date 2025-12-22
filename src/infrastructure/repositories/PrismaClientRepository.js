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
exports.PrismaClientRepository = void 0;
const client_1 = require("../prisma/client");
const Client_1 = require("../../domain/client/Client");
const node_crypto_1 = require("node:crypto");
class PrismaClientRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const created = yield client_1.prisma.client.create({
                data: {
                    id: (0, node_crypto_1.randomUUID)(),
                    name: data.name,
                    email: (_a = data.email) !== null && _a !== void 0 ? _a : null,
                    phone: data.phone,
                    document: (_b = data.document) !== null && _b !== void 0 ? _b : null,
                },
            });
            return new Client_1.Client({
                id: created.id,
                name: created.name,
                email: (_c = created.email) !== null && _c !== void 0 ? _c : null,
                phone: created.phone,
                document: (_d = created.document) !== null && _d !== void 0 ? _d : null,
                createdAt: created.createdAt,
                updatedAt: created.createdAt,
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const found = yield client_1.prisma.client.findUnique({ where: { id } });
            return found
                ? new Client_1.Client({
                    id: found.id,
                    name: found.name,
                    email: (_a = found.email) !== null && _a !== void 0 ? _a : null,
                    phone: found.phone,
                    document: (_b = found.document) !== null && _b !== void 0 ? _b : null,
                    createdAt: found.createdAt,
                    updatedAt: found.createdAt,
                })
                : null;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const found = yield client_1.prisma.client.findUnique({ where: { email } });
            return found
                ? new Client_1.Client({
                    id: found.id,
                    name: found.name,
                    email: (_a = found.email) !== null && _a !== void 0 ? _a : null,
                    phone: found.phone,
                    document: (_b = found.document) !== null && _b !== void 0 ? _b : null,
                    createdAt: found.createdAt,
                    updatedAt: found.createdAt,
                })
                : null;
        });
    }
    findByDocument(document) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const found = yield client_1.prisma.client.findUnique({ where: { document } });
            return found
                ? new Client_1.Client({
                    id: found.id,
                    name: found.name,
                    email: (_a = found.email) !== null && _a !== void 0 ? _a : null,
                    phone: found.phone,
                    document: (_b = found.document) !== null && _b !== void 0 ? _b : null,
                    createdAt: found.createdAt,
                    updatedAt: found.createdAt,
                })
                : null;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield client_1.prisma.client.findMany({
                orderBy: { createdAt: "desc" },
            });
            return rows.map((r) => {
                var _a, _b;
                return new Client_1.Client({
                    id: r.id,
                    name: r.name,
                    email: (_a = r.email) !== null && _a !== void 0 ? _a : null,
                    phone: r.phone,
                    document: (_b = r.document) !== null && _b !== void 0 ? _b : null,
                    createdAt: r.createdAt,
                    updatedAt: r.createdAt,
                });
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const updated = yield client_1.prisma.client.update({
                where: { id },
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    document: data.document,
                },
            });
            return new Client_1.Client({
                id: updated.id,
                name: updated.name,
                email: (_a = updated.email) !== null && _a !== void 0 ? _a : null,
                phone: updated.phone,
                document: (_b = updated.document) !== null && _b !== void 0 ? _b : null,
                createdAt: updated.createdAt,
                updatedAt: new Date(),
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_1.prisma.client.delete({ where: { id } });
        });
    }
}
exports.PrismaClientRepository = PrismaClientRepository;
