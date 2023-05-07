import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/missionselectall/',
        /* url: query.method, */
        method: 'get',
        params: query
    });
};

export const missionSelect = query => {
    return request({
        url: '/missionselect',
        /* url: query.method, */
        method: 'get',
        params: query
    });
};
// 所有的请求都调这个函数


export const projectSelect = query => {
    return request({
        url: '/proselect',
        /* url: query.method, */
        method: 'get',
        params: query
    });
};


export const devSelect = query => {
    return request({
        url: '/devselect',
        /* url: query.method, */
        method: 'get',
        params: query
    });
};


export const deleteT = deleteId => {
    return request({
        url: '/multidelete',
        method: 'get',
        params: {
            ids:deleteId
        }
    });
};

export const proDelete = deleteId => {
    return request({
        url: '/prodelete',
        method: 'get',
        params: {
            ids:deleteId
        }
    });
};


export const devDelete = deleteId => {
    return request({
        url: '/devdelete',
        method: 'get',
        params: {
            ids:deleteId
        }
    });
};

export const userDelete = deleteId => {
    return request({
        url: '/userdelete',
        method: 'get',
        params: {
            ids:deleteId
        }
    });
};


export const selectData = (name,depart) => {
    return request({
        url: '/select/',
        method: 'get',
        params: {
            executor:name,
            department:depart
        }
    });
};


//修改
export const updateData = (idT,statusT,nameT,exeTime,finTime) => {
    return request({
        url: '/update',
        method: 'get',
        params: {
            id:idT,
            status:statusT,
            executorName:nameT,
            executeTime:exeTime,
            finishTime:finTime
        }
    });
};

//修改
export const updateData1 = (form) => {
    return request({
        url: '/update',
        method: 'get',
        params: form
    });
};


//修改
export const proupdate = (form) => {
    return request({
        url: '/proupdate',
        method: 'get',
        params: form
    });
};


export const devupdate = (form) => {
    return request({
        url: '/devupdate',
        method: 'get',
        params: form
    });
};

export const userupdate = (form) => {
    return request({
        url: '/userupdate',
        method: 'get',
        params: form
    });
};



export const devbound = (deviceid,projectNo) => {
    return request({
        url: '/devbound',
        method: 'get',
        params: {
            id:deviceid,
            projectNo:projectNo
        }
    });
};



export const insertT = (insert) => {
    return request({
        url: '/missioninsert',
        method: 'get',
        params: {

            missionNo:insert.no,
            missionName:insert.name,
            projectId:insert.projectId,
            createDepartment:insert.createDepartment,
            executor:insert.executor,
            status:insert.status,
            deviceId:insert.deviceId,
            executeTime:insert.insertTime,
            finishTime:insert.insertTime1
            
        }
    });
};


export const proinsertT = (insert) => {
    return request({
        url: '/proinsert',
        method: 'get',
        params: insert
    });
};


export const devinsertT = (insert) => {
    return request({
        url: '/devinsert',
        method: 'get',
        params: insert
    });
};

export const userinsert = (insert) => {
    return request({
        url: '/userinsert',
        method: 'get',
        params: insert
    });
};



export const selectCount = (query) => {
    return request({
        url: '/missionCount',
        method: 'get',
        params: {
        }
    });
};

export const selectprovince = () => {
    return request({
        url: '/selectprovince',
        method: 'get',
        params: {
        }
    });
};


export const selectcity = (provinceT) => {
    return request({
        url: '/selectcity',
        method: 'get',
        params: {
            province : provinceT
        }
    });
};



export const selectmanager = () => {
    return request({
        url: '/selectmanager',
        method: 'get',
        params: {}
    });
};


export const selectdepartment = () => {
    return request({
        url: '/selectdepartment',
        method: 'get',
        params: {}
    });
};



export const selectexecutor = () => {
    return request({
        url: '/selectexecutor',
        method: 'get',
        params: {}
    });
};

export const selectproject = () => {
    return request({
        url: '/selectprojectNo',
        method: 'get',
        params: {}
    });
};

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

export const dashusercount = () => {
    return request({
        url: '/dashusercount',
        method: 'get',
        params: {}
    });
};



// export const dashproselect = () => {
//     return request({
//         url: '/dashproselect',
//         method: 'get',
//         params: {}
//     });
// };

export const dashproselect = () => {
    return request({
        url: '/dashproselectall',
        method: 'get',
        params: {}
    });
};


export const province = () => {
    return request({
        url: '/province',
        method: 'get',
        params: {}
    });
};

//获取有项目的城市
export const city = (params) => {
    return request({
        url: '/city',
        method: 'get',
        params: params
    });
};

//获取项目
export const project = (params) => {
    return request({
        url: '/project',
        method: 'get',
        params: params
    });
};
//获取未绑定的设备列表
export const devnotbound = () => {
    return request({
        url: '/selectnotbound',
        method: 'get',
        params: {
            status:"未绑定"
        }
    });
};

//获取项目列表

export const prolist = () => {
    return request({
        url: '/prolist',
        method: 'get',
        params: {}
    });
};

export const userselect = (params) => {
    return request({
        url: '/userselect',
        method: 'get',
        params: params
    });
};


export const mission = (params) => {
    return request({
        url: '/promission',
        method: 'get',
        params: params
    });
};

//获取用户姓名
export const selectname = (params) => {
    return request({
        url: '/selectname',
        method: 'get',
        params: params
    });
};

export const postTest = () => {
    return request({
        url: 'http://114.115.144.239:8080/v1/live/start?token=eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJwZXJtaXQiOjQ1ODg3OSwibGV2ZWwiOjEwMCwiaXN0IjowfQ.ipIgv5UPPLBpKTv33QPcNeEoTtbtruQKTTjKMdjWMq0',
        method: 'post',
        data:
            {
                "channel":"34020000001320031181",
                "device":"34020000001320031180"
            }
            
    });
};






