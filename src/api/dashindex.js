import request from '../utils/request';

export const dashprocount = () => {
    return request({
        url: '/dashprocount',
        method: 'get',
        params: {}
    });
};

export const dashdevcount = () => {
    return request({
        url: '/dashdevcount',
        method: 'get',
        params: {}
    });
};

export const dashmisscount = () => {
    return request({
        url: '/dashmisscount',
        method: 'get',
        params: {}
    });
};
