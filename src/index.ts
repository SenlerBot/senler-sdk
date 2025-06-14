export { ApiClientConfig, SenlerApiClientV2 } from './v2/client';

// Все типы данных (DTO, запросы, ответы)
export * from './v2/types';

// Конфигурационные типы
export { ApiConfig, LoggingConfig, CustomAxiosRequestConfig } from './v2/core/http-client/client.dto';
export { RetryConfig } from './v2/core/http-client/client.config';
export { CacheConfig, RequestCacheConfig, CacheManager } from './v2/core/http-client/cache/cache.dto';

// Типы ошибок
export { ApiError } from './v2/core/errors';
