export default {
    // keys for encript
    jwtSecret: process.env.JWT_SECRET || '26e84f92066bb21f5690ee602160a53dd0e515ef80af9e3dc1f9b9f50993a53f',
    jwtRefresh: process.env.JWT_SECRET || '1e81e9e9fc28a531933b5f421132ab1cb61b55c25c8cc1937504dc4ed29fed0b',
    // config for database
    DB: {
        HOST: process.env.MSQL_HOST || 'localhost',
        USER: process.env.MSQL_USER || 'sofia',
        PASSWORD: process.env.PASSWORD || 'Sofia2021*',
        DATABASE: process.env.DATABASE || 'sofia'
    },
    
    // enviroments variables for paths and save files
    PATH: {
        // if not use folder in project use this path
        URL: process.env.URL_PRODUCT || '/home/mauro/Documents/store/prodImages'
    }

}
