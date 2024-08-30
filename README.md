<h1 style="text-align: center;">Travel Package Proposal API </h1>

### Notes: 
- The project is currently under construction.
- I'm currently refactoring the existing monolithic structure into microservices. 
   

## :bulb: About the project

The goal of this project is to gain a deep understanding of the features and capabilities offered by NestJS while applying software concepts, architecture principles, and best practices. 

For now, I've been considering the following approaches:

- Writing unit tests for services, repositories, domain classes containing crucial logic, utility classes, etc.
- Integration/e2e tests for endpoints using real implementations as much as possible.
- Using Docker to construct the services environment every time an e2e test is executed.
- Implementing a dedicated microservice for IAM.
- Implementing authentication using email and password, social login with Google, and also 2FA feature.
- Implementing dynamic refresh tokens including in-memory token storage.
- Implementing a more robust authorization flow with permissions and roles.
- New Focus: 
  - Incorporating microservices, serverless architecture, and related functionalities to gain a deeper understanding of how these components work together in a real-world project, including refactoring existing monolithic components into microservices. 
  - Deploying the application using AWS cloud features, with a particular focus on Lambda functions for serverless execution.

## :spiral_notepad: System Architecture

- **I'll update here soon.**

## :spiral_notepad: Requirements

- **I'll update here soon.**

## :page_facing_up: Documentation

- **I'll update here soon.**

## :white_square_button: How to Run

### Installation
1. Install dependencies:
   ```bash
   npm install

### Running the application
1. You can use Docker to set up the necessary environment before running the application:
   ```bash
   docker compose up -d db redis

2. Run the migrations
   ```bash
   npm run migration:run

3. To start the application in development mode:
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
