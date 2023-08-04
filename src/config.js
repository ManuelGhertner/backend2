import * as dotenv from 'dotenv'
import {} from "dotenv/config";
import { Command } from 'commander';
dotenv.config({ path:"../.env" })

const program = new Command();
program
    .option("-m --mode <mode>", "Execution mode (PRODUCTION / DEVELOPMENT)", "DEVELOPMENT")
    .parse(process.argv);

const cl_options = program.opts();

dotenv.config({ path: cl_options.mode == 'DEVEL' ? '.env.development': '.env.production' });

const config = {
    MONGOOSE_URL: process.env.MONGOOSE_URL,
    PORT: process.env.PORT,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY
};

export default config;