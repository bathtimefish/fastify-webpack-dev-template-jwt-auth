# Fastiy Webpack dev template with JWT & Google auth

This is an [fastify developer's template](https://github.com/bathtimefish/fastify-webpack-dev-template) that adding authorization process with [fastify-jwt](https://github.com/fastify/fastify-jwt). The API request can be authorized with JWT on builded web server.

This branch can be authorized user account and generated JWT by google auhorization.

## How to use

```
git clone -b google-auth https://github.com/bathtimefish/fastify-webpack-dev-template-jwt-auth
cd fastify-webpack-dev-template-jwt-auth
npm i
```

## Export Env values

Export environment  values like below after setuped google oauth authorization.

```
export GOOGLE_AUTH_CLIENT_ID=[GOOGLE AUTH CLIENT ID]
export GOOGLE_AUTH_SECRET=[GOOGLE AUTH SECRET]
export GOOGLE_AUTH_CALLBACK_URL=http://localhost:8080/auth/google/callback
export APPSERVER_AUTH_SECRET=supersecret
export APPSERVER_AUTH_EXPIRED_IN=1day
export APPSERVER_PORT=8080
export UI_AUTH_URL=http://localhost:8080/#/auth
```

And you can write server application logic on `src/server.ts` and write routers under `src/router/`.

## Build

```
npm run build
```

## Start app server

```
npm start
```

## Test

```
npm test
```

## Getting Started

You can see the login UI of google when you access `/auth/google` with web browser.

[http://localhost:8080/auth/google](http://localhost:8080/auth/google)

After logined, You can get access token as query parameter on callback url like below.

```
http://localhost:8080/#/auth?t=[token]
```

You can request other APIs with authorization header including token.

```
curl -XGET -H 'Authorization: Bearer [token]' http://localhost:8080/users | jq .

[
  {
    "id": 1,
    "name": "Elvis Carlson",
    "address": "1508 Allison Avenue",
    "birthday": "09/04/95",
    "sex": "man"
  },
  {
    "id": 2,
    "name": "Primrose Delarosa",
    "address": "1465 Edwards Street",
    "birthday": "08/12/01",
    "sex": "woman"
  },
  {
    "id": 3,
    "name": "Elise Lindsay",
    "address": "1682 Peaceful Lane",
    "birthday": "02/06/85",
    "sex": "woman"
  }
]

```

You can get authorized user informaion like this.

```
curl -XGET -H 'Authorization: Bearer [token]' http://localhost:8080/auth/session | jq .

{
  "name": "bathtimefish",
  "email": "bathtimefish@example.com",
  "iat": 1616303363
}
```

And you will get authorization error like as bellow if you request with invalid token.

```
{
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "No Authorization was found in request.headers"
}
```