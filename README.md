<h1 style="text-align: center;">Travel Package Proposal API (under construction)</h1>

## :bulb: About the project

The goal of this project is to gain a deep understanding of the features and capabilities offered by NestJS while applying software concepts, architecture principles, and best practices. 

For now, I've been considering the following approaches:

- Writing unit tests for services, repositories, domain classes containing crucial logic, utility classes, etc.
- Integration/e2e tests for endpoints using real implementations as much as possible.
- Using Docker to construct the services environment every time an e2e test is executed.
- Implementing a dedicated layer for IAM.
- Implementing authentication using email and password, social login with Google, and also 2FA feature.
- Implementing dynamic refresh tokens including in-memory token storage.
- Implementing a more robust authorization flow with permissions and roles.
- Shifting the focus less on clean architecture and more on DDD for this project.

## :spiral_notepad: Requirements

- **I'll update here soon.**

## :page_facing_up: Documentation

- You can access the Swagger documentation at http://localhost:3000/api.

## :white_square_button: How to Run

### Installation
1. Install dependencies:
   ```bash
   npm install

### Running the application
1. You can use Docker to set up the necessary environment before running the application:
   ```bash
   docker compose up -d db storage-redis
   
2. To start the application in development mode:
   ```bash
   npm run start:dev

### Running the tests
1. To run unit tests:
   ```bash
   npm run test

2. To run unit tests in watch mode:
   ```bash
   npm run test:watch
   
3. Before running e2e tests, ensure Docker is installed and running on your machine. To run e2e tests:
   ```bash
   npm run test:e2e

## :shipit: Contributing

If you're interested in helping with the project, here's what you can do:

- Fork the repository.
- Create a new branch for your changes.
- Make your changes and commit them to your branch.
- Push your branch to your forked repository.
- Open a pull request against the main branch of the original repository.

## License

[MIT](https://choosealicense.com/licenses/mit/)
