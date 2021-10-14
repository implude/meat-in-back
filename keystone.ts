/*
Welcome to Keystone! This file is what keystone uses to start the app.

It looks at the default export, and expects a Keystone config object.

You can find all the config options in our docs here: https://keystonejs.com/docs/apis/config
*/

import { config } from '@keystone-next/keystone';

// Look in the schema file for how we define our lists, and how users interact with them through graphql or the Admin UI
import { lists } from './schema';

// Keystone auth is configured separately - check out the basic auth setup we are importing from our auth file.
import { withAuth, session } from './auth';
import { getCuratedPost, getSpecificPost } from './api/post';

export default withAuth(
  // Using the config function helps typescript guide you to the available options.
  config({
    // the db sets the database provider - we're using sqlite for the fastest startup experience
    db: {
      provider: 'sqlite',
      url: 'file:./keystone.db',
      enableLogging: true
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    session,
    server: {
      extendExpressApp(app, createContext) {
        app.use('/api', async (req, res, next) => {
          (req as any).context = await createContext(req, res);
          next();
        });

        app.get('/api/post/curated', getCuratedPost);
        app.get('/api/post/:id', getSpecificPost);
      }
    }
  })
);

