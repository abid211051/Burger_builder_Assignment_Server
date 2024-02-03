const { Schema, model } = require('mongoose');
const OrderSchema = Schema({
    transactionId: { type: String, unique: [true, "Duplicate transactionId not allowed"] },
    customer: {
        deliveryAddress: {
            type: String,
            validate: {
                validator: (value) => value !== "",
                message: "Address can't remain empty"
            }
        },
        paymentType: { type: String },
        phone: {
            type: String,
            validate: {
                validator: (value) => value !== "",
                message: "Phone can't remain empty"
            }
        }
    },
    ingredients: [
        {
            amount: { type: Number },
            type: { type: String, default: "salad" }
        },
        {
            amount: { type: Number },
            type: { type: String, default: "cheese" }
        },
        {
            amount: { type: Number },
            type: { type: String, default: "meat" }
        }
    ],
    orderTime: { type: Date, default: new Date() },
    price: { type: Number },
    paymentStatus: { type: String, default: "failed" },
    userId: { type: String }
});

// UserSchema.methods.genJwt = function () {
//     const token = jwt.sign({ _id: this._id, email: this.email },
//         process.env.JWT_KEY,
//         { expiresIn: 60 });

//     return token;
// }
module.exports.Order = model("Order", OrderSchema);