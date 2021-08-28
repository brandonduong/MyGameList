const request = require('request')
require('dotenv').config()

const options = {
    url: 'https://id.twitch.tv/oauth2/token',
    json:true,
    body: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'client_credentials'
    }
};

let accessToken = ''

function getAT(callback) {
    // Get twitch access token
    request.post(options, (err, res1, body) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Status: ${res1.statusCode}`);
        console.log(body.access_token);
        callback(err, body.access_token)
    });
}

gameInfo = (req, res) => {
    const { gameId } = req.body
    let AT = ""
    let info = ""
    getAT(function (err, result) {
        console.log("AT:" + result)
        AT = result
    })

    setTimeout(() => {
    let promise = new Promise(function (resolve, reject) {
        gameRequest(AT, gameId, function (err, result) {
            info = result
            resolve()
        });
    });

    promise.then(
        function result() {
            console.log("info: " + info)
            if (!info) {
                res.status(401)
                    .json({
                        error: `No info returned`
                    });
            } else {
                res.status(200)
                    .json(JSON.parse(info))
            }
        }
    )}, 1000)
}

function gameRequest(accessToken, gameId, callback){
    const gameOptions = {
        url: 'https://api.igdb.com/v4/games',
        method: 'POST',
        body: `fields name, summary, videos.*, artworks.url, artworks.width, artworks.height, first_release_date, cover.url, genres.name, involved_companies.*, involved_companies.company.name, similar_games.id; where category = 0; where id = ${gameId};`,
        headers: {
            'Client-ID': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + accessToken
        }
    }

    if (!accessToken) {
        console.log("No Token");
    } else {
        console.log(gameOptions);

        request.post(gameOptions, (err, res, body) => {
            if (err) {
                return console.log(err);
            }

            console.log(`Status: ${res.statusCode}`);
            console.log(JSON.parse(body));
            callback(err, body)
        });
    }
}

function gameSearch(accessToken, query, callback) {
    const searchOptions = {
        url: 'https://api.igdb.com/v4/games',
        method: 'POST',
        body: `search "${query}"; fields name, slug, first_release_date, total_rating_count, *; where category = 0; limit 500;`,
        headers: {
            'Client-ID': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + accessToken
        }
    }

    if (!accessToken) {
        console.log("No Token");
    } else {
        console.log(searchOptions);

        request.post(searchOptions, (err, res, body) => {
            if (err) {
                return console.log(err);
            }

            console.log(`Status: ${res.statusCode}`);
            console.log(JSON.parse(body));
            callback(err, body)
        });
    }
}

searchInfo = (req, res) => {
    const { query } = req.body
    let AT = ""
    let info = ""
    getAT(function (err, result) {
        console.log("AT:" + result)
        AT = result
    })

    setTimeout(() => {
        let promise = new Promise(function (resolve, reject) {
            gameSearch(AT, query, function (err, result) {
                info = result
                resolve()
            });
        });

        promise.then(
            function result() {
                if (!info) {
                    res.status(401)
                        .json({
                            error: `No info returned`
                        });
                } else {
                    res.status(200)
                        .json(JSON.parse(info))
                }
            }
        )}, 1000)
}


module.exports = {
    gameInfo,
    searchInfo
}
