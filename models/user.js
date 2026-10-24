const mongoose=require('mongoose');
const schema= mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const plugin = passportLocalMongoose.default || passportLocalMongoose;

const userSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(plugin);

const User = mongoose.model('User', userSchema);
module.exports = User;
