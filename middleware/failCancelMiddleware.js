const { Order } = require("../model/OrderModel");

module.exports = async function (req, res, next) {
    try {
        const orderdata = await Order.deleteOne({ transactionId: req.params.tranId });

        if (orderdata.deletedCount > 0) {
            res.redirect(`http://localhost:5173/`)
        }
    } catch (error) {
        console.log(error.message)
        res.redirect("http://localhost:5173/")
    }
    next()
}