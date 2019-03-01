
fis.config.set('name','vueapp');

fis.hook('module')

// ---组件库es6解析
fis.match('modules/**.js', {
    isMod: true,
    rExt: '.js',
    url:function (inputs,src){
        return src.replace('/modules/','')
    },
    packTo:'dist/bulid.js',
    parser: 'es6-babel'
});

// --工具库,并打包
fis.match('statics/libs/**/*.js', {
    isMod:false,
    useCompile:false,
    packTo: 'dist/libs.js',  //--打包
});


fis.match('statics/libs/mod.js', {
    packOrder:'-100' //---modjs最先打包
});

fis.match('statics/libs/polyfill.js',{
    packOrder:'-99'
});

fis.match('statics/libs/util/{modalEffects,util,config,date}.js', {
    useCompile:true,
    isMod:false,
    parser:'es6-babel'
});


fis.match('statics/libs/js/**.js', {
    useCompile:true,
    isMod:false,
    parser:'es6-babel'
});
//--css样式

fis.match('statics/styles/*.css',{
    useCompile:false,
    packTo:'dist/libs.css'
});

//--解析stylus
fis.match('*.styl',{
    rExt:'css',
    parser: 'stylus-sherry',
    packTo:'dist/bulid.css'
});

fis.match('statics/styles/login.styl',{
    packTo:false
});

// --nodejs模块禁止编译；防止更改require模块路径
fis.match('routers/**.js', {
  useCompile:false,
  isMod:false
});

fis.match('routers/config.js', {
  useCompile:true,
  isMod:false
});

var local = {
        from : /_domain/g,
        to : '',
};

var remote = {
        from : /_domain/g,
        to : '/hadmin',
};

//---本地调试
fis.media('local').match('views/**.html',{
    parser:fis.plugin('replace-cdn',local)
}).match('routers/config.js',{
    parser:fis.plugin('replace-cdn',local)
}).match('modules/**.js',{
    parser:[
        fis.plugin('replace-cdn',local),
        'es6-babel'
    ]
}).match('statics/js/**.js',{
    parser:[
        fis.plugin('replace-cdn',local),
        'es6-babel'
    ]
}).match('modules/**.styl',{
    postprocessor: fis.plugin('replace-cdn',local)
}).match('modules/**.html',{
    parser: fis.plugin('replace-cdn',local)
}).match('statics/styles/bootstrap.css',{
    useCompile:true,
    postprocessor: fis.plugin('replace-cdn',{
        from : /\/statics/g,
        to : ''
    })
});

//---线上
fis.media('remote').match('views/**.html',{
    parser:fis.plugin('replace-cdn',remote)
}).match('routers/config.js',{
    parser:fis.plugin('replace-cdn',remote)
}).match('modules/**.js',{
    parser:[
        fis.plugin('replace-cdn',remote),
        'es6-babel'
    ]
}).match('statics/js/**.js',{
    parser:[
        fis.plugin('replace-cdn',remote),
        'es6-babel'
    ]
}).match('modules/**.styl',{
    postprocessor: fis.plugin('replace-cdn',remote)
}).match('modules/**.html',{
    parser: fis.plugin('replace-cdn',remote)
}).match('statics/styles/bootstrap.css',{
    useCompile:true,
    postprocessor: fis.plugin('replace-cdn',{
        from : /\/statics/g,
        to : '/hadmin'
    })
})
