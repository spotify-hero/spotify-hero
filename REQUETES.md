# Requêtes à l'API Spotify

## 1. Spécifier l'Access Token
```-H "Authorization: Bearer BQAVuaNjcxME-sl0_mjsb01ZUBysZ9wqDMuty1njgJApDrQ8KnR9uILbryWIxEOqp8PEuM-wnNwYs4t0BnYkTpivelEeV9k1FXAvCoa7AsGu_Us67Ywqg-_qmQyS0ktzxy_VNHl90_Lz13lnG19q2dlQoqa2NLC133EFuwgsNvRBH1RSEyyRT2vGBgs0iIUMDNZixGREdmuW2eG8o2RROVsJ9WZHhcXrxvaw2X8MinscX5cJkgDN8Um116Fqc-jhGqBh2ISDOv-mADlxa5uqDkQcWHwr"```

Pour faire plaisir à Spotify
```-H "Accept: application/json" -H "Content-Type: application/json"```

## 2. Requêtes GET
- Informations sur l'utilisateur
```
-X "GET" "https://api.spotify.com/v1/me"
{
  "birthdate": "1994-02-02",
  "country": "FR",
  "display_name": "Gabriel Forien",
  "email": "gforien@gmail.com",
  "id": "11133957842",
  "product": "premium",
  "uri": "spotify:user:11133957842"

  "external_urls": {
    "spotify": "https://open.spotify.com/user/11133957842"
  },
  "images": [
    {
      "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/57774943_3146958145318219_5855834251898912768_n.jpg?_nc_cat=108&_nc_ht=scontent.xx&oh=42c7f0ac0cc47b59b564575cc7a7c2d8&oe=5D652D34"
    }
  ]
}
```

- Informations sur les devices
```
-X "GET" "https://api.spotify.com/v1/me/player/devices"
{
  "devices": [
    {
      "id": "8809298a4f83da63f1e75c52d6a8c7df0c5f35eb",
      "is_active": false,
      "is_private_session": false,
      "is_restricted": false,
      "name": "Web Playback SDK Quick Start Player",
      "type": "Computer",
      "volume_percent": 100
    }
  ]
}
```

- Musique actuelle
```
-X "GET" "https://api.spotify.com/v1/me/player/currently-playing"
```

## -> Recherche par keywords
Pas besoin d'access token :+1:

Tout est en paramètre de l'URL

(!) _type_ est un paramètre obligatoire, il peut être track/artist/album/playlist
ou une combinaison de ces valeurs séparées par des virgules
```
-X "GET" "https://api.spotify.com/v1/search?q=foo%20bar&type=track%2Cartist&market=FR&limit=10"
```

- Requête d'un album
```
{
"albums": {
    "href": "https://api.spotify.com/v1/search?query=Muse&type=album&market=FR&offset=0&limit=2",
    "items": [
      {
        "id": "5OZgDtx180ZZPMpm36J2zC",
        "name": "Simulation Theory (Super Deluxe)",
        "type": "album",
        "uri": "spotify:album:5OZgDtx180ZZPMpm36J2zC",

        "album_type": "album",
        "total_tracks": 21,
        "release_date": "2018-11-09",
        "release_date_precision": "day",
        "artists": [
          {
            "id": "12Chz98pHFMPJEknJQMWvI",
            "name": "Muse",
            "type": "artist",
            "uri": "spotify:artist:12Chz98pHFMPJEknJQMWvI"
          }
        ],

        "images": [
          {
            "height": 640,
            "url": "https://i.scdn.co/image/9a0ef2cbc0388e12b08a9f7915011440ee223835",
            "width": 640
          },
          {
            "height": 300,
            "url": "https://i.scdn.co/image/0b2a261f7bec0ed109a149316d116c15ca72e5ef",
            "width": 300
          },
          {
            "height": 64,
            "url": "https://i.scdn.co/image/28a8487234c901ae9fe127d1d0eef738a91e46d6",
            "width": 64
          }
        ]
      },
      {
        ......
      }
    ],
    "offset": 0,
    "limit": 2,
    "previous": null,
    "next": "https://api.spotify.com/v1/search?query=Muse&type=album&market=FR&offset=2&limit=2",
  }
}
```

