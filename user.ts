import bcrypt from "bcrypt";
// let bcrypt = require("bcrypt")
import { UserType } from "./types.js";

// user.ts

// import bcrypt from 'bcrypt';

export class User {
  username: string;
  password: string;
  email: string;

  constructor(username: string, password: string, email: string) {
    this.username = username;
    this.password = password;
    this.email = email;
  }

  // Method to hash password before storing
  async setPassword(password: string) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }

  // Method to check password
  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

export let users: User[] = []; // Array to store users

// Add a sample user for authentication
(async () => {
  const user = new User("testUser", "testPassword", "test@example.com");
  await user.setPassword("testPassword"); // Hash the password
  users.push(user);
})();

export const userAuthentication = (
  username: string,
  password: string,
  email: string
): Promise<User | null> => {
  return new Promise(async (resolve, reject) => {
    const user = users.find((user) => user.username === username);
    if (user && (await user.checkPassword(password))) {
      resolve(user); // Resolve with true if authentication is successful
    } else {
      resolve(null); // Resolve with false if authentication fails
    }
  });
};
