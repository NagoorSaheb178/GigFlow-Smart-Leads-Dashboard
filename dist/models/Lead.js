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
exports.LeadSource = exports.LeadStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["NEW"] = "New";
    LeadStatus["CONTACTED"] = "Contacted";
    LeadStatus["QUALIFIED"] = "Qualified";
    LeadStatus["LOST"] = "Lost";
})(LeadStatus || (exports.LeadStatus = LeadStatus = {}));
var LeadSource;
(function (LeadSource) {
    LeadSource["WEBSITE"] = "Website";
    LeadSource["INSTAGRAM"] = "Instagram";
    LeadSource["REFERRAL"] = "Referral";
})(LeadSource || (exports.LeadSource = LeadSource = {}));
const LeadSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    status: {
        type: String,
        enum: Object.values(LeadStatus),
        default: LeadStatus.NEW,
    },
    source: {
        type: String,
        enum: Object.values(LeadSource),
        required: true,
    },
}, { timestamps: true });
// Index for search
LeadSchema.index({ name: 'text', email: 'text' });
exports.default = mongoose_1.default.model('Lead', LeadSchema);
//# sourceMappingURL=Lead.js.map