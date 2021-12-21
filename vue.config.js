module.exports = {
    devServer: {
        proxy: {
            '/api/': {
                // target: 'http://localhost:8888',
                target: 'http://138.197.5.8:8888',
                ws: true,   
                changeOrigin: true,
            },
        },
    },

    transpileDependencies: [
      'vuetify'
    ]
}