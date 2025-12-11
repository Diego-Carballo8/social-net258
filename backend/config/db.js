import mongoose from 'mongoose';

const connectDB = async () => {
    // Use provided MONGO_URI or fallback to a local MongoDB instance (useful for dev)
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/my_social_network';

    if (!process.env.MONGO_URI) {
        console.warn('⚠️  MONGO_URI no está definida. Usando fallback local:', uri);
        console.warn('   Considera añadir un archivo `backend/.env` con `MONGO_URI` apuntando a tu MongoDB Atlas o local.');
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error conectando a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;