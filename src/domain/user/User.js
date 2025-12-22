"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(props) {
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get email() {
        return this.props.email;
    }
    get name() {
        return this.props.name;
    }
    get password_hash() {
        return this.props.password_hash;
    }
    get role() {
        return this.props.role;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
}
exports.User = User;
