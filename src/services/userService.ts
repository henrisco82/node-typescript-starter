import User, { type UserDocument } from '../models/userModel';

async function findAllUsers(): Promise<UserDocument[]> {
  const users = await User.find({});
  return users;
}

async function findUser(email: string): Promise<UserDocument | null> {
  const user = await User.findOne({ email });
  if (user == null) return null;
  return user;
}

async function findUserById(id: string): Promise<UserDocument | null> {
  const user = await User.findById(id).select('-password');
  if (user == null) return null;
  return user;
}

async function authenticateUser(
  email: string,
  password: string,
): Promise<UserDocument | null> {
  const user = await findUser(email);
  if (user === null) throw new Error('User not found');
  const match: boolean = await user.matchPassword(password);
  if (!match) return null;
  return user;
}

async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<UserDocument | null> {
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user._id === null) return null;
  return user;
}

async function deleteUserById(id: string): Promise<UserDocument | null> {
  const user = await User.findByIdAndDelete(id);
  if (user == null) return null;
  return user;
}

async function update(
  id: string,
  name: string,
  email: string,
  isAdmin?: boolean,
): Promise<UserDocument | null> {
  const user = await User.findByIdAndUpdate(
    id,
    {
      name,
      email,
      isAdmin,
    },
    { new: true },
  );
  if (user == null) return null;
  return user;
}

async function updateProfile(
  id: string,
  name: string,
  email: string,
  password: string,
): Promise<UserDocument | null> {
  const user = await User.findById(id);
  if (user != null) {
    user.name = name;
    user.email = email;
    if (password !== '') {
      user.password = password;
    }
    await user.save();
  }

  if (user == null) return null;
  return user;
}

export {
  findAllUsers,
  findUser,
  findUserById,
  authenticateUser,
  createUser,
  deleteUserById,
  update,
  updateProfile,
};
