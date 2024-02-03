const { Order } = require("../model/OrderModel");

const orderData = (tran_id, body) => {
    return new Order({
        transactionId: tran_id,
        customer: {
            deliveryAddress: body.customer.deliveryAddress,
            paymentType: body.customer.paymentType,
            phone: body.customer.phone
        },
        ingredients: [
            {
                amount: body.ingredients[0].amount,
                type: body.ingredients[0].type
            },
            {
                amount: body.ingredients[1].amount,
                type: body.ingredients[1].type
            },
            {
                amount: body.ingredients[2].amount,
                type: body.ingredients[2].type
            }
        ],
        orderTime: body.orderTime,
        price: body.price,
        userId: body.userId
    })
}

module.exports = orderData;