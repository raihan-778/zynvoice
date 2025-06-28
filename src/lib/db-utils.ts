// ## Step 8: Database Utilities & Services

// 📁 src/lib/db-utils.ts
import Client from "@/models/Client";

import Invoice from "@/models/Invoice";
import InvoiceTemplate from "@/models/InvoiceTemplet";
import ServiceItem from "@/models/ServiceItem";
import DBConnect from "./database/connection";
import { CompanyInfo } from "@/models/CompanyInfo";

export class DatabaseService {
  // Initialize database connection
  static async connect() {
    try {
      await DBConnect();
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      throw error;
    }
  }

  // Seed default data
  static async seedDefaultData() {
    try {
      await this.connect();

      // Create default company info if none exists
      const companyCount = await CompanyInfo.countDocuments();
      if (companyCount === 0) {
        await CompanyInfo.create({
          name: "Your Company Name",
          address: {
            street: "123 Business St",
            city: "Business City",
            state: "BC",
            zipCode: "12345",
            country: "United States",
          },
          contact: {
            email: "info@yourcompany.com",
            phone: "+1 (555) 123-4567",
            website: "https://yourcompany.com",
          },
        });
        console.log("✅ Default company info created");
      }

      // Create default invoice template if none exists
      const templateCount = await InvoiceTemplate.countDocuments();
      if (templateCount === 0) {
        await InvoiceTemplate.create({
          name: "Professional Blue",
          description: "Clean and professional template with blue accents",
          isDefault: true,
          layout: {
            colors: {
              primary: "#2563eb",
              secondary: "#64748b",
              accent: "#f59e0b",
              text: "#1f2937",
              background: "#ffffff",
            },
            fonts: {
              heading: "Inter",
              body: "Inter",
            },
            spacing: {
              margin: 20,
              padding: 15,
            },
          },
          sections: {
            showLogo: true,
            showBankDetails: true,
            showNotes: true,
            showTerms: true,
            showSignature: false,
          },
        });
        console.log("✅ Default template created");
      }

      console.log("✅ Database seeded successfully");
    } catch (error) {
      console.error("❌ Error seeding database:", error);
      throw error;
    }
  }

  // Clear all data (for development)
  static async clearAllData() {
    try {
      await this.connect();
      await Invoice.deleteMany({});
      await CompanyInfo.deleteMany({});
      await Client.deleteMany({});
      await InvoiceTemplate.deleteMany({});
      await ServiceItem.deleteMany({});
      console.log("✅ All data cleared");
    } catch (error) {
      console.error("❌ Error clearing data:", error);
      throw error;
    }
  }

  // Health check
  static async healthCheck() {
    try {
      await this.connect();
      const stats = {
        invoices: await Invoice.countDocuments(),
        clients: await Client.countDocuments(),
        templates: await InvoiceTemplate.countDocuments(),
        companies: await CompanyInfo.countDocuments(),
      };
      console.log("📊 Database health check:", stats);
      return stats;
    } catch (error) {
      console.error("❌ Health check failed:", error);
      throw error;
    }
  }
}
