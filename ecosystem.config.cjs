module.exports = {
  apps: [
    {
      name: 'gonkarouter',
      port: '3001',
      script: './.output/server/index.mjs',
      max_memory_restart: '300M'
    }
  ]
}
