import {getRequest, postRequest, putRequest} from "./axios.service";

async function getAliasesFromAPI() {
    return getRequest('/herocorp/heroes/getaliases', 'getAliases');
}

async function getAliases() {
    let answer = await getAliasesFromAPI();
    return answer.data;
}


async function createHeroFromAPI(data) {
    return postRequest('/herocorp/heroes/create', data, 'createHero');
}

async function createHero(publicName, realName, powers) {
    let data = {
        publicName: publicName,
        realName: realName
    };
    if (powers !== undefined) {
        if (powers.length !== 0) data.powers = powers;
    }
    let answer = await createHeroFromAPI(data);
    return answer.data;
}


async function updateHeroFromAPI(data) {
    return putRequest('/herocorp/heroes/update', data, 'updateHero');
}

async function updateHero(id, publicName, realName, powers) {
    let data = {
        _id: id
    };
    if (publicName !== null) data.publicName = publicName;
    if (realName !== null) data.realName = realName;
    if (powers !== null) data.powers = powers;
    let answer = await updateHeroFromAPI(data);
    return answer.data;
}


async function getHeroByIDFromAPI(id) {
    return getRequest('/herocorp/heroes/getbyid/' + id, 'getHeroByID');
}

async function getHeroByID(id) {
    let answer = await getHeroByIDFromAPI(id);
    return answer.data;
}


export {
    getAliases,
    createHero,
    updateHero,
    getHeroByID
}