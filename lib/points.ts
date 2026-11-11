import { getAuthUser } from "@/lib/auth";

const POINTS_STORAGE_KEY = "trashformer_eco_points";
const PROCESSED_COUNT_KEY = "trashformer_waste_processed_count";
const COMMUNITY_USERS_KEY = "trashformer_community_users";
const POINTS_EVENT = "trashformer-points-updated";
const DEFAULT_INITIAL_POINTS = 120;
const DEFAULT_PROCESSED_COUNT = 0;

export interface CommunityUserEntry {
  name: string;
  points: number;
  processedCount: number;
  avatar?: string;
  joinedAt: string;
}

export function getCommunityUsers(): CommunityUserEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(COMMUNITY_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCommunityUsers(users: CommunityUserEntry[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(COMMUNITY_USERS_KEY, JSON.stringify(users));
  }
}

export function syncActiveUserToCommunity(name: string, points: number, processedCount: number, avatar?: string): void {
  if (typeof window === "undefined" || !name) return;
  const users = getCommunityUsers();
  const idx = users.findIndex((u) => u.name.toLowerCase() === name.toLowerCase());
  if (idx >= 0) {
    users[idx] = {
      ...users[idx],
      name,
      points,
      processedCount,
      avatar: avatar || users[idx].avatar,
    };
  } else {
    users.push({
      name,
      points,
      processedCount,
      avatar: avatar || "/placeholder.svg?height=40&width=40",
      joinedAt: new Date().toISOString(),
    });
  }
  saveCommunityUsers(users);
}

export function registerCommunityUser(name: string, avatar?: string): number {
  if (typeof window === "undefined") return DEFAULT_INITIAL_POINTS;
  const users = getCommunityUsers();
  const existing = users.find((u) => u.name.toLowerCase() === name.toLowerCase());
  const startingPoints = existing ? existing.points : DEFAULT_INITIAL_POINTS;
  const startingProcessed = existing ? existing.processedCount : DEFAULT_PROCESSED_COUNT;

  window.localStorage.setItem(POINTS_STORAGE_KEY, String(startingPoints));
  window.localStorage.setItem(PROCESSED_COUNT_KEY, String(startingProcessed));
  syncActiveUserToCommunity(name, startingPoints, startingProcessed, avatar);
  window.dispatchEvent(new CustomEvent(POINTS_EVENT, { detail: { points: startingPoints } }));
  return startingPoints;
}

export function getEcoPoints(): number {
  if (typeof window === "undefined") return DEFAULT_INITIAL_POINTS;
  const raw = window.localStorage.getItem(POINTS_STORAGE_KEY);
  if (raw === null) {
    window.localStorage.setItem(POINTS_STORAGE_KEY, String(DEFAULT_INITIAL_POINTS));
    return DEFAULT_INITIAL_POINTS;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : DEFAULT_INITIAL_POINTS;
}

export function setEcoPoints(points: number): number {
  const safePoints = Math.max(0, Math.floor(points));
  if (typeof window !== "undefined") {
    window.localStorage.setItem(POINTS_STORAGE_KEY, String(safePoints));
    const authUser = getAuthUser();
    if (authUser) {
      syncActiveUserToCommunity(authUser.name, safePoints, getWasteProcessedCount(), authUser.avatar);
    }
    window.dispatchEvent(new CustomEvent(POINTS_EVENT, { detail: { points: safePoints } }));
  }
  return safePoints;
}

export function addEcoPoints(amount: number): number {
  const current = getEcoPoints();
  const nextProcessed = incrementWasteProcessedCount();
  const safeNext = Math.max(0, Math.floor(current + Math.max(0, Math.floor(amount))));
  if (typeof window !== "undefined") {
    window.localStorage.setItem(POINTS_STORAGE_KEY, String(safeNext));
    const authUser = getAuthUser();
    if (authUser) {
      syncActiveUserToCommunity(authUser.name, safeNext, nextProcessed, authUser.avatar);
    }
    window.dispatchEvent(new CustomEvent(POINTS_EVENT, { detail: { points: safeNext } }));
  }
  return safeNext;
}

export function deductEcoPoints(amount: number): { success: boolean; balance: number } {
  const current = getEcoPoints();
  if (current < amount) {
    return { success: false, balance: current };
  }
  const next = setEcoPoints(current - Math.floor(amount));
  return { success: true, balance: next };
}

export function getWasteProcessedCount(): number {
  if (typeof window === "undefined") return DEFAULT_PROCESSED_COUNT;
  const raw = window.localStorage.getItem(PROCESSED_COUNT_KEY);
  if (raw === null) return DEFAULT_PROCESSED_COUNT;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : DEFAULT_PROCESSED_COUNT;
}

export function incrementWasteProcessedCount(): number {
  const current = getWasteProcessedCount();
  const next = current + 1;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PROCESSED_COUNT_KEY, String(next));
    const authUser = getAuthUser();
    if (authUser) {
      syncActiveUserToCommunity(authUser.name, getEcoPoints(), next, authUser.avatar);
    }
    window.dispatchEvent(new CustomEvent(POINTS_EVENT));
  }
  return next;
}

export function subscribeToEcoPoints(callback: (points: number) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback(getEcoPoints());
  window.addEventListener(POINTS_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(POINTS_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
