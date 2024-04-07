import {getRequest, postRequest, putRequest} from "../services/axios.service";

async function signinFromApi(username, password) {
    let data = {
        login: username,
        password: password
    }
    return await postRequest('/authapi/auth/signin', data);
}

async function signin(username, password) {
    return await signinFromApi(username, password);
}


async function getHeroUserFromApi(login) {
    return getRequest(`/authapi/user/getuser/${login}`, 'getHeroUser');
}

async function getHeroUser(username) {
    return await getHeroUserFromApi(username);
}


async function updateHeroFromApi(data) {
    return await putRequest('/herocorp/heroes/authupdate', data);
}

async function updateHero(hero) {
    return await updateHeroFromApi(hero);
}


async function createUserFromApi(data) {
    return postRequest('/authapi/user/register', data, 'createHero');
}

async function createUser(data) {
    return createUserFromApi(data);
}

export {
    signin,
    getHeroUser,
    updateHero,
    createUser
}
