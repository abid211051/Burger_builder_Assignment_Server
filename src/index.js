require("dotenv").config();
require("./config/db");
const cors = require("cors");
const express = require("express");
const app = express();
const { Order } = require('./model/OrderModel');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const SSLCommerzPayment = require('sslcommerz-lts');
const orderData = require("./controllers/orderObject");
const failCancelMiddleware = require("./middleware/failCancelMiddleware");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false //true for live, false for sandbox

app.post("/order", async (req, res) => {
    const tran_id = "_" + Math.random().toString(36).substring(2, 9) + (new Date()).getTime();
    try {
        const neworder = orderData(tran_id, req.body);
        if (req.body.customer.paymentType === "Online Payment") {
            const data = {
                total_amount: req.body.price,
                currency: 'BDT',
                tran_id: tran_id, // use unique tran_id for each api call
                success_url: `http://localhost:3001/payment/success/${tran_id}`,
                fail_url: `http://localhost:3001/payment/fail/${tran_id}`,
                cancel_url: `http://localhost:3001/payment/cancel/${tran_id}`,
                ipn_url: 'http://localhost:3001/payment/ipn',
                shipping_method: 'Courier',
                product_name: 'Burger',
                product_category: 'Food',
                product_profile: 'general',
                product_ingredients: req.body.ingredients,
                cus_id: req.body.userId,
                cus_email: "abid@gmail.com",
                cus_add1: req.body.customer.deliveryAddress,
                cus_phone: req.body.customer.phone,
                ship_name: "abid",
                ship_add1: req.body.customer.deliveryAddress,
                ship_city: 'feni',
                ship_state: 'chittagong',
                ship_postcode: 1000,
                ship_country: 'Bangladesh',
                order_time: req.body.orderTime
            };
            const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
            sslcz.init(data).then(async (apiResponse) => {
                // Redirect the user to payment gateway
                if (apiResponse.status === "SUCCESS") {
                    await neworder.save();
                }
                let GatewayPageURL = apiResponse.GatewayPageURL
                res.status(200).send({ url: GatewayPageURL })
            });
        }
        else {
            neworder.paymentStatus = "Delivery on Process";
            await neworder.save();
            res.status(200).send({ url: `https://burger-builder-client.netlify.app/orders` })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
});

app.post("/payment/success/:tranId", async (req, res) => {
    try {
        const orderdata = await Order.updateOne({ transactionId: req.params.tranId }, {
            $set: {
                paymentStatus: "Paid Successfully"
            }
        })
        if (orderdata.modifiedCount > 0) {
            res.redirect(`https://burger-builder-client.netlify.app/orders`);
        }
    } catch (error) {
        res.redirect(`https://burger-builder-client.netlify.app/`);
    }
})
app.post("/payment/fail/:tranId", failCancelMiddleware);
app.post("/payment/cancel/:tranId", failCancelMiddleware);
app.get("/api/orders/:userid", async (req, res) => {
    try {
        const allorders = await Order.find({ userId: req.params.userid, paymentStatus: { $ne: 'failed' } });
        if (allorders.length < 0) {
            return res.status(404).send([]);
        }
        res.status(200).send(allorders)
    } catch (error) {
        console.log(error.message)
        res.status(500).send([]);
    }
})

app.get('/', (req, res) => {
    res.send("Hello World");
})
app.listen(process.env.PORT, () => {
    console.log(`Server is running in port ${process.env.PORT}`);
})