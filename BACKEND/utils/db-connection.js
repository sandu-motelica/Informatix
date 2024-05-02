import mongoose from 'mongoose';
import { uri } from '../constants/db.js';
export const connectDB = async ()=> {
    try {
        await mongoose.connect(uri);
    }
    catch(e) {
        console.log(e);
    }
}