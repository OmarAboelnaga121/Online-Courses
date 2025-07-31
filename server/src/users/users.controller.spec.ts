import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDto } from '../auth/dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getInstructorProfile: jest.fn(),
    updateUserProfile: jest.fn(),
  };

  const mockUser: UserDto = {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'student',
    avatarUrl: 'http://example.com/avatar.jpg',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the user profile', () => {
      const result = controller.getProfile(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getInstructorProfile', () => {
    it('should return instructor profile', async () => {
      const mockInstructorProfile = {
        id: '2',
        name: 'Jane Doe',
        username: 'janedoe',
        email: 'jane@example.com',
        avatarUrl: 'http://example.com/avatar.jpg',
        role: 'instructor',
        myCourses: [
          {
            id: '1',
            title: 'Test Course',
            description: 'Test Description',
            thumbnail: 'http://example.com/thumbnail.jpg',
          },
        ],
      };

      mockUsersService.getInstructorProfile.mockResolvedValue(mockInstructorProfile);

      const result = await controller.getInstructorProfile('2');
      expect(result).toEqual(mockInstructorProfile);
      expect(mockUsersService.getInstructorProfile).toHaveBeenCalledWith('2');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile without photo', async () => {
      const updateData = {
        name: 'John Updated',
        username: 'johnupdated',
      };

      const updatedUser = {
        ...mockUser,
        name: updateData.name,
        username: updateData.username,
      };

      mockUsersService.updateUserProfile.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(mockUser, updateData);
      expect(result).toEqual(updatedUser);
      expect(mockUsersService.updateUserProfile).toHaveBeenCalledWith(mockUser, updateData, undefined);
    });

    it('should update user profile with photo', async () => {
      const updateData = {
        name: 'John Updated',
        username: 'johnupdated',
      };

      const mockFile = {
        fieldname: 'photo',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 4,
      } as Express.Multer.File;

      const updatedUser = {
        ...mockUser,
        name: updateData.name,
        username: updateData.username,
        avatarUrl: 'http://example.com/new-avatar.jpg',
      };

      mockUsersService.updateUserProfile.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(mockUser, updateData, mockFile);
      expect(result).toEqual(updatedUser);
      expect(mockUsersService.updateUserProfile).toHaveBeenCalledWith(mockUser, updateData, mockFile);
    });
  });
});
