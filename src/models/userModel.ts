import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserInput {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface UserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  token: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(enteredPassword, user.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = model<UserDocument>('User', userSchema);

export default User;
