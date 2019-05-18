import mongoose from 'mongoose';

export default async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log(`Successfully connected to DB at ${process.env.DB_URL}`);
        return;
    } catch (err) {
        console.err.log(err);
        return err;
    }
};
