# Примеры использования типов

Этот файл содержит примеры использования всех экспортированных типов библиотеки `senler-sdk`.

## Основные классы и конфигурация

```typescript
import { 
  SenlerApiClientV2, 
  ApiClientConfig, 
  LoggingConfig, 
  RetryConfig, 
  CacheConfig,
  ApiError 
} from 'senler-sdk';
import { createCache } from 'cache-manager';

// Базовая конфигурация API
const apiConfig: ApiClientConfig = {
  accessToken: 'your_access_token',
  vkGroupId: 12345,
  apiVersion: 'v2', // необязательно
  baseUrl: 'https://api.senler.ru/' // необязательно
};

// Конфигурация логирования
const loggingConfig: LoggingConfig = {
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
};

// Конфигурация повторных попыток
const retryConfig: RetryConfig = {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000
};

// Конфигурация кеширования
const cacheConfig: CacheConfig = {
  enabled: true,
  manager: createCache({ ttl: 10000 })
};

// Создание клиента
const client = new SenlerApiClientV2({
  apiConfig,
  loggingConfig,
  retryConfig,
  cacheConfig
});
```

## Типы для работы с подписчиками

```typescript
import { 
  GetSubscribersRequest,
  GetSubscribersResponse,
  AddSubscribersInGroupRequest,
  AddSubscribersInGroupResponse,
  GetSubscriptionsStatisticsRequest,
  GetSubscriptionsStatisticsResponse 
} from 'senler-sdk';

// Получение подписчиков
const getSubscribersParams: GetSubscribersRequest = {
  count: 50,
  offset: 0
};

try {
  const subscribers: GetSubscribersResponse = await client.subscribers.get(getSubscribersParams);
  console.log('Подписчики:', subscribers.items);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API ошибка:', error.errorCode, error.message);
  }
}

// Добавление подписчиков в группу
const addToGroupParams: AddSubscribersInGroupRequest = {
  group_id: 123,
  subscribers: [456, 789]
};

const result: AddSubscribersInGroupResponse = await client.subscribers.add(addToGroupParams);
```

## Типы для работы с ботами

```typescript
import { 
  GetBotsListRequest,
  GetBotsListResponse,
  BotInfo,
  GetStepsRequest,
  GetStepsResponse,
  Step,
  StepType 
} from 'senler-sdk';

// Получение списка ботов
const getBotsParams: GetBotsListRequest = {
  count: 10
};

const bots: GetBotsListResponse = await client.bots.get(getBotsParams);

// Работа с информацией о боте
bots.items?.forEach((bot: BotInfo) => {
  console.log(`Бот: ${bot.name}, ID: ${bot.id}`);
});

// Получение шагов бота
const getStepsParams: GetStepsRequest = {
  bot_id: 123
};

const steps: GetStepsResponse = await client.bots.getSteps(getStepsParams);

// Обработка шагов
steps.items?.forEach((step: Step) => {
  console.log(`Шаг: ${step.name}, Тип: ${step.type}`);
});
```

## Типы для работы с UTM метками

```typescript
import { 
  AddUtmRequest,
  AddUtmResponse,
  GetUtmRequest,
  GetUtmResponse,
  UtmTag,
  EditUtmRequest,
  DeleteUtmRequest 
} from 'senler-sdk';

// Создание UTM метки
const addUtmParams: AddUtmRequest = {
  name: 'test_utm',
  comment: 'Тестовая UTM метка'
};

const newUtm: AddUtmResponse = await client.utms.add(addUtmParams);

// Получение UTM меток
const getUtmParams: GetUtmRequest = {
  count: 20
};

const utms: GetUtmResponse = await client.utms.get(getUtmParams);

// Работа с UTM метками
utms.items?.forEach((utm: UtmTag) => {
  console.log(`UTM: ${utm.name}, ID: ${utm.id}`);
});
```

## Типы для работы с рассылками

```typescript
import { 
  GetDeliveriesRequest,
  GetDeliveriesResponse,
  Delivery,
  DeliveryStatus,
  DeliveryType,
  GetRecipientStatisticsRequest,
  RecipientStatisticsResponse 
} from 'senler-sdk';

// Получение рассылок
const getDeliveriesParams: GetDeliveriesRequest = {
  count: 30,
  type: DeliveryType.MASS,
  status: DeliveryStatus.SENT
};

const deliveries: GetDeliveriesResponse = await client.deliveries.get(getDeliveriesParams);

// Обработка рассылок
deliveries.items?.forEach((delivery: Delivery) => {
  console.log(`Рассылка: ${delivery.name}, Статус: ${delivery.status}`);
});

// Получение статистики получателей
const statsParams: GetRecipientStatisticsRequest = {
  delivery_id: 123,
  count: 50
};

const stats: RecipientStatisticsResponse = await client.deliveries.getRecipientStatistics(statsParams);
```

## Типы for работы с переменными

```typescript
import { 
  SetVarRequest,
  SetVarResponse,
  GetVarRequest,
  GetVarResponse,
  Var,
  SetGlobalVarRequest,
  SetGlobalVarResponse,
  GlobalVar 
} from 'senler-sdk';

// Установка переменной пользователя
const setVarParams: SetVarRequest = {
  subscriber_id: 123,
  var_name: 'user_name',
  var_value: 'Иван'
};

const setVarResult: SetVarResponse = await client.vars.set(setVarParams);

// Получение переменной
const getVarParams: GetVarRequest = {
  subscriber_id: 123,
  var_name: 'user_name'
};

const variable: GetVarResponse = await client.vars.get(getVarParams);

// Работа с глобальными переменными
const setGlobalVarParams: SetGlobalVarRequest = {
  var_name: 'global_setting',
  var_value: 'значение'
};

const globalVar: SetGlobalVarResponse = await client.globalVars.set(setGlobalVarParams);
```

## Обработка ошибок

```typescript
import { ApiError } from 'senler-sdk';

try {
  const result = await client.subscribers.get({ count: 10 });
  // обработка успешного результата
} catch (error) {
  if (error instanceof ApiError) {
    console.error('Ошибка API:', {
      code: error.errorCode,
      message: error.message,
      details: error.details
    });
  } else {
    console.error('Неизвестная ошибка:', error);
  }
}
```

## Кеширование запросов

```typescript
import { RequestCacheConfig } from 'senler-sdk';

// Использование кеша для конкретного запроса
const cacheOptions: RequestCacheConfig = {
  enabled: true,
  ttl: 30000 // 30 секунд
};

const cachedResult = await client.subscribers.get(
  { count: 10 }, 
  cacheOptions
);
``` 