"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const BookingSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    customerName: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    vehicleId: { type: String, required: true },
    vehicleName: { type: String, default: "" },
    licensePlate: { type: String, default: "" },
    mechanicId: { type: String, default: "" },
    mechanicName: { type: String, default: "" },
    serviceType: { type: String, required: true },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, default: "09:00" },
    status: { type: String, default: "Scheduled" },
    estimatedCost: { type: Number, default: 0 },
    estimatedTimeHours: { type: Number, default: 1 },
    pickupRequired: { type: Boolean, default: false },
    dropRequired: { type: Boolean, default: false },
    customerNotes: { type: String, default: "" },
    mechanicNotes: { type: String, default: "" },
    checklist: [
        {
            id: { type: String },
            item: { type: String },
            checked: { type: Boolean, default: false },
        },
    ],
    beforeImages: [{ type: String }],
    afterImages: [{ type: String }],
    digitalSignature: { type: String, default: "" },
    invoiceId: { type: String, default: "" },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Booking", BookingSchema);
