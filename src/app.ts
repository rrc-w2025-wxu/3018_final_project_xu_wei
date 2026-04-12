import express from "express";
import { apiAnalyticsMiddleware, getApiStats } from './api/v1/middleware/apiAnalytics'; 
import setupSwagger from "./../config/swagger";
import morgan from "morgan";

import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import HealthCheck_router from "./api/v1/routes/HealthCheck_Routes";
import Order_router from "./api/v1/routes/Order_Routes";
import Payment_router from "./api/v1/routes/Payment_Routes";
import Product_router from "./api/v1/routes/Product_Routes";
import Cart_router from "./api/v1/routes/Cart_Routes";

const app = express();

app.use(apiAnalyticsMiddleware);
app.get('/api/stats', getApiStats);

setupSwagger(app);

app.use(morgan("combined"));
app.use(consoleLogger);
app.use(accessLogger);
app.use(errorLogger);
app.use(express.json());

app.use("/api/v1", HealthCheck_router);
app.use("/api/v1/orders", Order_router);
app.use("/api/v1/payments", Payment_router);
app.use("/api/v1/products", Product_router);
app.use("/api/v1/carts", Cart_router);

app.use(errorHandler);

export default app;