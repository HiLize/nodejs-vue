/* eslint no-undef: 0 */

/*
工具库，封装一些常用的工具方法
*/
import { wisLoading } from './utils'
import axios from 'axios'
import config from './globalConfig'

// 数据处理方法
let _code = (data) => {
    if (data && (data.code === '0' || data.code === 0)) {
        return data
    } else {
        throw data
    }
}

// 一般是返回数据列表
let _rows = (data) => {
    data = _code(data)
    if (data && data.datas && data.datas.rows) {
        return data.datas.rows
    } else {
        return []
    }
}

// 自由数据
let _datas = (data) => {
    data = _code(data)
    if (data && data.datas !== undefined) {
        return data.datas
    } else {
        return []
    }
}

// 一般用来获取单行数据
let _firstRow = (data) => {
    data = _code(data)
    if (data && data.datas && data.datas.rows) {
        return data.datas.rows[0]
    } else {
        return null
    }
}

function httpGet (url) {
    return axios.get(url, {
        withCredentials: true
    })
}

function httpPost (url, data, cb) {
    return axios.post(url, data, {
        withCredentials: true
    }).then((res) => {
        if (cb && typeof (cb) === 'function') {
            return cb(res)
        } else {
            return res
        }
    })
}

function invokeFunction (func, data) {
    wisLoading.show();
    return axios.request({
        method: 'post',
        baseURL: config.fcBase + '/2016-08-15/',
        url: '/services/' + config.service + '/functions/' + func + '/invocations',
        data: data,
        withCredentials: true,
        headers:{
            "content-type":"application/json"
        },
        transformResponse: [function (data) {
            return data
        }]
    }).then(res=>{
      setTimeout(()=>{
        wisLoading.close();
      }, 800);
      return res
    }).catch(e=>{
      setTimeout(()=>{
        wisLoading.close();
      }, 800);
    })
}

function getQueryParam (name) {
    var value
    var params = location.search.replace(/\?/g, '').split('&')
    params.forEach(function (param) {
        if (param && typeof param === 'string') {
            var arr = param.split('=')
            if (arr.length > 1 && arr[0] === name) {
                value = arr[1]
            }
        }
    })
    return value
}

export default {
    httpGet: httpGet,
    httpPost: httpPost,
    invkFunc: invokeFunction,
    getQueryParam: getQueryParam,
    handler: {
        CODE: _code,
        ROWS: _rows,
        DATAS: _datas,
        FIRST_ROW: _firstRow
    }
}
