const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, 'username must be 5 characters or longer'],
    validate: {
      validator: function(u) {
        return /[a-zA-Z_][a-zA-Z0-9_]{4,}/.test(u);
      },
      message: props => `${props.value} is not a valid username!`
    }
  },
  password: {
    // hashed password
    type: String,
    required: true
  },
  uuid: {
    type: String,
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
