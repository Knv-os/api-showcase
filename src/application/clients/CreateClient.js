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
exports.CreateClient = void 0;
const zod_1 = require("zod");
const createClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().trim().toLowerCase().email().nullish(),
    phone: zod_1.z.string().min(1),
    document: zod_1.z.string().trim().nullish(),
});
class CreateClient {
    constructor(repo) {
        this.repo = repo;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const data = createClientSchema.parse(input);
            if (data.email) {
                const existingEmail = yield this.repo.findByEmail(data.email);
                if (existingEmail)
                    throw new Error("Client email already in use");
            }
            if (data.document) {
                const existingDoc = yield this.repo.findByDocument(data.document);
                if (existingDoc)
                    throw new Error("Client document already in use");
            }
            const client = yield this.repo.create({
                name: data.name,
                email: (_a = data.email) !== null && _a !== void 0 ? _a : null,
                phone: data.phone,
                document: (_b = data.document) !== null && _b !== void 0 ? _b : null,
            });
            return client;
        });
    }
}
exports.CreateClient = CreateClient;
