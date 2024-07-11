import cron from "node-cron";
import { processRecurringTransactions } from "./transaction.js";
import chalk from "chalk";
// schedule the task to run daily
const scheduleTransactions = () => {
    const job = cron.schedule("0 0 * * *", () => {
        processRecurringTransactions();
    });
    job.start();
    console.log(chalk.yellow("Scheduled successfully! started."));
    return job; // Return the ScheduledTask object
};
export default scheduleTransactions;
