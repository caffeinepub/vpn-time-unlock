import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SessionInfo {
    unlockExpiresAt: Time;
}
export type Time = bigint;
export interface AppMetrics {
    installs: bigint;
    blockedCount: bigint;
    activeCount: bigint;
}
export interface AppLogo {
    file: ExternalBlob;
    mediaType: string;
}
export interface AppAdMobConfig {
    appId: string;
    rewardedAdUnitId: string;
}
export interface UserOverview {
    userStatuses: Array<[Principal, UserStatus]>;
    userProfiles: Array<[Principal, UserProfile]>;
    sessions: Array<[Principal, SessionInfo]>;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserStatus {
    active = "active",
    blocked = "blocked"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    blockUser(user: Principal): Promise<void>;
    clearSessions(): Promise<void>;
    getAllSessions(): Promise<Array<SessionInfo>>;
    getAppAdMobConfig(): Promise<AppAdMobConfig | null>;
    getAppAdMobConfigPublic(): Promise<AppAdMobConfig | null>;
    getAppMetrics(): Promise<AppMetrics>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLogo(): Promise<AppLogo | null>;
    getSessions(): Promise<SessionInfo>;
    getUserOverview(): Promise<UserOverview>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    incrementInstalls(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCurrentPrincipalAdmin(): Promise<boolean>;
    isUserBlocked(user: Principal): Promise<boolean>;
    makeCurrentPrincipalAdmin(token: string, userProvidedToken: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAppAdMobConfig(newConfig: AppAdMobConfig): Promise<void>;
    unblockUser(user: Principal): Promise<void>;
    unlockSessions(): Promise<void>;
    uploadLogo(newLogo: AppLogo): Promise<void>;
}
