import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { ProposalModule } from '../src/proposal.module';
import { CreateProposalDto } from '../src/presenters/dtos/create-proposal.dto';

describe('Proposal (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProposalModule],
    })
      .overrideProvider('IAM_SERVICE')
      .useValue({
        send: jest.fn((pattern, data) => {
          console.log(
            `Mocked transport called with pattern: ${pattern}, data:`,
            data,
          );

          if (pattern === 'user.checkIfExists' && data.clientId) {
            return Promise.resolve(true);
          }
          if (pattern === 'user.checkIfExists' && data.travelAgentId) {
            return Promise.resolve(true);
          }
          return Promise.resolve(false);
        }),
      })
      .overrideProvider('TRAVEL_PACKAGE_SERVICE')
      .useValue({
        send: jest.fn((pattern, _) => {
          if (pattern === 'travel-package.checkIfExists') {
            return Promise.resolve(true); // Mock travel package exists
          }
          return Promise.resolve(false); // Default mock response
        }),
      })
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    const dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(() => {
    app.close();
  });

  describe('POST /proposals', () => {
    test('accept', async () => {
      const createProposalDto: CreateProposalDto = {
        clientId: 'client_id',
        travelPackageId: 'travel_package_id',
        travelAgentId: 'travel_agent_id',
        price: parseFloat(faker.commerce.price()),
      };

      const { body } = await request(app.getHttpServer())
        .post('/proposals')
        // .set('Authorization', `Bearer ${accessToken}`)
        .send(createProposalDto);

      console.log('body ==>', body);

      // expect(status).toEqual(201);
    }, 15000);
  });
});
