import { config } from '@keystone-next/keystone';
import { Request, Response, json as bodyParser } from 'express';
import { lists } from './schema';
import { withAuth, session } from './auth';
import { postRouter } from './src/Post/route';
import { recipeRouter } from './src/recipe/route';

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: 'postgres://implude:implude@localhost:5432/keystone',
      enableLogging: true,
      useMigrations: true,
      idField: { kind: 'uuid' },
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    session,
    server: {
      cors: {},
      port: process.env.NODE_ENV === 'production' ? 3000 : 1037,
      extendExpressApp(app, createContext) {
        app.use(bodyParser())
        app.use('/api', async (req, res, next) => {
          (req as any).context = await createContext(req, res);
          next();
        });

        app.use('/api/post', postRouter)
        app.use('/api/recipe', recipeRouter)
        app.use((err: Error, req: Request, res: Response, next: unknown) => {
          console.error(err.stack);
          res.status(500).send('조땠대요');
        });
      }
    }
  })
);
