import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: Number,
  password: String,
});

const userModel = mongoose.model(usersCollection, userSchema);
export default userModel;
