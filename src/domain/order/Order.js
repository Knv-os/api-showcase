"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor(props) {
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get status() {
        return this.props.status;
    }
    get totalValue() {
        return this.props.totalValue;
    }
    get trialDate() {
        var _a;
        return (_a = this.props.trialDate) !== null && _a !== void 0 ? _a : null;
    }
    get deliveryDate() {
        var _a;
        return (_a = this.props.deliveryDate) !== null && _a !== void 0 ? _a : null;
    }
    get clientId() {
        return this.props.clientId;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
}
exports.Order = Order;
