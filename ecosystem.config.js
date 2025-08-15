/**
 * @description pm2 configuration file.
 * @example
 *  production mode :: pm2 start ecosystem.config.js --only api-showcase-prod
 *  development mode :: pm2 start ecosystem.config.js --only api-showcase-dev
 */

module.exports = {
  apps: [
    {
      name: 'api-showcase-prod', // pm2 start App name
      script: 'dist/src/server.js',
      exec_mode: 'cluster', // 'cluster' or 'fork'
      instance_var: 'INSTANCE_ID', // instance variable
      instances: 2, // pm2 instance count
      autorestart: true, // auto restart if process crash
      watch: false, // files change automatic restart
      ignore_watch: ['node_modules', 'src/utils/logs', 'logs'], // ignore files change
      max_memory_restart: '1G', // restart if process use more than 1G memory
      merge_logs: true, // if true, stdout and stderr will be merged and sent to pm2 log
      output: './src/utils/logs/access.log', // pm2 log file
      error: './src/utils/logs/error.log', // pm2 error log file
      env: {
        // environment variable
        PORT: 3009,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'api-showcase-dev', // pm2 start App name
      script: 'npx', // ts-node
      args: 'ts-node -r tsconfig-paths/register --transpile-only src/server.ts', // ts-node args
      exec_mode: 'cluster', // 'cluster' or 'fork'
      instance_var: 'INSTANCE_ID', // instance variable
      instances: 1, // pm2 instance count
      autorestart: true, // auto restart if process crash
      watch: false, // files change automatic restart
      ignore_watch: ['node_modules', 'src/utils/logs', 'logs'], // ignore files change
      max_memory_restart: '1G', // restart if process use more than 1G memory
      merge_logs: true, // if true, stdout and stderr will be merged and sent to pm2 log
      output: './src/utils/logs/access.log', // pm2 log file
      error: './src/utils/logs/error.log', // pm2 error log file
      env: {
        // environment variable
        PORT: 3009,
        NODE_ENV: 'development',
      },
    },
  ],
  deploy: {
    production: {
      user: 'user',
      host: '0.0.0.0',
      ref: 'origin/main',
      repo: 'git@github.com:repo.git',
      path: 'dist/src/server.js',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --only prod',
    },
  },
};
