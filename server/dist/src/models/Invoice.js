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
const InvoiceSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    bookingId: { type: String, required: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    vehicleId: { type: String, default: "" },
    vehicleName: { type: String, default: "" },
    licensePlate: { type: String, default: "" },
    items: [
        {
            description: { type: String, required: true },
            quantity: { type: Number, default: 1 },
            unitPrice: { type: Number, default: 0 },
            type: { type: String, default: "Part" },
            totalPrice: { type: Number, default: 0 },
        },
    ],
    subtotal: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0.15 },
    tax: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    total: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, default: "Unpaid" },
    paymentMethod: { type: String, default: "Credit Card" },
    paymentDate: { type: String, default: "" },
    dueDate: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Invoice", InvoiceSchema);
