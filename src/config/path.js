const urlPath = {
    login: process.env.REACT_APP_DOMAIN_URL + `/auth/login`,
    varifyEmail: process.env.REACT_APP_DOMAIN_URL + `/user/isVarifyEmail`,
    setPassword: process.env.REACT_APP_DOMAIN_URL + `/user/setPassword`,
    home: process.env.REACT_APP_DOMAIN_URL + '/user/getEmployee',
    profile: process.env.REACT_APP_DOMAIN_URL + `/user`,
    getUserById: process.env.REACT_APP_DOMAIN_URL + `/user/getUser`,
    update: process.env.REACT_APP_DOMAIN_URL + `/user`,
    register: process.env.REACT_APP_DOMAIN_URL + `/auth/register`,
    createLeaveRecord: process.env.REACT_APP_DOMAIN_URL + `/leaveRecord/createRecord`,
    getLeaveRecord: process.env.REACT_APP_DOMAIN_URL + `/leaveRecord/getAllRecord`,
    particularLeaveRecord: process.env.REACT_APP_DOMAIN_URL + `/leaveRecord/getParticularRecord`,
    updateLeaveRecord: process.env.REACT_APP_DOMAIN_URL + `/leaveRecord`,
    applyLeaveRequest: process.env.REACT_APP_DOMAIN_URL + `/leaveRequest`,
    getRequestByManagerId: process.env.REACT_APP_DOMAIN_URL + '/leaveRequest',
}

export default urlPath;