- Requête d'un artiste
```
{
"artists": {
    "href": "https://api.spotify.com/v1/search?query=Muse&type=artist&market=FR&offset=0&limit=2",
    "items": [
      {
        "name": "Muse",
        "popularity": 80,
        "type": "artist",
        "uri": "spotify:artist:12Chz98pHFMPJEknJQMWvI"
        "id": "12Chz98pHFMPJEknJQMWvI",
        "followers": {
          "total": 4768730
        },
        "genres": [
          "modern rock",
          "rock"
        ],
        "images": [
          {
            "height": 640,
            "url": "https://i.scdn.co/image/12450535621500d6e519275f2c52d49c00a0168f",
            "width": 640
          },
          {
            "height": 320,
            "url": "https://i.scdn.co/image/17f00ec7613d733f2dd88de8f2c1628ea5f9adde",
            "width": 320
          },
          {
            "height": 160,
            "url": "https://i.scdn.co/image/2da69b7920c065afc835124c4786025820adab8c",
            "width": 160
          }
        ],
      },
      {
        ...
      }
    ],
    "offset": 0,
    "limit": 2,
    "next": "https://api.spotify.com/v1/search?query=Muse&type=artist&market=FR&offset=2&limit=2",
    "previous": null,
  }
}
```

- Requête de tracks
```{
  "tracks": {
    "href": "https://api.spotify.com/v1/search?query=Muse&type=track&market=FR&offset=0&limit=2",
    "items": [
      {
        "album": {
          "album_type": "album",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/12Chz98pHFMPJEknJQMWvI"
              },
              "href": "https://api.spotify.com/v1/artists/12Chz98pHFMPJEknJQMWvI",
              "id": "12Chz98pHFMPJEknJQMWvI",
              "name": "Muse",
              "type": "artist",
              "uri": "spotify:artist:12Chz98pHFMPJEknJQMWvI"
            }
          ],
          
          "external_urls": {
            "spotify": "https://open.spotify.com/album/0eFHYz8NmK75zSplL5qlfM"
          },
          "href": "https://api.spotify.com/v1/albums/0eFHYz8NmK75zSplL5qlfM",
          "id": "0eFHYz8NmK75zSplL5qlfM",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/6e1be3ceda70250c701caee5a16bef205e94bc98",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/28752dcf4b27ba14c1fc62f04ff469aa53c113d7",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/26098aaa50a3450f0bac8f1a7d7677accf3f3cb6",
              "width": 64
            }
          ],
          "name": "The Resistance",
          "release_date": "2009-09-10",
          "release_date_precision": "day",
          "total_tracks": 11,
          "type": "album",
          "uri": "spotify:album:0eFHYz8NmK75zSplL5qlfM"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/12Chz98pHFMPJEknJQMWvI"
            },
            "href": "https://api.spotify.com/v1/artists/12Chz98pHFMPJEknJQMWvI",
            "id": "12Chz98pHFMPJEknJQMWvI",
            "name": "Muse",
            "type": "artist",
            "uri": "spotify:artist:12Chz98pHFMPJEknJQMWvI"
          }
        ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/5OZgDtx180ZZPMpm36J2zC"
          },
          "href": "https://api.spotify.com/v1/albums/5OZgDtx180ZZPMpm36J2zC",
          "id": "5OZgDtx180ZZPMpm36J2zC",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/9a0ef2cbc0388e12b08a9f7915011440ee223835",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/0b2a261f7bec0ed109a149316d116c15ca72e5ef",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/28a8487234c901ae9fe127d1d0eef738a91e46d6",
              "width": 64
            }
          ],
          "name": "Simulation Theory (Super Deluxe)",
          "release_date": "2018-11-09",
          "release_date_precision": "day",
          "total_tracks": 21,
          "type": "album",
          "uri": "spotify:album:5OZgDtx180ZZPMpm36J2zC"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/12Chz98pHFMPJEknJQMWvI"
            },
            "href": "https://api.spotify.com/v1/artists/12Chz98pHFMPJEknJQMWvI",
            "id": "12Chz98pHFMPJEknJQMWvI",
            "name": "Muse",
            "type": "artist",
            "uri": "spotify:artist:12Chz98pHFMPJEknJQMWvI"
          }
        ],
        "disc_number": 1,
        "duration_ms": 235600,
        "explicit": false,
        "external_ids": {
          "isrc": "GBAHT1800405"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/3eSyMBd7ERw68NVB3jlRmW"
        },
        "href": "https://api.spotify.com/v1/tracks/3eSyMBd7ERw68NVB3jlRmW",
        "id": "3eSyMBd7ERw68NVB3jlRmW",
        "is_local": false,
        "name": "Pressure",
        "popularity": 70,
        "preview_url": "https://p.scdn.co/mp3-preview/261288083ebf6c294ee89f868bb1b3040c18346f?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 3,
        "type": "track",
        "uri": "spotify:track:3eSyMBd7ERw68NVB3jlRmW"
      }
    ],
    "limit": 2,
    "next": "https://api.spotify.com/v1/search?query=Muse&type=track&market=FR&offset=2&limit=2",
    "offset": 0,
    "previous": null,
    "total": 14168
  }
}
```

