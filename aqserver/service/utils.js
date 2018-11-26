/**
 * Created by Gaven on 17/5/5.
 */
// import fetch from 'node-fetch'
// import urlencode from 'urlencode'
//
// const host = "http://res.wisedu.com:9090/wechat";
// const post_config = {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
//     },
//     timeout: 30*1000
// };
//
// export const wisFetch = (url, params)=>{
//     return fetch(host+url, {
//         ...post_config,
//         body: urlencode.stringify(params),
//     }).catch(e=>{
//         console.log(e)
//     })
// };

export const generateResult = (data=null, code=1000, msg='')=>{
    return {
	    data,
        code,
        msg,
    }
}