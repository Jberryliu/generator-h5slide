/*
    入口与路径配置
 */
seajs.config({
    charset: 'utf-8',
    alias: {
        init_slides: 'base.min.js'
    }
});

// 加载入口模块
seajs.use('init_slides');

