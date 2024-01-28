const urlPath = {
    login: process.env.REACT_APP_DOMAIN_URL + `/auth/login`,
    varifyEmail: process.env.REACT_APP_DOMAIN_URL + `/user/isVarifyEmail`,
    setPassword: process.env.REACT_APP_DOMAIN_URL + `/user/setPassword`,
    home: process.env.REACT_APP_DOMAIN_URL + '/user/getEmployee',
    profile: process.env.REACT_APP_DOMAIN_URL + `/user`,
    getManagerDetail: process.env.REACT_APP_DOMAIN_URL + `/user/getUser`,
    update: process.env.REACT_APP_DOMAIN_URL + `/user`,
    register:process.env.REACT_APP_DOMAIN_URL + `/auth/register`,
}

export default urlPath;