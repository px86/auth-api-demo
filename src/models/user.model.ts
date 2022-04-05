import mongoose, { Schema } from 'mongoose';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  uuid?: string;
  verified: boolean;
}

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, 'username is too short, minimum required length is 5'],
    maxlength: [25, 'username is too long, maximum allowed length is 25'],
    validate: {
      validator: function(u: string) {
        return /[a-zA-Z_][a-zA-Z0-9_]{4,}/.test(u);
      },
      message: (props:any) => `${props.value} is not a valid username!`
    }
  },
  password: { type: String, required: true },
  uuid: { type: String },
  verified: { type: Boolean, default: false },
});

const UserModel =  mongoose.model<User>('User', UserSchema);

export default UserModel;
