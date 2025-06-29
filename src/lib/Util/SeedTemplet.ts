// import connectDB from "../database/connection";

// export const defaultTemplates = [
//   {
//     name: "Modern Blue",
//     description: "Clean and modern design with blue accent",
//     colorScheme: {
//       primary: "#3B82F6",
//       secondary: "#E5E7EB",
//       accent: "#1E40AF",
//       text: "#1F2937",
//       background: "#FFFFFF",
//     },
//     layout: "modern" as const,
//     fontFamily: "Inter",
//     isActive: true,
//   },
//   {
//     name: "Classic Green",
//     description: "Traditional business style with green theme",
//     colorScheme: {
//       primary: "#059669",
//       secondary: "#F3F4F6",
//       accent: "#047857",
//       text: "#374151",
//       background: "#FFFFFF",
//     },
//     layout: "classic" as const,
//     fontFamily: "Roboto",
//     isActive: true,
//   },
//   {
//     name: "Minimal Gray",
//     description: "Minimalist design with neutral colors",
//     colorScheme: {
//       primary: "#6B7280",
//       secondary: "#F9FAFB",
//       accent: "#374151",
//       text: "#111827",
//       background: "#FFFFFF",
//     },
//     layout: "minimal" as const,
//     fontFamily: "Open Sans",
//     isActive: true,
//   },
//   {
//     name: "Corporate Purple",
//     description: "Professional corporate style with purple accents",
//     colorScheme: {
//       primary: "#7C3AED",
//       secondary: "#EDE9FE",
//       accent: "#5B21B6",
//       text: "#1F2937",
//       background: "#FFFFFF",
//     },
//     layout: "corporate" as const,
//     fontFamily: "Montserrat",
//     isActive: true,
//   },
// ];

// export async function seedTemplates() {
//   try {
//     await connectDB();

//     const existingTemplates = await IInvoiceTemplate.countDocuments();

//     if (existingTemplates === 0) {
//       await IInvoiceTemplate.insertMany(defaultTemplates);
//       console.log("✅ Default templates seeded successfully");
//     } else {
//       console.log("📋 Templates already exist, skipping seed");
//     }
//   } catch (error) {
//     console.error("❌ Error seeding templates:", error);
//     throw error;
//   }
// }
