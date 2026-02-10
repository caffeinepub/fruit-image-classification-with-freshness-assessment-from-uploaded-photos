import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ResultEntry {
    fruit: FruitType;
    freshnessConfidence: bigint;
    freshnessScore: bigint;
    timestamp: bigint;
    confidence: bigint;
}
export enum FruitType {
    grapes = "grapes",
    apple = "apple",
    orange = "orange",
    pear = "pear",
    plum = "plum",
    banana = "banana",
    strawberry = "strawberry",
    peach = "peach"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getHistory(): Promise<Array<ResultEntry>>;
    isCallerAdmin(): Promise<boolean>;
    saveAnalysisResult(fruit: FruitType, confidence: bigint, freshnessScore: bigint, freshnessConfidence: bigint): Promise<void>;
}
