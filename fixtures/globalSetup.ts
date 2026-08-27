import path from 'path';
import dotenv from 'dotenv';

const testEnv = process.env.TEST_ENV;
dotenv.config({
    path: path.resolve(__dirname, `../config/.env.${testEnv}`)
});

export default async function globalSetup() {
    console.log("Starting Tests");
}