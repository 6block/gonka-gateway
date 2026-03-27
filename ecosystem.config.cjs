module.exports = {
  apps: [
    {
      name: 'gonka-gateway',
      port: '3001',
      script: './.output/server/index.mjs',
      max_memory_restart: '300M'
    }
  ]
}
