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
exports.clientsRoutes = clientsRoutes;
const zod_1 = require("zod");
const PrismaClientRepository_1 = require("../../infrastructure/repositories/PrismaClientRepository");
const CreateClient_1 = require("../../application/clients/CreateClient");
const GetClient_1 = require("../../application/clients/GetClient");
const ListClients_1 = require("../../application/clients/ListClients");
const UpdateClient_1 = require("../../application/clients/UpdateClient");
function clientsRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const repo = new PrismaClientRepository_1.PrismaClientRepository();
        const createClient = new CreateClient_1.CreateClient(repo);
        const getClient = new GetClient_1.GetClient(repo);
        const listClients = new ListClients_1.ListClients(repo);
        const updateClient = new UpdateClient_1.UpdateClient(repo);
        app.post("/clients", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const bodySchema = zod_1.z.object({
                name: zod_1.z.string().min(1),
                email: zod_1.z.string().trim().toLowerCase().email().nullish(),
                phone: zod_1.z.string().min(1),
                document: zod_1.z.string().trim().nullish(),
            });
            const body = bodySchema.parse(request.body);
            const client = yield createClient.execute(body);
            return reply.code(201).send(client);
        }));
        app.get("/clients", (_request, reply) => __awaiter(this, void 0, void 0, function* () {
            const clients = yield listClients.execute();
            return reply.send(clients);
        }));
        app.get("/clients/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const paramsSchema = zod_1.z.object({ id: zod_1.z.string().uuid() });
            const { id } = paramsSchema.parse(request.params);
            const client = yield getClient.execute({ id });
            return reply.send(client);
        }));
        app.put("/clients/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const paramsSchema = zod_1.z.object({ id: zod_1.z.string().uuid() });
            const bodySchema = zod_1.z.object({
                name: zod_1.z.string().min(1).optional(),
                email: zod_1.z.string().trim().toLowerCase().email().nullish(),
                phone: zod_1.z.string().min(1).optional(),
                document: zod_1.z.string().trim().nullish(),
            });
            const { id } = paramsSchema.parse(request.params);
            const body = bodySchema.parse(request.body);
            const client = yield updateClient.execute(Object.assign({ id }, body));
            return reply.send(client);
        }));
        app.delete("/clients/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const paramsSchema = zod_1.z.object({ id: zod_1.z.string().uuid() });
            const { id } = paramsSchema.parse(request.params);
            yield repo.delete(id);
            return reply.code(204).send();
        }));
    });
}
