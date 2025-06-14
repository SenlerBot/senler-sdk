# Senler SDK
[![npm version](https://img.shields.io/npm/v/senler-sdk.svg?style=flat-square)](https://www.npmjs.org/package/senler-sdk)
[![npm downloads](https://img.shields.io/npm/dm/senler-sdk.svg?style=flat-square)](https://npm-stat.com/charts.html?package=senler-sdk)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=senler-sdk&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.now.sh/result?p=senler-sdk)

*[Русская версия](./README.md)*

## Description
`Senler SDK` is an official TypeScript library for easy interaction with the [Senler API](https://help.senler.ru/senler/dev/api). It provides a modular structure for working with various Senler resources: subscribers, mailings, bots, UTM tags, and others.

## Installation

### npm

```bash
npm install senler-sdk
```

## Usage Examples

### Initializing the API Client

To work with the API, you will need the `access_token` and `vk_group_id` of your VKontakte community.

```typescript
import { SenlerApiClientV2 } from "senler-sdk"

const client = new SenlerApiClientV2({
  apiConfig: {
    accessToken: "YOUR_ACCESS_TOKEN",
    vkGroupId: YOUR_VK_GROUP_ID,
  }
})
```

### Get Subscribers

```typescript
client.subscribers.get().then((res) => console.log(res))
```

## Integration with Passport

### Installation

```bash
npm i passport passport-senler
```

### Using API Client with Received Access Token

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
    session: false, // Disable session (senler does not use it)
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
  console.log('Server is starting on port: 3000');
});
```

## Error Handling

To handle errors correctly, use `try-catch` blocks or `.catch()` methods.

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

Errors implemented via `success`, `error_code` and `error_message` ([docs](https://help.senler.ru/senler/dev/api/vozvrashaemye-oshibki)) are converted and thrown as ApiError with the corresponding message.

## Logging

Logging is based on [pino](https://www.npmjs.com/package/pino), you can override the [default configuration](src/v2/configs.ts).

### Example:
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

## Retrying

Retrying is based on [axios-retry](https://www.npmjs.com/package/axios-retry), you can override the [default configuration](src/v2/configs.ts).

### Example:
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

## Caching

Caching is based on [cache-manager](https://www.npmjs.com/package/cache-manager):

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

You can also provide custom cache config for any requests:
```typescript
await client.subscribers.get({count: 30}, cacheConfig)
```

## TypeScript Support

The library is written in TypeScript and exports all necessary types for comfortable development.

### Available API Methods

The library provides the following methods for working with the API:

#### 👥 **Working with subscribers** (`client.subscribers`)
- **`get()`** - Get list of subscribers  
  *Types*: `GetSubscribersRequest`, `GetSubscribersResponse`
- **`count()`** - Get subscribers count  
  *Returns*: `number`
- **`addInGroup()`** - Add subscriber to group  
  *Types*: `AddSubscribersInGroupRequest`, `AddSubscribersInGroupResponse`
- **`delFromGroup()`** - Remove subscriber from group  
  *Types*: `DelSubscriberFromSubscriptionGroupRequest`, `DelSubscriberFromSubscriptionGroupResponse`
- **`getSubscriptionsStatistics()`** - Subscription statistics  
  *Types*: `GetSubscriptionsStatisticsRequest`, `GetSubscriptionsStatisticsResponse`
- **`getSubscriptionsCountStatistics()`** - Subscription count statistics  
  *Types*: `GetSubscriptionsCountStatisticsRequest`, `GetSubscriptionsCountStatisticsResponse`

#### 🤖 **Working with bots** (`client.bots`)
- **`get()`** - Get list of bots  
  *Types*: `GetBotsListRequest`, `GetBotsListResponse`, `BotInfo`
- **`getSteps()`** - Get bot steps  
  *Types*: `GetStepsRequest`, `GetStepsResponse`, `Step`, `StepType`
- **`addSubscriber()`** - Add subscriber to bot  
  *Types*: `AddSubscriberRequest`, `AddSubscriberResponse`
- **`delSubscriber()`** - Remove subscriber from bot  
  *Types*: `DelSubscriberRequest`, `DelSubscriberResponse`

#### 🏷️ **Working with UTM tags** (`client.utms`)
- **`add()`** - Create UTM tag  
  *Types*: `AddUtmRequest`, `AddUtmResponse`
- **`edit()`** - Edit UTM tag  
  *Types*: `EditUtmRequest`, `EditUtmResponse`
- **`del()`** - Delete UTM tag  
  *Types*: `DeleteUtmRequest`, `DeleteUtmResponse`
- **`get()`** - Get list of UTM tags  
  *Types*: `GetUtmRequest`, `GetUtmResponse`, `UtmTag`
- **`getLink()`** - Get link for UTM tag  
  *Types*: `GetLinkUtmRequest`, `GetLinkUtmResponse`
- **`getSubscriptionsCountStatistics()`** - UTM tags statistics  
  *Types*: `GetUtmSubscriptionsCountStatisticsRequest`, `GetUtmSubscriptionsCountStatisticsResponse`
- **`getSubscriptionsStatistics()`** - Subscribers with UTM tags  
  *Types*: `GetUtmSubscriptionsStatisticsRequest`, `SubscriptionsStatisticsResponse`

#### 📬 **Working with mailings** (`client.deliveries`)
- **`get()`** - Get list of mailings  
  *Types*: `GetDeliveriesRequest`, `GetDeliveriesResponse`, `Delivery`, `DeliveryStatus`, `DeliveryType`
- **`getSubscriptionsStatistics()`** - Delivery statistics with recipient info  
  *Types*: `GetRecipientStatisticsRequest`, `RecipientStatisticsResponse`
- **`getSubscriptionsCountStatistics()`** - Delivery count statistics  
  *Types*: `GetDeliveryCountStatisticsRequest`, `DeliveryCountStatisticsResponse`

#### 🔧 **Working with user variables** (`client.vars`)
- **`get()`** - Get user variable  
  *Types*: `GetVarRequest`, `GetVarResponse`, `Var`
- **`set()`** - Set user variable  
  *Types*: `SetVarRequest`, `SetVarResponse`
- **`del()`** - Delete user variable  
  *Types*: `DeleteVarRequest`, `DeleteVarResponse`

#### 🌐 **Working with global variables** (`client.globalVars`)
- **`get()`** - Get global variable  
  *Types*: `GetGlobalVarRequest`, `GetGlobalVarResponse`, `GlobalVar`
- **`set()`** - Set global variable  
  *Types*: `SetGlobalVarRequest`, `SetGlobalVarResponse`
- **`del()`** - Delete global variable  
  *Types*: `DeleteGlobalVarRequest`, `DeleteGlobalVarResponse`

#### ⚙️ **Additional types**
- **Main classes**: `SenlerApiClientV2`, `ApiClientConfig`
- **Configuration types**: `ApiConfig`, `LoggingConfig`, `RetryConfig`, `CacheConfig`, `RequestCacheConfig`
- **Error types**: `ApiError`

### Examples of using methods with types

```typescript
import { 
  SenlerApiClientV2, 
  ApiClientConfig,
  GetSubscribersRequest,
  GetSubscribersResponse,
  AddUtmRequest,
  AddUtmResponse,
  GetBotsListResponse,
  SetVarRequest,
  ApiError 
} from 'senler-sdk';

const config: ApiClientConfig = {
  accessToken: 'your_token',
  vkGroupId: 12345
};

const client = new SenlerApiClientV2({ apiConfig: config });

// Working with subscribers
const subscribersParams: GetSubscribersRequest = {
  count: 50,
  offset: 0
};

const subscribers: GetSubscribersResponse = await client.subscribers.get(subscribersParams);
const subscribersCount = await client.subscribers.count();

// Working with UTM tags
const utmParams: AddUtmRequest = {
  name: 'summer_campaign',
  comment: 'Summer advertising campaign'
};

const newUtm: AddUtmResponse = await client.utms.add(utmParams);

// Working with bots
const bots: GetBotsListResponse = await client.bots.get();

// Working with variables
const varParams: SetVarRequest = {
  subscriber_id: 12345,
  var_name: 'user_name',
  var_value: 'John Doe'
};

await client.vars.set(varParams);

// Error handling
try {
  const result = await client.subscribers.get({ count: 10 });
  console.log('Subscribers:', result.items);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API error:', error.errorCode, error.message);
  }
}
```

For a complete list of types and usage examples, see [TYPES_USAGE_EXAMPLE.md](./TYPES_USAGE_EXAMPLE.md).

## Requirements

- Node.js >= 16.0.0
- TypeScript >= 4.0.0 (optional)

## License

This project is licensed under the MIT license. See [LICENSE](./LICENSE) for details.

## Support

- [API Documentation](https://help.senler.ru/senler/dev/api)
- [GitHub Issues](https://github.com/SenlerBot/senler-sdk/issues)
- Email: support@senler.ru 