- Requêtes de playlists
```
{
  "playlists": {
    "href": "https://api.spotify.com/v1/search?query=Muse&type=playlist&market=FR&offset=0&limit=2",
    "items": [
      {
        "collaborative": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/playlist/37i9dQZF1DWTG97QsiXgEX"
        },
        "href": "https://api.spotify.com/v1/playlists/37i9dQZF1DWTG97QsiXgEX",
        "id": "37i9dQZF1DWTG97QsiXgEX",
        "images": [
          {
            "height": null,
            "url": "https://pl.scdn.co/images/pl/default/6ece5e1a2bfadd82e5126e3fdafe959f5b2ec074",
            "width": null
          }
        ],
        "name": "This Is Muse",
        "owner": {
          "display_name": "Spotify",
          "external_urls": {
            "spotify": "https://open.spotify.com/user/spotify"
          },
          "href": "https://api.spotify.com/v1/users/spotify",
          "id": "spotify",
          "type": "user",
          "uri": "spotify:user:spotify"
        },
        "primary_color": null,
        "public": null,
        "snapshot_id": "MTU0ODY2NzE3NywwMDAwMDAyMzAwMDAwMTY4MzJjMWFhNjYwMDAwMDE2ODkzYzFjYTQ1",
        "tracks": {
          "href": "https://api.spotify.com/v1/playlists/37i9dQZF1DWTG97QsiXgEX/tracks",
          "total": 50
        },
        "type": "playlist",
        "uri": "spotify:playlist:37i9dQZF1DWTG97QsiXgEX"
      },
      {
        "collaborative": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/playlist/2Tg6Pz4Ol2pnsshGBjraoL"
        },
        "href": "https://api.spotify.com/v1/playlists/2Tg6Pz4Ol2pnsshGBjraoL",
        "id": "2Tg6Pz4Ol2pnsshGBjraoL",
        "images": [
          {
            "height": null,
            "url": "https://pl.scdn.co/images/pl/default/0f944d842a38b8e7d14b55b018810991359b7803",
            "width": null
          }
        ],
        "name": "Muse Complete",
        "owner": {
          "display_name": "muse_official",
          "external_urls": {
            "spotify": "https://open.spotify.com/user/muse_official"
          },
          "href": "https://api.spotify.com/v1/users/muse_official",
          "id": "muse_official",
          "type": "user",
          "uri": "spotify:user:muse_official"
        },
        "primary_color": null,
        "public": null,
        "snapshot_id": "MTU2LGU3N2MyNTUyMzAzZWZhM2U1NGE0YjFkZmZmNDQ0YjRhYWI3NzEwNTI=",
        "tracks": {
          "href": "https://api.spotify.com/v1/playlists/2Tg6Pz4Ol2pnsshGBjraoL/tracks",
          "total": 121
        },
        "type": "playlist",
        "uri": "spotify:playlist:2Tg6Pz4Ol2pnsshGBjraoL"
      }
    ],
    "limit": 2,
    "next": "https://api.spotify.com/v1/search?query=Muse&type=playlist&market=FR&offset=2&limit=2",
    "offset": 0,
    "previous": null,
    "total": 29642
  }
}
```

## 3. Requêtes PUT/POST
:warning: Ces requêtes peuvent générer l'erreur *411 : POST requests require a Content-Length header*

Dans ce cas, préciser le paramètre *-d ""* en fin de requête

- Pause / Resume
```
-X PUT "https://api.spotify.com/v1/me/player/pause" -d ""
-X PUT "https://api.spotify.com/v1/me/player/play" -d ""
```

- Previous / Next track
```
-X POST "https://api.spotify.com/v1/me/player/previous" -d ""
-X POST "https://api.spotify.com/v1/me/player/next" -d ""
```

## -> Lancer un morceau
:warning: S'il n'y a pas de _active_device_, il faut récupérer un _device_id_ d'abord

:warning: On ne peut pas préciser l'URI d'un seul morceau : c'est soit une liste de morceau soit un album/playlist/artiste

:warning: Attention à ne pas préciser une _position_ qui dépasse de la liste donnée !

- Lancer un album sans active_device
```
-X "PUT" "https://api.spotify.com/v1/me/player/play"
--data "{\"context_uri\":\"spotify:album:5xyqe6osNs777D8yb5uxOx\"}"
```

- Lancer un album avec active_device
```
-X "PUT" "https://api.spotify.com/v1/me/player/play?device_id=426b69956057c08cae7412096880367d88fa2856"
--data "{\"context_uri\":\"spotify:album:5xyqe6osNs777D8yb5uxOx\"}"
```

- Lancer une liste de morceaux avec active_device
```
-X "PUT" "https://api.spotify.com/v1/me/player/play?device_id=426b69956057c08cae7412096880367d88fa2856"
--data "{\"uris\":[\"spotify:track:561F1zqRwGPCTMRsLsXVtL\",\"spotify:track:51ueZKM83MTRv9rgiDfI6Y\"]}"
```