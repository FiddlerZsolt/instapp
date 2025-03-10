import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  const page = parseInt(c.req.query('page') || '1', 10);
  c.header('X-Message', 'Hi!');
  return c.text(`You want to see ${page}`);
});

app.get('/:id', (c) => {
  const id = c.req.param('id');
  c.header('X-Message', 'Hi!');
  return c.text(`You want to see ${id}`);
});

app.post('/', (c) => c.text('Created!', 201));

app.delete('/:id', (c) => c.text(`${c.req.param('id')} is deleted!`));

export default app;
