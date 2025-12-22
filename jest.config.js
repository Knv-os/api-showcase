"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.spec.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    clearMocks: true,
};
exports.default = config;
