const dotenv = require('dotenv');
dotenv.config();
process.env.TZ = "Asia/Kolkata";

const express = require('express');
const connectDb = require('./db/db');
const app = express();
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');
const adminRouter = require('./routes/adminRoutes');
const manageRouter = require('./routes/managementRouter');
const router = require('./routes/notificationRoutes');

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: ["https://admin.karwastudypoint.com/login", "https://management.karwastudypoint.com", "https://karwastudypoint.com", "https://library-user-frontend.onrender.com", "https://labadmin.onrender.com", "https://study-lab-management.onrender.com", "http://localhost:5173", "https://library-admin-frontend.onrender.com", "https://library-user-fe.onrender.com", "https://study-lab-admin.onrender.com"], credentials: true }));
// 

app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/management', manageRouter)
app.use("/api/notifications", router);


connectDb()
    .then(() => {
        console.log("Database Connected")
        app.listen(`${process.env.PORT}`, () => console.log("Server Started"));
    })
    .catch(() => {
        console.log("Database connection failed 🤺");
    })