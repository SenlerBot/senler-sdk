# Senler SDK
![Tests workflow](https://github.com/SenlerBot/senler-sdk/actions/workflows/test.yml/badge.svg)
![Build status](https://github.com/SenlerBot/senler-sdk/actions/workflows/publish.yml/badge.svg)
[![npm version](https://img.shields.io/npm/v/senler-sdk.svg?style=flat-square)](https://www.npmjs.org/package/senler-sdk)
[![npm downloads](https://img.shields.io/npm/dm/senler-sdk.svg?style=flat-square)](https://npm-stat.com/charts.html?package=senler-sdk)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=senler-sdk&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.now.sh/result?p=senler-sdk)

*[English version](./README.en.md)*

## Описание
`Senler SDK` — это официальная TypeScript библиотека для удобного взаимодействия с [API Senler](https://help.senler.ru/senler/dev/api). Она предоставляет модульную структуру для работы с различными ресурсами Senler: подписчиками, рассылками, ботами, UTM метками и другими.

## Установка

### npm

```bash
npm install senler-sdk
```

## Примеры использования

### Инициализация API клиента

Для работы с API вам потребуются `access_token` и `vk_group_id` вашего сообщества ВКонтакте.

```typescript
import { SenlerApiClientV2 } from "senler-sdk"

const client = new SenlerApiClientV2({
  apiConfig: {
    accessToken: "YOUR_ACCESS_TOKEN",
    vkGroupId: YOUR_VK_GROUP_ID,
  }
})
```

### Получение подписчиков

```typescript
client.subscribers.get().then((res) => console.log(res))
```

## Интеграция с passport

### Установка

```bash
npm i passport passport-senler
```

### Использование API клиента с полученным access token

```typescript
import express from 'express';
import passport from 'passport';
import { SenlerStrategy } from 'passport-senler';

passport.use(
  new SenlerStrategy({
    clientID: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    callbackURL: 'https://yourapp.com/auth/senler/callback',
  })
);

const app = express();

app.get('/auth/senler', passport.authenticate('senler'));

app.get(
  '/auth/senler/callback',
  passport.authenticate('senler', {
    failureRedirect: '/auth/senler/error',
    session: false, // Отключаем сессии (senler их не использует)
  }),

  async (req, res) => {
    const client = new SenlerApiClientV2({
      apiConfig: {
        accessToken: req.accessToken,
        vkGroupId: YOUR_VK_GROUP_ID,
      }
    })

    res.json(await client.subscribers.get())
  }
);

app.listen(3000, () => {
  console.log('Сервер запущен на порту: 3000');
});
```

## Обработка ошибок

Для корректной обработки ошибок используйте блоки `try-catch` или методы `.catch()`.

```typescript
const client = new SenlerApiClientV2({
  apiConfig: {
    accessToken: "YOUR_TOKEN",
    vkGroupId: YOUR_VK_GROUP_ID,
  }
})

const app = express();

app.get('/get', async (_req, res) => {
  try {
    res.json(await client.subscribers.get())
  }
  catch (error: any) {
    res.send(error.message)
  }
});
```

Ошибки, реализованные через `success`, `error_code` и `error_message` ([документация](https://help.senler.ru/senler/dev/api/vozvrashaemye-oshibki)) преобразуются и выбрасываются как ApiError с соответствующим сообщением.

## Логирование

Логирование основано на [pino](https://www.npmjs.com/package/pino), вы можете переопределить [конфигурацию по умолчанию](src/v2/configs.ts).

### Пример:
```typescript
const loggingConfig = {
  level: 'info',
  destination: pino.destination("./log.log"),
  base: { pid: false },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      indent: 4
    }
  }
}
const client = new SenlerApiClientV2({
  apiConfig,
  loggingConfig,
  retryConfig,
  cacheConfig
});
```

## Повторные попытки

Повторные попытки основаны на [axios-retry](https://www.npmjs.com/package/axios-retry), вы можете переопределить [конфигурацию по умолчанию](src/v2/configs.ts).

### Пример:
```typescript
const retryConfig = {
  retries: 3,
  retryDelay(retryCount, error): number {
    return axiosRetry.exponentialDelay(retryCount, error, 100);
  }
}
const client = new SenlerApiClientV2({
  apiConfig,
  loggingConfig,
  retryConfig,
  cacheConfig
});
```

## Кеширование

Кеширование основано на [cache-manager](https://www.npmjs.com/package/cache-manager):

```typescript
const cacheConfig = {
  enabled: true,
  manager: createCache({ ttl: 10_000 })
}
const client = new SenlerApiClientV2({
  apiConfig,
  loggingConfig,
  retryConfig,
  cacheConfig
});
```

Вы также можете указать индивидуальную конфигурацию кеша для любых запросов:
```typescript
await client.subscribers.get({count: 30}, cacheConfig)
```

## Поддержка TypeScript

Библиотека написана на TypeScript и экспортирует все необходимые типы для комфортной разработки.

### Доступные типы

Библиотека экспортирует следующие категории типов:

- **Основные классы**: `SenlerApiClientV2`, `ApiClientConfig`
- **Конфигурационные типы**: `ApiConfig`, `LoggingConfig`, `RetryConfig`, `CacheConfig`, `RequestCacheConfig`
- **Типы ошибок**: `ApiError`
- **Типы для API ресурсов**:
  - Подписчики: `GetSubscribersRequest`, `GetSubscribersResponse`, `AddSubscribersInGroupRequest`, и др.
  - Боты: `GetBotsListRequest`, `GetBotsListResponse`, `BotInfo`, `Step`, `StepType`, и др.
  - UTM метки: `AddUtmRequest`, `AddUtmResponse`, `UtmTag`, и др.
  - Рассылки: `GetDeliveriesRequest`, `GetDeliveriesResponse`, `Delivery`, `DeliveryStatus`, и др.
  - Переменные: `SetVarRequest`, `GetVarRequest`, `Var`, `GlobalVar`, и др.

### Пример использования с типами

```typescript
import { 
  SenlerApiClientV2, 
  ApiClientConfig,
  GetSubscribersRequest,
  GetSubscribersResponse,
  ApiError 
} from 'senler-sdk';

const config: ApiClientConfig = {
  accessToken: 'your_token',
  vkGroupId: 12345
};

const client = new SenlerApiClientV2({ apiConfig: config });

const params: GetSubscribersRequest = {
  count: 50,
  offset: 0
};

try {
  const result: GetSubscribersResponse = await client.subscribers.get(params);
  console.log('Подписчики:', result.items);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API ошибка:', error.errorCode, error.message);
  }
}
```

Полный список типов и примеры использования смотрите в файле [TYPES_USAGE_EXAMPLE.md](./TYPES_USAGE_EXAMPLE.md).

## Требования

- Node.js >= 16.0.0
- TypeScript >= 4.0.0 (опционально)

## Лицензия

Этот проект лицензирован под лицензией MIT. Подробности смотрите в файле [LICENSE](./LICENSE).

## Поддержка

- [Документация API](https://help.senler.ru/senler/dev/api)
- [GitHub Issues](https://github.com/SenlerBot/senler-sdk/issues)
- Email: support@senler.ru
