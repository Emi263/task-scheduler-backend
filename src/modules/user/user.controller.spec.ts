import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { userStub } from './stubs/user.stubs';
import { UserController } from './user.controller';
import { UserService } from './user.service';

//tell jest to mock user service

jest.mock('./user.service');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [UserService], //supplies the mock value, not the real service
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe('getUser', () => {
    let user: User;
    beforeEach(async () => {
      user = await userController.getUser(userStub().id);
    });

    test('it should call user service', () => {
      expect(userService.getCurrentUser).toHaveBeenCalledWith(userStub().id);
    });

    test('it should return a user', () => {
      expect(user).toEqual(userStub());
    });
  });
});
