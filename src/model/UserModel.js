const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');
const UserSchema = Schema({
    name: {
        type: String,
        required: [true, "Name field can't remain empty"],
        minlength: 1,
        maxlength: 30
    },
    email: {
        type: String,
        required: [true, "Email field can't remain empty"],
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: [true, "Password field can't remain empty"],
        minlength: 5,
        maxlength: 255
    }
});

// UserSchema.methods.genJwt = function () {
//     const token = jwt.sign({ _id: this._id, email: this.email },
//         process.env.JWT_KEY,
//         { expiresIn: 60 });

//     return token;
// }
module.exports.User = model("User", UserSchema);