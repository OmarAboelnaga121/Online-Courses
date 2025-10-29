import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

// Mock Redis client
const mockRedisClient = {
  connect: jest.fn(),
  quit: jest.fn(),
  on: jest.fn(),
  set: jest.fn(),
  setEx: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  flushAll: jest.fn(),
  keys: jest.fn(),
};

jest.mock('redis', () => ({
  createClient: jest.fn(() => mockRedisClient),
}));

describe('RedisService', () => {
  let service: RedisService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create Redis client with default URL if not provided', () => {
      mockConfigService.get.mockReturnValue(null);

      new RedisService(configService);

      expect(createClient).toHaveBeenCalledWith({
        url: 'redis://localhost:6379',
      });
    });

    it('should create Redis client with provided URL', () => {
      mockConfigService.get.mockReturnValue('redis://custom:6380');

      new RedisService(configService);

      expect(createClient).toHaveBeenCalledWith({
        url: 'redis://custom:6380',
      });
    });

    it('should set up error handler', () => {
      new RedisService(configService);

      expect(mockRedisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
    });
  });

  describe('onModuleInit', () => {
    it('should connect to Redis client', async () => {
      mockRedisClient.connect.mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(mockRedisClient.connect).toHaveBeenCalled();
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      mockRedisClient.connect.mockRejectedValue(error);

      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
    });
  });

  describe('onModuleDestroy', () => {
    it('should quit Redis client', async () => {
      mockRedisClient.quit.mockResolvedValue(undefined);

      await service.onModuleDestroy();

      expect(mockRedisClient.quit).toHaveBeenCalled();
    });

    it('should handle quit errors', async () => {
      const error = new Error('Quit failed');
      mockRedisClient.quit.mockRejectedValue(error);

      await expect(service.onModuleDestroy()).rejects.toThrow('Quit failed');
    });
  });

  describe('set', () => {
    const key = 'test-key';
    const value = 'test-value';

    it('should set value without TTL', async () => {
      mockRedisClient.set.mockResolvedValue('OK');

      await service.set(key, value);

      expect(mockRedisClient.set).toHaveBeenCalledWith(key, value);
      expect(mockRedisClient.setEx).not.toHaveBeenCalled();
    });

    it('should set value with TTL', async () => {
      const ttl = 300;
      mockRedisClient.setEx.mockResolvedValue('OK');

      await service.set(key, value, ttl);

      expect(mockRedisClient.setEx).toHaveBeenCalledWith(key, ttl, value);
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });

    it('should handle set errors', async () => {
      const error = new Error('Set failed');
      mockRedisClient.set.mockRejectedValue(error);

      await expect(service.set(key, value)).rejects.toThrow('Set failed');
    });
  });

  describe('get', () => {
    const key = 'test-key';

    it('should get value successfully', async () => {
      const expectedValue = 'test-value';
      mockRedisClient.get.mockResolvedValue(expectedValue);

      const result = await service.get(key);

      expect(mockRedisClient.get).toHaveBeenCalledWith(key);
      expect(result).toBe(expectedValue);
    });

    it('should return null for non-existent key', async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await service.get(key);

      expect(result).toBeNull();
    });

    it('should handle get errors', async () => {
      const error = new Error('Get failed');
      mockRedisClient.get.mockRejectedValue(error);

      await expect(service.get(key)).rejects.toThrow('Get failed');
    });
  });

  describe('del', () => {
    const key = 'test-key';

    it('should delete key successfully', async () => {
      mockRedisClient.del.mockResolvedValue(1);

      const result = await service.del(key);

      expect(mockRedisClient.del).toHaveBeenCalledWith(key);
      expect(result).toBe(1);
    });

    it('should return 0 for non-existent key', async () => {
      mockRedisClient.del.mockResolvedValue(0);

      const result = await service.del(key);

      expect(result).toBe(0);
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed');
      mockRedisClient.del.mockRejectedValue(error);

      await expect(service.del(key)).rejects.toThrow('Delete failed');
    });
  });

  describe('flushAll', () => {
    it('should flush all keys successfully', async () => {
      mockRedisClient.flushAll.mockResolvedValue('OK');

      const result = await service.flushAll();

      expect(mockRedisClient.flushAll).toHaveBeenCalled();
      expect(result).toBe('OK');
    });

    it('should handle flush errors', async () => {
      const error = new Error('Flush failed');
      mockRedisClient.flushAll.mockRejectedValue(error);

      await expect(service.flushAll()).rejects.toThrow('Flush failed');
    });
  });

  describe('delByPattern', () => {
    const pattern = 'test:*';

    it('should delete keys by pattern successfully', async () => {
      const matchingKeys = ['test:key1', 'test:key2', 'test:key3'];
      mockRedisClient.keys.mockResolvedValue(matchingKeys);
      mockRedisClient.del.mockResolvedValue(3);

      const result = await service.delByPattern(pattern);

      expect(mockRedisClient.keys).toHaveBeenCalledWith(pattern);
      expect(mockRedisClient.del).toHaveBeenCalledWith(matchingKeys);
      expect(result).toBe(3);
    });

    it('should return 0 when no keys match pattern', async () => {
      mockRedisClient.keys.mockResolvedValue([]);

      const result = await service.delByPattern(pattern);

      expect(mockRedisClient.keys).toHaveBeenCalledWith(pattern);
      expect(mockRedisClient.del).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it('should handle pattern deletion errors', async () => {
      const error = new Error('Pattern delete failed');
      mockRedisClient.keys.mockRejectedValue(error);

      await expect(service.delByPattern(pattern)).rejects.toThrow('Pattern delete failed');
    });

    it('should handle del errors after finding keys', async () => {
      const matchingKeys = ['test:key1'];
      const error = new Error('Del failed');
      mockRedisClient.keys.mockResolvedValue(matchingKeys);
      mockRedisClient.del.mockRejectedValue(error);

      await expect(service.delByPattern(pattern)).rejects.toThrow('Del failed');
    });
  });

  describe('error handling', () => {
    it('should log Redis client errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Redis connection error');

      new RedisService(configService);

      // Simulate error event
      const errorHandler = mockRedisClient.on.mock.calls.find(call => call[0] === 'error')[1];
      errorHandler(error);

      expect(consoleSpy).toHaveBeenCalledWith('Redis Client Error:', error);
      consoleSpy.mockRestore();
    });
  });
});