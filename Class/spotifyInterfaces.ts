interface ClientCredentialsResponse {
    "access_token": string,
    "token_type": "bearer",
    "expires_in": 3600
}

interface Track {
    album: Album
    artists: Artist2[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: ExternalIds2
    external_urls: ExternalUrls4
    href: string
    id: string
    is_playable: boolean
    linked_from: LinkedFrom
    restrictions: Restrictions2
    name: string
    popularity: number
    preview_url: string
    track_number: number
    type: string
    uri: string
    is_local: boolean
  }
  
  interface Album {
    album_type: string
    total_tracks: number
    available_markets: string[]
    external_urls: ExternalUrls
    href: string
    id: string
    images: Image[]
    name: string
    release_date: string
    release_date_precision: string
    restrictions: Restrictions
    type: string
    uri: string
    copyrights: Copyright[]
    external_ids: ExternalIds
    genres: string[]
    label: string
    popularity: number
    album_group: string
    artists: Artist[]
  }
  
  interface ExternalUrls {
    spotify: string
  }
  
  interface Image {
    url: string
    height: number
    width: number
  }
  
  interface Restrictions {
    reason: string
  }
  
  interface Copyright {
    text: string
    type: string
  }
  
  interface ExternalIds {
    isrc: string
    ean: string
    upc: string
  }
  
  interface Artist {
    external_urls: ExternalUrls2
    href: string
    id: string
    name: string
    type: string
    uri: string
  }
  
  interface ExternalUrls2 {
    spotify: string
  }
  
   interface Artist2 {
    external_urls: ExternalUrls3
    followers: Followers
    genres: string[]
    href: string
    id: string
    images: Image2[]
    name: string
    popularity: number
    type: string
    uri: string
  }
  
   interface ExternalUrls3 {
    spotify: string
  }
  
   interface Followers {
    href: string
    total: number
  }
  
   interface Image2 {
    url: string
    height: number
    width: number
  }
  
   interface ExternalIds2 {
    isrc: string
    ean: string
    upc: string
  }
  
   interface ExternalUrls4 {
    spotify: string
  }
  
   interface LinkedFrom {}
  
   interface Restrictions2 {
    reason: string
  }
  
interface Error {
  error: {
    status: number,
    message: string
  }
}

export {
    ClientCredentialsResponse,
    Track,
    Error
}