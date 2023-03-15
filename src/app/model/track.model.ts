export interface TrackData {
    href: string;
    items: Items[];
    limit: number;
    next: string;
    offset: number;
    previous: number | null;
    total: number; 
}
0
export interface Items {
    album: Album;
    duration_ms: number;
    explicit: boolean;
    id: string;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    uri: string;  
}

export interface Album {
    artists: Artists [];
    images: Image[];
}

export interface Artists {
    name: string;
    href: string;
    id: string;
    uri: string;
}

export interface Image {
    height: number;
    url: string;
    width: number;
}


