import axios from 'axios';

// 登录请求方法
const loginreq = (method, url, params) => {
    return axios({
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: params,
        traditional: true,
        transformRequest: [
            function(data) {
                let ret = ''
                for (let it in data) {
                    ret +=
                        encodeURIComponent(it) +
                        '=' +
                        encodeURIComponent(data[it]) +
                        '&'
                }
                return ret
            }
        ]
    }).then(res => res.data);
};
// 通用公用方法
const req = (method, url, params) => {

    return axios({
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json',
             'Authorization': localStorage.getItem('logintoken')
        },
        data: params,
        traditional: true,
        // transformRequest: [
        //     function(data) {
        //         let ret = ''
        //         for (let it in data) {
        //             ret +=
        //                 encodeURIComponent(it) +
        //                 '=' +
        //                 encodeURIComponent(data[it]) +
        //                 '&'
        //         }
        //         return ret
        //     }
        // ]
    }).then(res => res.data);
};


const reqExcel = (method, url, params) => {

  return axios({
    method: method,
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': localStorage.getItem('logintoken')
    },
    data: params,
    responseType: 'blob',
    traditional: true,
    transformRequest: [
        function(data) {
            let ret = ''
            for (let it in data) {
                ret +=
                    encodeURIComponent(it) +
                    '=' +
                    encodeURIComponent(data[it]) +
                    '&'
            }
            return ret
        }
    ]
  }).then(res => res.data);
};
export {
    loginreq,
    req,
    reqExcel
}
