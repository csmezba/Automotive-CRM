"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_js_1 = __importDefault(require("./models/User.js"));
const Branch_js_1 = __importDefault(require("./models/Branch.js"));
const Customer_js_1 = __importDefault(require("./models/Customer.js"));
const Vehicle_js_1 = __importDefault(require("./models/Vehicle.js"));
const Mechanic_js_1 = __importDefault(require("./models/Mechanic.js"));
const Booking_js_1 = __importDefault(require("./models/Booking.js"));
const Part_js_1 = __importDefault(require("./models/Part.js"));
const Warranty_js_1 = __importDefault(require("./models/Warranty.js"));
const Invoice_js_1 = __importDefault(require("./models/Invoice.js"));
const Reminder_js_1 = __importDefault(require("./models/Reminder.js"));
const Notification_js_1 = __importDefault(require("./models/Notification.js"));
const AuditLog_js_1 = __importDefault(require("./models/AuditLog.js"));
const Settings_js_1 = __importDefault(require("./models/Settings.js"));
dotenv_1.default.config();
const seedDatabase = async () => {
    try {
        const userCount = await User_js_1.default.countDocuments();
        if (userCount > 0) {
            console.log("[Seed] Database already contains records. Skipping seed.");
            return;
        }
        console.log("[Seed] Seeding initial database records...");
        const branches = [
            { id: "BR-1", name: "Downtown Headquarters", location: "128 Broad St, Seattle", phone: "206-555-0192" },
            { id: "BR-2", name: "Northside Service Hub", location: "9402 Aurora Ave, Seattle", phone: "206-555-0245" },
        ];
        const users = [
            { id: "USR-1", name: "Marcus Vance", email: "admin@apex.com", passwordHash: "admin123", role: "Admin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80", status: "Active", branchId: "BR-1", twoFactorEnabled: true },
            { id: "USR-2", name: "Elena Rostova", email: "manager@apex.com", passwordHash: "manager123", role: "Manager", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80", status: "Active", branchId: "BR-1", twoFactorEnabled: false },
            { id: "USR-3", name: "Kenji Sato", email: "advisor@apex.com", passwordHash: "advisor123", role: "Service Advisor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80", status: "Active", branchId: "BR-1", twoFactorEnabled: false },
            { id: "USR-4", name: "Bill Kowalski", email: "bill@apex.com", passwordHash: "mechanic123", role: "Mechanic", avatar: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=120&h=120&q=80", status: "Active", branchId: "BR-1", twoFactorEnabled: false },
        ];
        const customers = [
            {
                id: "CUST-1",
                name: "Samantha Reed",
                email: "samantha.reed@gmail.com",
                phone: "206-555-9122",
                status: "Active",
                loyaltyPoints: 340,
                tags: ["VIP", "Fleet-Owner"],
                group: "Premium",
                notes: [
                    { id: "N-1", author: "Kenji Sato", text: "Prefers text notifications instead of phone calls.", createdAt: "2026-05-12T10:00:00Z" },
                    { id: "N-2", author: "Marcus Vance", text: "Customer since 2023. Owns a small local delivery fleet.", createdAt: "2026-06-01T15:30:00Z" }
                ],
                documents: [
                    { id: "DOC-1", name: "Samantha_Fleet_Agreement.pdf", type: "pdf", size: "1.2 MB", url: "#", uploadedAt: "2026-06-02T11:00:00Z" }
                ],
                createdAt: "2023-04-15T09:00:00Z",
            },
            {
                id: "CUST-2",
                name: "Jameson Miller",
                email: "jmiller99@yahoo.com",
                phone: "206-555-2344",
                status: "Active",
                loyaltyPoints: 120,
                tags: ["First-Time"],
                group: "Retail",
                notes: [],
                documents: [],
                createdAt: "2026-07-01T14:20:00Z",
            },
            {
                id: "CUST-3",
                name: "Clara Oswald",
                email: "clara.oswald@tardis.com",
                phone: "206-555-8821",
                status: "Active",
                loyaltyPoints: 850,
                tags: ["VIP", "Tesla-Owner"],
                group: "Premium",
                notes: [{ id: "N-3", author: "Kenji Sato", text: "Extremely particular about glass and detailing.", createdAt: "2026-07-10T16:45:00Z" }],
                documents: [],
                createdAt: "2024-02-18T11:10:00Z",
            }
        ];
        const vehicles = [
            {
                id: "VEH-1",
                customerId: "CUST-1",
                customerName: "Samantha Reed",
                vin: "1HGCR2F81MA00281",
                licensePlate: "APX-901",
                brand: "Honda",
                model: "Accord",
                variant: "Touring 2.0T",
                year: 2021,
                color: "Platinum White",
                fuelType: "Petrol",
                transmission: "Automatic",
                mileage: 41200,
                insuranceExpiry: "2027-01-10",
                warrantyExpiry: "2026-07-01",
                status: "In Service",
                images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400"],
                accidentHistory: []
            },
            {
                id: "VEH-2",
                customerId: "CUST-2",
                customerName: "Jameson Miller",
                vin: "WBA8A9C02NF02910",
                licensePlate: "BMW-330",
                brand: "BMW",
                model: "3 Series",
                variant: "330i M Sport",
                year: 2022,
                color: "Mineral Grey",
                fuelType: "Petrol",
                transmission: "Automatic",
                mileage: 28500,
                insuranceExpiry: "2027-04-15",
                warrantyExpiry: "2025-04-15",
                status: "Ready for Pickup",
                images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400"],
                accidentHistory: [
                    { id: "A1", severity: "Minor", date: "2023-11-04", description: "Fender bender repair on passenger door casing. Sourced original BMW panels." }
                ]
            },
            {
                id: "VEH-3",
                customerId: "CUST-3",
                customerName: "Clara Oswald",
                vin: "5YJSA1E21NF09281",
                licensePlate: "EV-NXT",
                brand: "Tesla",
                model: "Model 3",
                variant: "Long Range Dual Motor",
                year: 2023,
                color: "Solid Black",
                fuelType: "EV",
                transmission: "Automatic",
                mileage: 18400,
                insuranceExpiry: "2027-09-20",
                warrantyExpiry: "2029-09-20",
                status: "Completed",
                images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=400"],
                accidentHistory: []
            }
        ];
        const mechanics = [
            {
                id: "MECH-1",
                name: "Bill Kowalski",
                email: "bill@apex.com",
                skills: ["Engine Overhaul", "Brake Systems", "Transmission"],
                status: "Busy",
                rating: 4.9,
                completedJobs: 142,
                workingHours: "08:00 - 16:30",
                currentBookingId: "BK-101",
                attendanceStatus: "Present",
                efficiencyScore: 96,
                activeJobsCount: 2
            },
            {
                id: "MECH-2",
                name: "Andres Gomez",
                email: "andres@apex.com",
                skills: ["EV Diagnostics", "High Voltage Battery", "Software Calibrations"],
                status: "Available",
                rating: 4.8,
                completedJobs: 98,
                workingHours: "09:00 - 17:30",
                attendanceStatus: "Present",
                efficiencyScore: 94,
                activeJobsCount: 1
            },
            {
                id: "MECH-3",
                name: "Sarah Chen",
                email: "sarah.chen@apex.com",
                skills: ["Advanced Electronics", "AC Systems", "Suspension Tuning"],
                status: "Available",
                rating: 4.95,
                completedJobs: 180,
                workingHours: "08:00 - 16:30",
                attendanceStatus: "Present",
                efficiencyScore: 98,
                activeJobsCount: 0
            }
        ];
        const bookings = [
            {
                id: "BK-101",
                customerId: "CUST-1",
                customerName: "Samantha Reed",
                customerPhone: "206-555-9122",
                vehicleId: "VEH-1",
                vehicleName: "Honda Accord (APX-901)",
                licensePlate: "APX-901",
                mechanicId: "MECH-1",
                mechanicName: "Bill Kowalski",
                serviceType: "Brake Service",
                bookingDate: "2026-07-18",
                bookingTime: "09:30",
                status: "In Progress",
                estimatedCost: 350.0,
                estimatedTimeHours: 3,
                pickupRequired: true,
                dropRequired: false,
                customerNotes: "Loud squeaking noise from front right rotor when braking at low speed.",
                mechanicNotes: "Disassembled front right brake assembly. Outer pad worn down to 2mm indicator.",
                checklist: [
                    { id: "ck-1", item: "Safety visual inspection", checked: true },
                    { id: "ck-2", item: "Front rotor thickness measurement", checked: true },
                    { id: "ck-3", item: "Caliper pin lubrication", checked: false },
                    { id: "ck-4", item: "Fluid flush and pressure leak check", checked: false }
                ],
                beforeImages: ["https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400"],
                afterImages: []
            },
            {
                id: "BK-102",
                customerId: "CUST-2",
                customerName: "Jameson Miller",
                customerPhone: "206-555-2344",
                vehicleId: "VEH-2",
                vehicleName: "BMW 3 Series (BMW-330)",
                licensePlate: "BMW-330",
                mechanicId: "MECH-3",
                mechanicName: "Sarah Chen",
                serviceType: "Oil Change",
                bookingDate: "2026-07-18",
                bookingTime: "11:00",
                status: "Ready",
                estimatedCost: 145.0,
                estimatedTimeHours: 1,
                pickupRequired: false,
                dropRequired: false,
                customerNotes: "Regular synthetic oil change and multi-point inspection.",
                mechanicNotes: "Drained oil, replaced filter, topped off windshield wiper fluid and coolant.",
                checklist: [
                    { id: "ck-1", item: "Drain motor oil and swap filter", checked: true },
                    { id: "ck-2", item: "Tire pressure balance (35 PSI)", checked: true },
                    { id: "ck-3", item: "Reset oil service interval warning", checked: true }
                ],
                beforeImages: [],
                afterImages: []
            },
            {
                id: "BK-103",
                customerId: "CUST-3",
                customerName: "Clara Oswald",
                customerPhone: "206-555-8821",
                vehicleId: "VEH-3",
                vehicleName: "Tesla Model 3 (EV-NXT)",
                licensePlate: "EV-NXT",
                mechanicId: "MECH-2",
                mechanicName: "Andres Gomez",
                serviceType: "Full Service",
                bookingDate: "2026-07-16",
                bookingTime: "14:00",
                status: "Completed",
                estimatedCost: 280.0,
                estimatedTimeHours: 2.5,
                pickupRequired: false,
                dropRequired: true,
                customerNotes: "Annual tire rotation and HEPA filter swap.",
                mechanicNotes: "Rotated tires in diagonal pattern. Installed OEM active-carbon HEPA cabin filter set.",
                checklist: [
                    { id: "ck-1", item: "Diagonal tire rotation and balance", checked: true },
                    { id: "ck-2", item: "Tesla HEPA cabin filter replace", checked: true }
                ],
                invoiceId: "INV-2026-001",
                beforeImages: [],
                afterImages: []
            }
        ];
        const parts = [
            { id: "PART-1", name: "Brembo Ceramic Front Brake Pads", sku: "BRM-902-CER", category: "Brakes", stock: 12, minStock: 5, purchasePrice: 45.0, sellingPrice: 89.99, supplier: "Brembo North America", warehouseLocation: "Aisle 3, Shelf B", compatibleVehicles: ["Honda Accord", "Acura TLX", "BMW 3 Series"] },
            { id: "PART-2", name: "Liqui Moly 5W-30 Synthetic Motor Oil (5L)", sku: "LM-5W30-SYN", category: "Fluids", stock: 24, minStock: 10, purchasePrice: 18.5, sellingPrice: 34.95, supplier: "Liqui Moly Dist", warehouseLocation: "Aisle 1, Shelf D", compatibleVehicles: ["All Petrol Engines"] },
            { id: "PART-3", name: "Tesla Model 3 Active-Carbon HEPA Filter", sku: "TSL-M3-HEPA", category: "Filters", stock: 3, minStock: 5, purchasePrice: 22.0, sellingPrice: 45.0, supplier: "Tesla Parts Direct", warehouseLocation: "Aisle 5, Shelf A", compatibleVehicles: ["Tesla Model 3"] },
            { id: "PART-4", name: "Bosch Aerotwin Wiper Blades (Pair)", sku: "BSH-AER-26", category: "Electrical", stock: 18, minStock: 6, purchasePrice: 12.0, sellingPrice: 24.99, supplier: "Bosch Automotive", warehouseLocation: "Aisle 2, Shelf F", compatibleVehicles: ["Universal (26-inch)"] },
            { id: "PART-5", name: "Duralast 12V AGM Automotive Battery", sku: "DL-AGM-48", category: "Electrical", stock: 2, minStock: 4, purchasePrice: 75.0, sellingPrice: 149.99, supplier: "AutoZone Supply", warehouseLocation: "Aisle 6, Floor A", compatibleVehicles: ["Universal Ford/GM/Honda"] }
        ];
        const warranties = [
            { id: "WR-1", vehicleId: "VEH-1", vehicleName: "Honda Accord", customerName: "Samantha Reed", coverageType: "Bumper-to-Bumper", startDate: "2023-11-12", endDate: "2026-11-12", status: "Active", partsCovered: ["Engine", "Transmission", "Brakes", "A/C System"], laborCovered: true },
            { id: "WR-2", vehicleId: "VEH-3", vehicleName: "Tesla Model 3", customerName: "Clara Oswald", coverageType: "Battery & Drive Unit", startDate: "2022-10-25", endDate: "2030-10-25", status: "Active", partsCovered: ["HV Battery Pack", "Drive Inverter", "Drive Motors"], laborCovered: true }
        ];
        const invoices = [
            {
                id: "INV-2026-001",
                bookingId: "BK-103",
                customerId: "CUST-3",
                customerName: "Clara Oswald",
                customerEmail: "clara.oswald@tardis.com",
                vehicleName: "Tesla Model 3 (EV-NXT)",
                items: [
                    { description: "Tesla HEPA cabin filter replace", quantity: 1, unitPrice: 45.0, type: "Part" },
                    { description: "Specialized EV inspection and tire rotation labor", quantity: 2, unitPrice: 110.0, type: "Labor" }
                ],
                subtotal: 315.0,
                taxRate: 0.15,
                discountAmount: 35.0,
                couponCode: "WELCOMEEV",
                total: 327.25,
                status: "Paid",
                paymentMethod: "Apple Pay",
                paymentDate: "2026-07-16",
                createdAt: "2026-07-16T16:30:00Z"
            }
        ];
        const reminders = [
            { id: "REM-001", customerId: "CUST-1", customerName: "Samantha Reed", type: "Warranty Expiry", dueDate: "2026-11-12", status: "Pending", channel: "Email" },
            { id: "REM-002", customerId: "CUST-2", customerName: "Jameson Miller", type: "Oil Change", dueDate: "2026-08-18", status: "Sent", channel: "SMS" },
            { id: "REM-003", customerId: "CUST-3", customerName: "Clara Oswald", type: "Insurance Renewal", dueDate: "2026-10-25", status: "Pending", channel: "Push" }
        ];
        const notifications = [
            { id: "NTF-1", title: "Low Stock Alert", message: "HEPA Filter stock (3) has fallen below minimum threshold (5).", type: "stock", createdAt: "2026-07-18T01:10:00Z", read: false },
            { id: "NTF-2", title: "Booking Created", message: "New Brake Service booked for Honda Accord (Samantha Reed).", type: "booking", createdAt: "2026-07-18T04:20:00Z", read: false }
        ];
        const auditLogs = [
            { id: "AUD-1", userId: "USR-3", userName: "Kenji Sato", role: "Service Advisor", action: "Created Booking", target: "BK-101", timestamp: "2026-07-18T04:20:00Z", ipAddress: "192.168.1.115" }
        ];
        const settings = {
            companyName: "Apex Auto Care",
            taxRate: 0.15,
            currency: "USD",
            workingHoursStart: "08:00",
            workingHoursEnd: "18:00",
            aiAutoAnalyze: true,
            smsEnabled: true,
            emailEnabled: true,
        };
        await Branch_js_1.default.insertMany(branches);
        await User_js_1.default.insertMany(users);
        await Customer_js_1.default.insertMany(customers);
        await Vehicle_js_1.default.insertMany(vehicles);
        await Mechanic_js_1.default.insertMany(mechanics);
        await Booking_js_1.default.insertMany(bookings);
        await Part_js_1.default.insertMany(parts);
        await Warranty_js_1.default.insertMany(warranties);
        await Invoice_js_1.default.insertMany(invoices);
        await Reminder_js_1.default.insertMany(reminders);
        await Notification_js_1.default.insertMany(notifications);
        await AuditLog_js_1.default.insertMany(auditLogs);
        await Settings_js_1.default.create(settings);
        console.log("[Seed] Database seeding completed successfully!");
    }
    catch (error) {
        console.error("[Seed] Error during seeding:", error);
    }
};
exports.seedDatabase = seedDatabase;
// Allow running seed script directly via `npm run seed`
if (process.argv[1] && process.argv[1].endsWith("seed.ts")) {
    const connStr = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/automotive_crm";
    mongoose_1.default
        .connect(connStr)
        .then(async () => {
        await (0, exports.seedDatabase)();
        await mongoose_1.default.disconnect();
        process.exit(0);
    })
        .catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
