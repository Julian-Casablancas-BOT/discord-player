import { ExtractorModelData } from "..";
export interface Artist {
    name: string;
    url: string;
}
export interface Track {
    artist: Artist;
    duration: number;
    title: string;
    url: string;
    type: "song";
}
export interface RawAlbum {
    artist: Artist;
    description: string;
    numTracks: number;
    title: string;
    tracks: Track[];
    type: "album";
    thumbnail: string;
}
export interface RawPlaylist {
    creator: Artist;
    description: string;
    numTracks: number;
    title: string;
    tracks: Track[];
    type: "playlist";
    thumbnail: string;
}
declare function getRawPlaylist(document: string): RawPlaylist;
declare function getRawAlbum(document: string): RawAlbum;
declare function linkType(url: string): false | "album" | "playlist" | "song";
declare function search(url: string): Promise<RawPlaylist | RawAlbum | Track | null>;
declare function makeData(query: string): Promise<ExtractorModelData>;
export { linkType, search, getRawAlbum, getRawPlaylist, makeData };
