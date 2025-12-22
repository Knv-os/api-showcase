"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
class Client {
    constructor(props) {
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get name() {
        return this.props.name;
    }
    get email() {
        var _a;
        return (_a = this.props.email) !== null && _a !== void 0 ? _a : null;
    }
    get phone() {
        return this.props.phone;
    }
    get document() {
        var _a;
        return (_a = this.props.document) !== null && _a !== void 0 ? _a : null;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
}
exports.Client = Client;
