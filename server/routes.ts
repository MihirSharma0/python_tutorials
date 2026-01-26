
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // await setupAuth(app);
  // registerAuthRoutes(app);

  // Donations
  app.get(api.donations.list.path, async (req, res) => {
    const donations = await storage.getDonations();
    res.json(donations);
  });

  app.get(api.donations.get.path, async (req, res) => {
    const donation = await storage.getDonation(Number(req.params.id));
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.json(donation);
  });

  app.post(api.donations.create.path, async (req, res) => {
    try {
      const input = api.donations.create.input.parse(req.body);
      const donation = await storage.createDonation(input);
      res.status(201).json(donation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.donations.updateStatus.path, async (req, res) => {
    try {
      const input = api.donations.updateStatus.input.parse(req.body);
      const donation = await storage.updateDonationStatus(Number(req.params.id), input);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      res.json(donation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingUsers = await storage.getUserByUsername("bistro_cafe");
  if (!existingUsers) {
    // Create Mock Users
    const donor = await storage.upsertUser({
      id: "mock-donor-id",
      username: "bistro_cafe",
      role: "donor",
      name: "Bistro Cafe"
    });

    const ngo = await storage.upsertUser({
      id: "mock-ngo-id",
      username: "city_shelter",
      role: "ngo",
      name: "City Shelter NGO"
    });

    // Create Mock Donations
    await storage.createDonation({
      foodType: "Fresh Sandwiches & Wraps",
      quantity: "20 servings",
      location: "123 Main St, Downtown",
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      notes: "Vegetarian options included. Pickup before 9 PM.",
      donorId: donor.id,
      status: "available"
    });

    await storage.createDonation({
      foodType: "Baked Goods (Bread, Pastries)",
      quantity: "5 kg",
      location: "456 Bakery Ave",
      expiryTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      notes: "Day-old bread, perfect condition.",
      donorId: donor.id,
      status: "requested",
      ngoId: ngo.id
    });

    await storage.createDonation({
      foodType: "Catering Leftovers (Rice, Curry)",
      quantity: "50 servings",
      location: "789 Event Center",
      expiryTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      notes: "Kept in hot warmers.",
      donorId: donor.id,
      status: "available"
    });
  }
}
