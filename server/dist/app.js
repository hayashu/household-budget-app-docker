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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.client = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const categories_1 = require("./routes/categories");
const transactions_1 = require("./routes/transactions");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const client = new pg_1.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});
exports.client = client;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/categories', categories_1.categoriesRouter);
app.use('/api/transactions', transactions_1.transactionsRouter);
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection error:', error);
    }
});
connectDB();
app.get('/', (req, res) => {
    res.send('Welcome to the Household Budget App API');
});
