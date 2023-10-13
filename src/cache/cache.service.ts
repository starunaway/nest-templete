import { Inject, Injectable } from '@nestjs/common';
import { CreateCacheDto } from './dto/create-cache.dto';
import { UpdateCacheDto } from './dto/update-cache.dto';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private redisClient: RedisClientType) {}

  //获取值
  async get(key) {
    let value = await this.redisClient.get(key);
    try {
      value = JSON.parse(value);
    } catch (error) {}
    return value;
  }

  /**
   * 设置值
   * @param key {string} key
   * @param value 值
   * @param second 过期时间 秒
   * @returns Promise<any>
   */
  async set(key: string, value: any, second?: number) {
    value = JSON.stringify(value);
    return await this.redisClient.set(key, value, { EX: second });
  }

  /**
   * Deletes a value from the Redis cache.
   * @param key - The key of the value to delete.
   * @returns A Promise that resolves to the number of keys deleted.
   */
  async del(key: string): Promise<number> {
    // Delete the value from the Redis cache
    return await this.redisClient.del(key);
  }
  //清除缓存
  async flushall() {
    return await this.redisClient.flushAll();
  }
}
