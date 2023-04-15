const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = mongoose.Schema({
    name: {type: String , required: true},
    email: {type: String , required: true},
    password: {type: String , required: true},
    pic: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
},{
    timestamps : true,
})

UserSchema.methods.matchPassword = async function (EnteredPassword){
    return await bcrypt.compare(EnteredPassword, this.password)
}


UserSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', UserSchema)

module.exports = User