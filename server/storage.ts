import {
  users,
  donations,
  type User,
  type InsertUser,
  type Donation,
  type InsertDonation,
  type UpdateDonationStatusRequest,
  type UpsertUser
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Donations
  createDonation(donation: InsertDonation & { donorId: string }): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  getDonation(id: number): Promise<Donation | undefined>;
  updateDonationStatus(id: number, updates: UpdateDonationStatusRequest): Promise<Donation>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private donations: Map<number, Donation>;
  private currentDonationId: number;

  constructor() {
    this.users = new Map();
    this.donations = new Map();
    this.currentDonationId = 1;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = userData.id ? await this.getUser(userData.id) : undefined;
    const user: User = {
      id: userData.id || Math.random().toString(36).substring(7),
      email: userData.email ?? null,
      username: userData.username ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      role: userData.role ?? null,
      name: userData.name ?? null,
      createdAt: existingUser?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async createDonation(donation: InsertDonation & { donorId: string }): Promise<Donation> {
    const id = this.currentDonationId++;
    const newDonation: Donation = {
      ...donation,
      id,
      status: "available",
      ngoId: null,
      notes: donation.notes ?? null,
      createdAt: new Date(),
    };
    this.donations.set(id, newDonation);
    return newDonation;
  }

  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values()).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async updateDonationStatus(id: number, updates: UpdateDonationStatusRequest): Promise<Donation> {
    const donation = this.donations.get(id);
    if (!donation) {
      throw new Error(`Donation with ID ${id} not found`);
    }
    const updated = { ...donation, ...updates };
    this.donations.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
