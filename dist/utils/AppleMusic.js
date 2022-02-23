"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeData = exports.getRawPlaylist = exports.getRawAlbum = exports.search = exports.linkType = void 0;
const tslib_1 = require("tslib");
const axios_1 = (0, tslib_1.__importDefault)(require("axios"));
const cheerio_1 = (0, tslib_1.__importDefault)(require("cheerio"));
const youtube_sr_1 = (0, tslib_1.__importDefault)(require("youtube-sr"));
function getRawPlaylist(document) {
    var _a, _b;
    const $ = cheerio_1.default.load(document);
    const tracks = [];
    const songList = $("div.songs-list-row").toArray();
    songList.forEach((song) => {
        var _a, _b;
        const lookArtist = $(song).find("div.songs-list__col--artist").find("a.songs-list-row__link");
        const track = {
            artist: {
                name: lookArtist.text(),
                url: (_a = lookArtist.attr("href")) !== null && _a !== void 0 ? _a : ""
            },
            title: $(song).find("div.songs-list__col--song").find("div.songs-list-row__song-name").text(),
            duration: $(song)
                .find("div.songs-list__col--time")
                .find("time")
                .text()
                .trim()
                .split(":")
                .map((value) => Number(value))
                .reduce((acc, time) => 60 * acc + time),
            url: (_b = $(song).find("div.songs-list__col--album").find("a.songs-list-row__link").attr("href")) !== null && _b !== void 0 ? _b : "",
            type: "song"
        };
        tracks.push(track);
    });
    const product = $("div.product-page-header");
    const creator = product.find("div.product-creator").find("a.dt-link-to");
    const playlist = {
        title: product.find("h1.product-name").text().trim(),
        description: product.find("div.product-page-header__metadata--notes").text().trim(),
        creator: {
            name: creator.text().trim(),
            url: (_a = "https://music.apple.com" + creator.attr("href")) !== null && _a !== void 0 ? _a : ""
        },
        tracks,
        numTracks: tracks.length,
        type: "playlist",
        thumbnail: (_b = $("meta[property='og:image']").attr("content")) !== null && _b !== void 0 ? _b : ""
    };
    return playlist;
}
exports.getRawPlaylist = getRawPlaylist;
function getRawAlbum(document) {
    var _a, _b;
    const $ = cheerio_1.default.load(document);
    const tracks = [];
    const product = $("div.product-page-header");
    const creator = product.find("div.product-creator").find("a.dt-link-to");
    const artist = {
        name: creator.text().trim(),
        url: (_a = creator.attr("href")) !== null && _a !== void 0 ? _a : ""
    };
    const albumUrl = $("meta[property='og:url']").attr("content");
    const songList = $("div.songs-list-row").toArray();
    songList.forEach((song) => {
        var _a, _b;
        const track = {
            artist,
            title: $(song).find("div.songs-list__col--song").find("div.songs-list-row__song-name").text(),
            duration: $(song)
                .find("div.songs-list__col--time")
                .find("time")
                .text()
                .trim()
                .split(":")
                .map((value) => Number(value))
                .reduce((acc, time) => 60 * acc + time),
            url: albumUrl
                ? (_b = albumUrl + "?i=" + JSON.parse((_a = $(song).find("div.songs-list__col--time").find("button.preview-button").attr("data-metrics-click")) !== null && _a !== void 0 ? _a : "{ targetId: 0 }")["targetId"]) !== null && _b !== void 0 ? _b : ""
                : "",
            type: "song"
        };
        tracks.push(track);
    });
    const playlist = {
        title: product.find("h1.product-name").text().trim(),
        description: product.find("div.product-page-header__metadata--notes").text().trim(),
        artist,
        tracks,
        numTracks: tracks.length,
        type: "album",
        thumbnail: (_b = $("meta[property='og:image']").attr("content")) !== null && _b !== void 0 ? _b : ""
    };
    return playlist;
}
exports.getRawAlbum = getRawAlbum;
function linkType(url) {
    if (RegExp(/https?:\/\/music\.apple\.com\/.+?\/album\/.+?\/.+?\?i=([0-9]+)/).test(url)) {
        return "song";
    }
    else if (RegExp(/https?:\/\/music\.apple\.com\/.+?\/playlist\//).test(url)) {
        return "playlist";
    }
    else if (RegExp(/https?:\/\/music\.apple\.com\/.+?\/album\//).test(url)) {
        return "album";
    }
    else {
        return false;
    }
}
exports.linkType = linkType;
function search(url) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const urlType = linkType(url);
        const page = yield axios_1.default
            .get(url)
            .then((res) => res.data)
            .catch(() => undefined);
        if (!page) {
            return null;
        }
        if (urlType === "playlist") {
            return getRawPlaylist(page);
        }
        const album = getRawAlbum(page);
        if (urlType === "album") {
            return album;
        }
        const match = new RegExp(/https?:\/\/music\.apple\.com\/.+?\/album\/.+?\/.+?\?i=([0-9]+)/).exec(url);
        const id = match ? match[1] : undefined;
        if (!id) {
            return null;
        }
        const track = album.tracks.find((track) => {
            return track.url.includes(`?i=${id}`);
        });
        if (!track) {
            return null;
        }
        return track;
    });
}
exports.search = search;
function makeData(query) {
    var _a, _b, _c, _d;
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const music_data = yield search(query);
        if (music_data.type === "song") {
            const videos = yield youtube_sr_1.default.search(music_data.title, {
                type: "video"
            });
            if (!videos)
                return null;
            const info = {
                data: [
                    {
                        title: music_data.title,
                        duration: videos[0].duration,
                        thumbnail: videos[0].thumbnail.url,
                        engine: "youtube",
                        views: 0,
                        author: music_data.artist.name,
                        description: videos[0].description,
                        url: videos[0].url,
                        source: "applemusic"
                    }
                ]
            };
            return {
                playlist: null,
                data: (_b = (_a = info.data) === null || _a === void 0 ? void 0 : _a.map((m) => ({
                    title: m.title,
                    duration: m.duration,
                    thumbnail: m.thumbnail,
                    engine: m.engine,
                    views: m.views,
                    author: m.author,
                    description: m.description,
                    url: m.url,
                    source: m.source
                }))) !== null && _b !== void 0 ? _b : []
            };
        }
        // eslint-disable-next-line no-constant-condition
        if (music_data.type === "playlist" || "album") {
            const info = {
                data: [],
                playlist: {
                    title: music_data.title,
                    description: music_data.description,
                    thumbnail: "",
                    source: "applemusic",
                    url: query,
                    id: "",
                    type: music_data.type === "playlist" ? "playlist" : "album",
                    author: {
                        name: music_data.type === "playlist" ? music_data.creator.name : music_data.artist.name,
                        url: music_data.type === "playlist" ? music_data.creator.url : music_data.artist.url
                    }
                }
            };
            for (const m of music_data.tracks) {
                const videos = yield youtube_sr_1.default.search(m.title, {
                    type: "video"
                });
                if (!videos)
                    return null;
                const data = {
                    title: videos[0].title,
                    duration: videos[0].duration,
                    thumbnail: videos[0].thumbnail.url,
                    engine: "youtube",
                    views: 0,
                    author: videos[0].channel.name,
                    description: videos[0].description,
                    url: videos[0].url,
                    source: "applemusic"
                };
                info.data.push(data);
            }
            return {
                playlist: info.playlist,
                data: (_d = (_c = info.data) === null || _c === void 0 ? void 0 : _c.map((m) => ({
                    title: m.title,
                    duration: m.duration,
                    thumbnail: m.thumbnail,
                    engine: m.engine,
                    views: m.views,
                    author: m.author,
                    description: m.description,
                    url: m.url,
                    source: m.source
                }))) !== null && _d !== void 0 ? _d : []
            };
        }
    });
}
exports.makeData = makeData;
