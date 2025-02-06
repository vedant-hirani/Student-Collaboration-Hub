import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username : {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },


});

userSchema.pre('save', function (next) {
  console.log('Saving user:', this); // Debugging log
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
