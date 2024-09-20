import { Test, TestingModule } from '@nestjs/testing';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';

describe('ProposalController', () => {
  let proposalController: ProposalController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProposalController],
      providers: [ProposalService],
    }).compile();

    proposalController = app.get<ProposalController>(ProposalController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(proposalController.getHello()).toBe('Hello World!');
    });
  });
});
