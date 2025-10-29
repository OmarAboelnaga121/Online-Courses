// Mock cloudinary
const mockCloudinary = {
  uploader: {
    upload_stream: jest.fn(),
  },
};

// Mock streamifier
const mockStreamifier = {
  createReadStream: jest.fn(),
};

jest.mock('cloudinary', () => ({
  v2: mockCloudinary,
}));
jest.mock('streamifier', () => mockStreamifier);

import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  const mockFile = {
    buffer: Buffer.from('test file content'),
    originalname: 'test.jpg',
    mimetype: 'image/jpeg',
    size: 1024,
  } as Express.Multer.File;

  const mockVideoFile = {
    buffer: Buffer.from('test video content'),
    originalname: 'test.mp4',
    mimetype: 'video/mp4',
    size: 2048,
  } as Express.Multer.File;

  const mockCloudinaryResponse = {
    public_id: 'test_id',
    secure_url: 'https://res.cloudinary.com/test/image/upload/test.jpg',
    url: 'http://res.cloudinary.com/test/image/upload/test.jpg',
    format: 'jpg',
    width: 800,
    height: 600,
  };

  const mockReadStream = {
    pipe: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);

    // Setup streamifier mock
    mockStreamifier.createReadStream.mockReturnValue(mockReadStream);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const mockUploadStream = {
        pipe: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((callback) => {
        // Simulate successful upload
        setTimeout(() => callback(null, mockCloudinaryResponse), 0);
        return mockUploadStream;
      });

      const result = await service.uploadFile(mockFile);

      expect(mockCloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        expect.any(Function)
      );
      expect(mockStreamifier.createReadStream).toHaveBeenCalledWith(mockFile.buffer);
      expect(mockReadStream.pipe).toHaveBeenCalledWith(mockUploadStream);
      expect(result).toEqual(mockCloudinaryResponse);
    });

    it('should handle upload errors', async () => {
      const uploadError = new Error('Upload failed');
      const mockUploadStream = {
        pipe: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((callback) => {
        // Simulate upload error
        setTimeout(() => callback(uploadError, null), 0);
        return mockUploadStream;
      });

      await expect(service.uploadFile(mockFile)).rejects.toThrow('Upload failed');

      expect(mockCloudinary.uploader.upload_stream).toHaveBeenCalled();
      expect(mockStreamifier.createReadStream).toHaveBeenCalledWith(mockFile.buffer);
    });

    it('should handle no result from Cloudinary', async () => {
      const mockUploadStream = {
        pipe: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((callback) => {
        // Simulate no result
        setTimeout(() => callback(null, null), 0);
        return mockUploadStream;
      });

      await expect(service.uploadFile(mockFile)).rejects.toThrow(
        'No result returned from Cloudinary'
      );
    });

    it('should create read stream from file buffer', async () => {
      const mockUploadStream = {
        pipe: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((callback) => {
        setTimeout(() => callback(null, mockCloudinaryResponse), 0);
        return mockUploadStream;
      });

      await service.uploadFile(mockFile);

      expect(mockStreamifier.createReadStream).toHaveBeenCalledWith(mockFile.buffer);
      expect(mockReadStream.pipe).toHaveBeenCalledWith(mockUploadStream);
    });
  });

  describe('uploadVideoFile', () => {
    const mockVideoResponse = {
      ...mockCloudinaryResponse,
      resource_type: 'video',
      format: 'mp4',
      duration: 120,
    };

    it('should upload video file successfully', async () => {
      const mockUploadStream = {
        pipe: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        // Simulate successful video upload
        setTimeout(() => callback(null, mockVideoResponse), 0);
        return mockUploadStream;
      });

      const result = await service.uploadVideoFile(mockVideoFile);

      expect(mockCloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        { resource_type: 'video' },
        expect.any(Function)
      );
      expect(mockStreamifier.createReadStream).toHaveBeenCalledWith(mockVideoFile.buffer);
      expect(mockReadStream.pipe).toHaveBeenCalledWith(mockUploadStream);
      expect(result).toEqual(mockVideoResponse);
    });

    it('should handle video upload errors', async () => {
      const uploadError = new Error('Video upload failed');
      const mockUploadStream = {
        pipe: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        // Simulate video upload error
        setTimeout(() => callback(uploadError, null), 0);
        return mockUploadStream;
      });

      await expect(service.uploadVideoFile(mockVideoFile)).rejects.toThrow(
        'Video upload failed'
      );

      expect(mockCloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        { resource_type: 'video' },
        expect.any(Function)
      );
    });

    it('should handle no result from video upload', async () => {
      const mockUploadStream = {
        pipe: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        // Simulate no result for video
        setTimeout(() => callback(null, null), 0);
        return mockUploadStream;
      });

      await expect(service.uploadVideoFile(mockVideoFile)).rejects.toThrow(
        'No result returned from Cloudinary'
      );
    });

    it('should set correct resource type for video uploads', async () => {
      const mockUploadStream = {
        pipe: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        expect(options).toEqual({ resource_type: 'video' });
        setTimeout(() => callback(null, mockVideoResponse), 0);
        return mockUploadStream;
      });

      await service.uploadVideoFile(mockVideoFile);

      expect(mockCloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        { resource_type: 'video' },
        expect.any(Function)
      );
    });

    it('should create read stream from video file buffer', async () => {
      const mockUploadStream = {
        pipe: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        setTimeout(() => callback(null, mockVideoResponse), 0);
        return mockUploadStream;
      });

      await service.uploadVideoFile(mockVideoFile);

      expect(mockStreamifier.createReadStream).toHaveBeenCalledWith(mockVideoFile.buffer);
      expect(mockReadStream.pipe).toHaveBeenCalledWith(mockUploadStream);
    });
  });

  describe('error handling', () => {
    it('should properly handle stream errors', async () => {
      const streamError = new Error('Stream error');
      const mockUploadStream = {
        pipe: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((callback) => {
        setTimeout(() => callback(streamError, null), 0);
        return mockUploadStream;
      });

      await expect(service.uploadFile(mockFile)).rejects.toThrow('Stream error');
    });

    it('should handle undefined callback parameters', async () => {
      const mockUploadStream = {
        pipe: jest.fn(),
      };

      mockCloudinary.uploader.upload_stream.mockImplementation((callback) => {
        setTimeout(() => callback(undefined, undefined), 0);
        return mockUploadStream;
      });

      await expect(service.uploadFile(mockFile)).rejects.toThrow(
        'No result returned from Cloudinary'
      );
    });
  });
});