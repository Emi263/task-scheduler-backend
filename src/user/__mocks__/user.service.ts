import { userStub } from '../stubs/user.stubs';

export const UserService = jest.fn().mockReturnValue({
  getCurrentUser: jest.fn().mockReturnValue(userStub()),
});
