const mongoose = require('mongoose');
mongoose.connect(process.env.DBURL, {})
    .then(() => {
        console.log("DB connected Successfully");

    })
    .catch((err) => console.log(err.message))