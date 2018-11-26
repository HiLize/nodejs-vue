
var ENV = 'development'; // development, test, production
if(process.env.NODE_ENV === 'production'){
  ENV = 'production';
}

var base

if (ENV === 'development') {
    base = {
        fcBase: 'http://fctest.wectest.wisedu.com',
        cpBase: 'http://next.wisedu.com:8013',
        service: 'AQService'

    }
}
if (ENV === 'test') {
    base = {
        fcBase: 'http://fc.wectest.wisedu.com',
        cpBase: 'http://next.wisedu.com:8013',
        service: 'AQService'
    }
}
if (ENV === 'production') {
    base = {
        fcBase: 'https://functionCompute.cpdaily.com',
        cpBase: 'https://www.cpdaily.com',
        service: 'AQService'
    }
}

let APP_ROOT = ''

let cpPath = (path) => {
    return base.cpBase + path
}

const urls = {
    CIRCLE_LIST: cpPath(`${APP_ROOT}/v3/circles/publish`),
    CIRCLE_PUBLISH: cpPath(`${APP_ROOT}/v3/fresh/publish`)
}

var config = {
    urls: urls,
    fcBase: base.fcBase,
    cpBase: base.cpBase,
    service: base.service,
    testId: 2,
    appId: 88888888,
    share: {
        direct: base.cpBase + '/v3/active/autologin',
        redirect: base.fcBase + '/fc/trustLogin',
        img: 'https://microapp.cpdaily.com/commonservices/eqtest/statics/imgs/astronautN.png',
        userComments: ['这个测试好有趣！', '震惊！我竟然得了这个分数！', '厉害了！3分钟就能知道你的EQ！', '小伙伴们一起来玩呀～', '敢不敢来和我比一比！']
    }
}

export default config
