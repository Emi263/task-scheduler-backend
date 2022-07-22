import { User } from '@prisma/client';

export const userStub = (): User => {
  return {
    id: 1,
    email: 'test@gmail.com',
    createdAt: new Date('2022-06-01T13:13:04.992Z'),
    updatedAt: new Date('2022-06-01T13:13:04.992Z'),
    age: 21,
    name: 'test',
    hashedPassword: 'test123',
    profileImage: '',
    isGoogleSignIn: false,
    shouldChangePassword: false,
    expoToken: '',
  };
};
