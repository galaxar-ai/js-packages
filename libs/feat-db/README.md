# @galaxar/feat-db

Datasource features set

## Features

-   prisma

## Prisma

### Config

```json
{
    "prisma": { modelPath, datasources, log }
}
```

### Usage

```js
const prisma = app.getService('prisma');
```

### Helpers

-   $pushQuery - Returns a new where with specified condition merged into where, will merge same keys into an AND array

-   $pushOrQuery - Returns a new where with specified condition merged into where, will merge same keys into an OR array

-   $model - Returns a business logic model from modelPath

```js
//<modulePath>\User.js
class User {
    constructor(prisma) {
        this.model = prisma.user;
    }

    async upsert_(input) {
        const { email, ...others } = input;

        return this.model.upsert({
            where: { email },
            create: input,
            update: others,
        });
    }
}

export default User;
```
Usage
```js
const prisma = app.getService('prisma');
const User = prisma.$model('user');

await User.upsert_({
    email: 'test999@email.com',
    name: 'test999',                
});
```

-   $setupCache(this, entries) - Setup cache (list or map)
    -   $setupCache should be called in the Model's constructor after model is assigned
    -   entries is a map of cache key to { where, type, [mapByKey] } 
    -   Model with $setupCache has the following two methods:
        -   async cache_(key) - fetch data from cache by key, run query if cache missed
        -   resetCache(key)
```js
//<modulePath>\User.js
class User {
    constructor(prisma) {
        this.model = prisma.user;
        prisma.$setupCache(this, {
            'list': { where: {}, type: 'list' },
            'map': { where: {}, type: 'map', mapByKey: 'email' },
        });
    }
}

export default User;
```
Usage
```js
const prisma = app.getService('prisma');
const User = prisma.$model('UserWithCache');

const map = await User.cache_('map');
const list = await User.cache_('list');
```