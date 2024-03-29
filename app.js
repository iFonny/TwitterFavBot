const Twitter = require('twit');
const config = require('./config.json');

const main = new Twitter({
    consumer_key: config.main.consumer_key,
    consumer_secret: config.main.consumer_secret,
    access_token: config.main.access_token,
    access_token_secret: config.main.access_token_secret
});

const proverbe = new Twitter({
    consumer_key: config.proverbe.consumer_key,
    consumer_secret: config.proverbe.consumer_secret,
    access_token: config.proverbe.access_token,
    access_token_secret: config.proverbe.access_token_secret
});

const twitelo = new Twitter({
    consumer_key: config.twitelo.consumer_key,
    consumer_secret: config.twitelo.consumer_secret,
    access_token: config.twitelo.access_token,
    access_token_secret: config.twitelo.access_token_secret
});

const bannedWords = ['weed', 'beuh', 'covid', 'shit', 'vaccin', 'faux bilet', 'THC', 'Télégram', 'Telegram', 'WhatsApp', 'drogue', 
                    'cocaine', '#mrproverbe', 'Pass sanitaire', 'vacinal', 'tabac', 'hash', 'passeport', "carte d\\'identité", 
                    'permis de conduire', 'snapchat', 'follow', 'abonner'];
const bannedWordsRegex  = new RegExp(bannedWords.join('|').toLowerCase(), 'gmi');
console.log('Banword regex: ', bannedWordsRegex)

function hasBannedWords(text) {
    return text.toLowerCase().match(bannedWordsRegex) != null;
}

let favstream = main.stream('statuses/filter', {
    track: ['ori and the blind forest', 'ori and the will of the wisps', 'sense8'],
    language: 'en,fr',
});

let favstreamTwitelo = twitelo.stream('statuses/filter', {
    track: ['speedrun', 'speedrunning', 'league of legends', 'mmr', 'high elo',
        'Aatrox', 'Akali', 'Alistar', 'Amumu', 'Anivia', 'Blitzcrank', 'Chogath',
        'Ezreal', 'Fiddlestick', 'Galio', 'Gangplank', 'Garen', 'Gragas', 'Hecarim', 'Heimerdinger', 'Illaoi', 'Irelia',
        'Jarvan', 'Kassadin', 'KhaZix', 'Kindred', 'KogMaw', 'Lee Sin', 'Lissandra', 'Malphite', 'Malzahar', 'Maokai',
        'Mordekaiser', 'Nasus', 'Nidalee', 'Rammus', 'RekSai', 'Renekton', 'Riven', 'Sejuani', 'Singed',
        'Skarner', 'Syndra', 'Taric', 'Teemo', 'Thresh', 'Tryndamere', 'Twisted Fate', 'Udyr', 'Urgot', 'Varus', 'Vayne',
        'Veigar', 'VelKoz', 'Volibear', 'Wukong', 'Xerath', 'Yasuo', 'Ziggs', 'Zilean'
    ],
    language: 'en,fr',
});

let rtstream = proverbe.stream('statuses/filter', {
    track: ['#proverbe', '#citation'],
    language: 'en,fr',
});

// FAVLIMIT/2 minutes
const FAVLIMIT = 1;
// FAVLIMIT/10 minutes
const FAVLIMITTWITELO = 1;
// RTLIMIT/2 minutes
const RTLIMIT = 1;

const ENABLED = true;

let favlimit = 0;
let favlimitTwitelo = 0;
let rtlimit = 0;


// Streams on tweet
favstream.on('tweet', function (tweet) {
    if (!tweet.retweeted_status && !hasBannedWords(tweet.extended_tweet?.full_text || tweet.text)) fav(main, tweet);
});

favstreamTwitelo.on('tweet', function (tweet) {
    if (!tweet.retweeted_status && !hasBannedWords(tweet.extended_tweet?.full_text || tweet.text) && !tweet.user.name.toLowerCase().includes('mmr') &&
        !tweet.user.screen_name.toLowerCase().includes('mmr') && !tweet.user.name.toLowerCase().includes('wr') &&
        !tweet.user.screen_name.toLowerCase().includes('wr')) favTwitelo(twitelo, tweet);
});

rtstream.on('tweet', function (tweet) {
    if (!tweet.retweeted_status && !hasBannedWords(tweet.extended_tweet?.full_text || tweet.text)) retweet(proverbe, tweet);
});

/* Actions fonctions */

let retweet = (account, tweet) => {
    if (ENABLED && rtlimit < RTLIMIT) {
        rtlimit++;
        account.post('statuses/retweet/:id', {
            id: tweet.id_str
        });
    }
};

let fav = (account, tweet) => {
    if (ENABLED && favlimit < FAVLIMIT) {
        favlimit++;
        setTimeout(() => {
            account.post('favorites/create', {
                id: tweet.id_str
            });
        }, 80000);
    }
};

let favTwitelo = (account, tweet) => {
    if (ENABLED && favlimitTwitelo < FAVLIMITTWITELO) {
        favlimitTwitelo++;
        setTimeout(() => {
            account.post('favorites/create', {
                id: tweet.id_str
            });
        }, 40000);
    }
};

/* Loop reset limits */

setInterval(() => {
    console.log(`(iFonny_) Nombre de tweets fav durant les 2 dernieres minutes : ${favlimit}`)
    favlimit = 0;
}, 120000);

setInterval(() => {
    console.log(`(TwiteloFR) Nombre de tweets fav durant les 10 dernieres minutes : ${favlimitTwitelo}`)
    favlimitTwitelo = 0;
}, 600000);

setInterval(() => {
    console.log(`(Mrproverbe) Nombre de tweets rt durant les 2 dernieres minutes : ${rtlimit}`)
    rtlimit = 0;
}, 120000);
