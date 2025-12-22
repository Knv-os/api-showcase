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
exports.usersRoutes = usersRoutes;
const zod_1 = require("zod");
const PrismaUserRepository_1 = require("../../infrastructure/repositories/PrismaUserRepository");
const CreateUser_1 = require("../../application/users/CreateUser");
const GetUser_1 = require("../../application/users/GetUser");
const ListUsers_1 = require("../../application/users/ListUsers");
const UpdateUser_1 = require("../../application/users/UpdateUser");
const DeleteUser_1 = require("../../application/users/DeleteUser");
function usersRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const repo = new PrismaUserRepository_1.PrismaUserRepository();
        const createUser = new CreateUser_1.CreateUser(repo);
        const getUser = new GetUser_1.GetUser(repo);
        const listUsers = new ListUsers_1.ListUsers(repo);
        const updateUser = new UpdateUser_1.UpdateUser(repo);
        const deleteUser = new DeleteUser_1.DeleteUser(repo);
        app.post("/users", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const bodySchema = zod_1.z.object({
                email: zod_1.z.string().email(),
                name: zod_1.z.string().min(1),
                password: zod_1.z.string().min(6),
                role: zod_1.z.string().optional(),
            });
            const body = bodySchema.parse(request.body);
            const user = yield createUser.execute(body);
            return reply.code(201).send({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        }));
        app.get("/users", (_request, reply) => __awaiter(this, void 0, void 0, function* () {
            const users = yield listUsers.execute();
            return reply.send(users.map((u) => ({
                id: u.id,
                email: u.email,
                name: u.name,
                role: u.role,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt,
            })));
        }));
        app.get("/users/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const paramsSchema = zod_1.z.object({ id: zod_1.z.string().uuid() });
            const { id } = paramsSchema.parse(request.params);
            const user = yield getUser.execute({ id });
            return reply.send({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        }));
        app.put("/users/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const paramsSchema = zod_1.z.object({ id: zod_1.z.string().uuid() });
            const bodySchema = zod_1.z.object({
                email: zod_1.z.string().email().optional(),
                name: zod_1.z.string().min(1).optional(),
                password: zod_1.z.string().min(6).optional(),
                role: zod_1.z.string().optional(),
            });
            const { id } = paramsSchema.parse(request.params);
            const body = bodySchema.parse(request.body);
            const user = yield updateUser.execute(Object.assign({ id }, body));
            return reply.send({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        }));
        app.delete("/users/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const paramsSchema = zod_1.z.object({ id: zod_1.z.string().uuid() });
            const { id } = paramsSchema.parse(request.params);
            yield deleteUser.execute({ id });
            return reply.code(204).send();
        }));
    });
}
