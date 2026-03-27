module.exports = {
  apps: [
    {
      name: 'nuxt-app',
      script: './.output/server/index.mjs',
      instances: 'max',        // 或 '1'，根据服务器 CPU 决定
      exec_mode: 'cluster',    // 集群模式，提升性能
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOST: '0.0.0.0'
      },
      // 可选：自动重启、日志等
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};