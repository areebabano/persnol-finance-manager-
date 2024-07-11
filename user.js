import bcrypt from "bcrypt";
// user.ts
// import bcrypt from 'bcrypt';
export class User {
    username;
    password;
    email;
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
    // Method to hash password before storing
    async setPassword(password) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(password, saltRounds);
    }
    // Method to check password
    async checkPassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}
export let users = []; // Array to store users
// Add a sample user for authentication
(async () => {
    const user = new User("testUser", "testPassword", "test@example.com");
    await user.setPassword("testPassword"); // Hash the password
    users.push(user);
})();
export const userAuthentication = (username, password, email) => {
    return new Promise(async (resolve, reject) => {
        const user = users.find((user) => user.username === username);
        if (user && (await user.checkPassword(password))) {
            resolve(user); // Resolve with true if authentication is successful
        }
        else {
            resolve(null); // Resolve with false if authentication fails
        }
    });
};
