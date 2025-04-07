require("dotenv").config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
const admin = require('firebase-admin');

// Khởi tạo Firebase (thêm cấu hình của bạn tại đây)

const serviceAccount = require('D:/WebMovie/back_end/firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//ngrok http 5000
// MoMo API Config
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const partnerCode = process.env.MOMO_PARTNER_CODE;
const redirectUrl = process.env.MOMO_RETURN_URL;
const ipnUrl = 'https://64a7-2405-4803-fe22-e8d0-f872-610b-1cd2-7cc1.ngrok-free.app/callback';
const requestType = "captureWallet";
const orderInfo = 'Pay with MoMo';
const autoCapture = true;
const lang = 'vi';
const orderGroupId = '';

// Tạo yêu cầu thanh toán MoMo
const createMomoPayment = async (amount, userId, ticketInfo) => {
    try {
        const requestId = partnerCode + new Date().getTime();
        const orderId = requestId;

        // Encode extraData chứa userId và thông tin vé
        const extraData = Buffer.from(JSON.stringify({ userId, ticketInfo })).toString('base64');

        // Tạo chuỗi signature
        const rawSignature = [
            `accessKey=${accessKey}`,
            `amount=${amount}`,
            `extraData=${extraData}`,
            `ipnUrl=${ipnUrl}`,
            `orderId=${orderId}`,
            `orderInfo=${orderInfo}`,
            `partnerCode=${partnerCode}`,
            `redirectUrl=${redirectUrl}`,
            `requestId=${requestId}`,
            `requestType=${requestType}`
        ].join('&');

        // Mã hóa HMAC SHA256
        const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

        const requestBody = {
            partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            extraData,
            requestType,
            autoCapture,
            lang,
            orderGroupId,
            signature
        };

        // Gửi yêu cầu đến MoMo
        const response = await axios.post(process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
            headers: { 
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
            }
        });

        console.log("MoMo Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("MoMo API Error:", error.response?.data || error.message);
        throw error;
    }
};

// Endpoint khởi tạo thanh toán
app.post('/payment', async (req, res) => {
    try {
        const { amount, userId, ticketInfo } = req.body;
        if (!amount || !userId || !ticketInfo) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const paymentResult = await createMomoPayment(amount, userId, ticketInfo);
        res.status(200).json(paymentResult);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

// Xử lý callback từ MoMo (IPN - Instant Payment Notification)
app.post('/callback', async (req, res) => {
    try {
        console.log('Callback data received:', req.body);
        const { 
            partnerCode, orderId, requestId, amount, orderInfo,
            orderType, transId, resultCode, message, payType,
            responseTime, extraData, signature
        } = req.body;

        // Xác thực chữ ký từ MoMo (quan trọng để đảm bảo dữ liệu đến từ MoMo)
        const rawSignature = [
            `accessKey=${accessKey}`,
            `amount=${amount}`,
            `extraData=${extraData}`,
            `message=${message}`,
            `orderId=${orderId}`,
            `orderInfo=${orderInfo}`,
            `orderType=${orderType}`,
            `partnerCode=${partnerCode}`,
            `payType=${payType}`,
            `requestId=${requestId}`,
            `responseTime=${responseTime}`,
            `resultCode=${resultCode}`,
            `transId=${transId}`
        ].join('&');

        const calculatedSignature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        // Kiểm tra chữ ký
        if (calculatedSignature !== signature) {
            console.error('Invalid signature');
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // Giải mã extraData
        let ticketData = {};
        if (extraData) {
            try {
                const decodedExtraData = JSON.parse(Buffer.from(extraData, 'base64').toString());
                console.log('Decoded Extra Data:', decodedExtraData);
                ticketData = decodedExtraData;
            } catch (e) {
                console.error("Error decoding extraData:", e.message);
            }
        }

        // Xử lý kết quả thanh toán
        if (resultCode === 0) {
            console.log('Transaction successful');
            
            // Save to the "ticketData" collection that you have in your Firestore
            try {
                const paymentRef = db.collection('ticketData').doc(orderId);
                const ticketInfo = ticketData.ticketInfo;
                const dataToSave = {
                    userId: ticketData.userId,
                    amount: parseInt(amount),
                    orderId: orderId,
                    transId: transId,
                    movieId: ticketInfo.movieId,
                    movieTitle: ticketInfo.movieTitle,
                    roomId: ticketInfo.roomId || "defaultRoomId", // Đảm bảo không có giá trị undefined
                    showtimeId: ticketInfo.showtimeId,
                    date: ticketInfo.date,
                    time: ticketInfo.time,
                    seatNumbers: ticketInfo.seatNumbers,
                    status: 'success',
                    paymentDate: admin.firestore.FieldValue.serverTimestamp()
                  };
                  await paymentRef.set(dataToSave);
                
                console.log(`Payment data saved to Firebase for order: ${orderId}`);
            } catch (fbError) {
                console.error('Firebase saving error:', fbError);
                // Log the detailed error for debugging
                console.error('Firebase error details:', fbError.message, fbError.code);
            }
        }

        // MoMo yêu cầu trả về mã 204 khi xử lý thành công
        return res.status(204).send();
    } catch (error) {
        console.error('Callback Error:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Endpoint để kiểm tra trạng thái giao dịch (thêm từ file 1)
app.post('/check-status-transaction', async (req, res) => {
    try {
        const { orderId } = req.body;
        
        if (!orderId) {
            return res.status(400).json({ error: 'Missing orderId' });
        }

        // Tạo chữ ký
        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode,
            requestId: orderId,
            orderId,
            signature,
            lang
        };

        // Gửi yêu cầu kiểm tra đến MoMo
        const result = await axios({
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(requestBody),
        });

        return res.status(200).json(result.data);
    } catch (error) {
        console.error('Check transaction status error:', error);
        return res.status(500).json({ 
            error: error.response?.data || error.message 
        });
    }
});
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`, req.body);
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.use(express.static('./public'));
module.exports = { createMomoPayment };