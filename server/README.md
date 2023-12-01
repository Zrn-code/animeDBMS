# API server


## How to Run:

1. **Install Node.js:**
   - If you haven't already, download and install Node.js from the [official Node.js website](https://nodejs.org/).
   - After installation, you can verify if Node.js is installed correctly by typing `node -v` in your command line or terminal. This command will display the installed Node.js version.

2. **Install nodemon:**
   - After installing Node.js, use the following command to install nodemon:
     ```
     npm install -g nodemon
     ```
   - The `-g` flag is used for a global installation of nodemon, enabling you to use the `nodemon` command in your command line.

3. **Install Project Dependencies:**
   - Open your command line or terminal and navigate to the root directory of your project.
   - Run the following command to install all project dependencies listed in `package.json`:
     ```
     npm install
     ```
   - This command will install all the necessary dependencies required for your project.

4. **Start the Server:**
   - Once the dependencies are installed, start the server using the following command:
     ```
     nodemon app.js
     ```
   - This command will start the server using nodemon, which automatically restarts the server when changes are detected in the project files.

Ensure that you run these commands in your command line or terminal from the root directory of your project where the `package.json` file is located.
## Environment Variables:
Before running the server, ensure the following environment variables are set:

* `MYSQL_HOST` = Database connection URL
* `MYSQL_USER `= Database connection User
* `MYSQL_PASSWORD` = Database connection Password
* `MYSQL_DATABASE` = Database connection
* `JWT_SECRET`: Secret key for JWT encryption
* `PORT`: The port number where the server runs


## Contributions
Feedback and contributions are welcome! 
Feel free to participate by creating issues or pull requests to improve this project.