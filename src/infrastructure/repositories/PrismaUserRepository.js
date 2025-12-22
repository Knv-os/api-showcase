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
exports.PrismaUserRepository = void 0;
const client_1 = require("../prisma/client");
const User_1 = require("../../domain/user/User");
const node_crypto_1 = require("node:crypto");
class PrismaUserRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const created = yield client_1.prisma.user.create({
                data: {
                    id: (0, node_crypto_1.randomUUID)(),
                    email: data.email,
                    name: data.name,
                    password_hash: data.password,
                    role: (_a = data.role) !== null && _a !== void 0 ? _a : "STAFF",
                },
            });
            return new User_1.User(Object.assign({}, created));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield client_1.prisma.user.findUnique({ where: { id } });
            return found ? new User_1.User(Object.assign({}, found)) : null;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield client_1.prisma.user.findUnique({ where: { email } });
            return found ? new User_1.User(Object.assign({}, found)) : null;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield client_1.prisma.user.findMany({ orderBy: { createdAt: "desc" } });
            return rows.map((r) => new User_1.User(Object.assign({}, r)));
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield client_1.prisma.user.update({
                where: { id },
                data: {
                    email: data.email,
                    name: data.name,
                    password_hash: data.password,
                    role: data.role,
                },
            });
            return new User_1.User(Object.assign({}, updated));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_1.prisma.user.delete({ where: { id } });
        });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
