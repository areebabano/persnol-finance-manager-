import chalk from "chalk";

export const twoFactorAuthentication = async () => {
  console.log(chalk.green("\nTwo-factor authentication has been enabled!\n"));
};

export const encryptData = async (data: string): Promise<string> => {
  // implement dummy encryption
  return data;
};
