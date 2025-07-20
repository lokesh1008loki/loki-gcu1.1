"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var existingSettings, existingSeo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.siteSettings.findFirst()];
                case 1:
                    existingSettings = _a.sent();
                    if (!!existingSettings) return [3 /*break*/, 3];
                    // @ts-ignore - Prisma client type issue
                    return [4 /*yield*/, prisma.siteSettings.create({
                            data: {
                                whatsappLink: "https://whatsapp.com",
                                facebookLink: "https://facebook.com",
                                instagramLink: "https://instagram.com",
                                twitterLink: "https://twitter.com",
                                phoneNumber: "+1 437 849 7841",
                                email: "support@gocomfortusa.com",
                            },
                        })];
                case 2:
                    // @ts-ignore - Prisma client type issue
                    _a.sent();
                    console.log('Default site settings created');
                    return [3 /*break*/, 4];
                case 3:
                    console.log('Site settings already exist');
                    _a.label = 4;
                case 4: return [4 /*yield*/, prisma.seoSettings.findFirst()];
                case 5:
                    existingSeo = _a.sent();
                    if (!!existingSeo) return [3 /*break*/, 7];
                    return [4 /*yield*/, prisma.seoSettings.create({
                            data: {
                                siteTitle: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
                                siteDescription: "GocomfortUSA offers amazing deals on ticket bookings and bill payments, flight ticket bookings, House rent payment and many more services, ensuring you get the best discounts and a hassle-free experience. Save on everything from travel to living.",
                                keywords: "tickets, bill payments, flight tickets, house rent, travel deals, discounts",
                                canonicalUrl: "https://gocomfortusa.com",
                                ogTitle: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
                                ogDescription: "Your one-stop solution for tickets and bill payments",
                                ogImage: "/ass/logo-round.png",
                                twitterTitle: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
                                twitterDescription: "Your one-stop solution for tickets and bill payments",
                                twitterImage: "/ass/logo-round.png"
                            }
                        })];
                case 6:
                    _a.sent();
                    console.log('Default SEO settings created');
                    return [3 /*break*/, 8];
                case 7:
                    console.log('SEO settings already exist');
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error(e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
