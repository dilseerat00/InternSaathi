import mongoose from "mongoose";    
export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://dilseeratjassal:Internsaathi123@cluster1.ywbgnz5.mongodb.net/Internsaathi')
    .then(() => console.log("MongoDB connected successfully"))
}