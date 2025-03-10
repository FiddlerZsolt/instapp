import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { html } from 'hono/html';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { getRouterName, showRoutes } from 'hono/dev';
import { requestId } from 'hono/request-id';

import posts from './api/routes/posts';
import { apiLogger } from './api/logger';

/** APP */
const app = new Hono();
app.use('*', requestId());

// Custom Logger
app.use(logger(apiLogger));

/** PUBLIC */
app.use('/public/*', serveStatic({ root: './' }));
// app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }));
// app.get('/', (c) => c.text('You can access: /static/hello.txt'));
// app.get('*', serveStatic({ path: './static/fallback.txt' }));

/** TEXT */
app.get('/', (c) => {
  return c.text('Hello Hono!');
});

/** JSON API */
app.use(
  '/api/*',
  cors({
    origin: '*' /** 'http://example.com' */,
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
);

app.get('/api/hello', (c) => {
  apiLogger('/api/hello', `Path: ,`, `ID:`);
  apiLogger(`Your request id is ${c.get('requestId')}`);
  return c.json({
    ok: true,
    message: 'Hello Hono!',
  });
});

app.route('/api/posts', posts);

/** HTML */
app.get('/:username', (c) => {
  const { username } = c.req.param();
  return c.html(
    html`<!DOCTYPE html>
      <h1>Hello! ${username}!</h1>`
  );
});

/** DEV */
console.log(getRouterName(app));
showRoutes(app);

export default {
  port: 3000,
  fetch: app.fetch,
};
