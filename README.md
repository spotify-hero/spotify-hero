# spotify-hero :video_game::headphones::musical_score:
[![Build Status](https://travis-ci.org/spotify-hero/spotify-hero.svg?branch=master)](https://travis-ci.org/spotify-hero/spotify-hero)
[![Heroku](https://img.shields.io/badge/heroku-open-blueviolet)](https://spotify-hero.herokuapp.com/)
[![CodeFactor](https://www.codefactor.io/repository/github/spotify-hero/spotify-hero/badge)](https://www.codefactor.io/repository/github/spotify-hero/spotify-hero)
[![License](https://img.shields.io/static/v1.svg?label=License&message=CC%20BY-NC-SA%204.0&color=ff69b4&style=flat)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

#### Play Guitar Hero -ish game with your favorite Spotify playlist, custom music scores from the worldwide .osu database and record your own !
<p style = text-align:center;>
    <img  src="https://upload.wikimedia.org/wikipedia/fr/3/38/Guitar_Hero_Logo.png" alt="Guitar Hero" height="145" width="199">
    <img src="https://www.neonmag.fr/content/uploads/2019/04/color-spotify-logo.jpg" alt="Spotify" height="145" width="214">
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Osu_new_logo.png" alt="Osu" height="145" width="145">
</p>

## Table of Contents

- [Background](#background)
- [Features](#features)
- [Play](#play)
- [Install](#install)
- [Sources](#sources)
- [License](#license)

## Background

Spotify-hero started for several reasons :
* lack of good web platform to play osu!mania/Guitar-Hero style games
* using famous solutions like [OSU](https://osu.ppy.sh/home) requires to download the beatmaps wanted on the device before playing : making the game painful when it comes to change from a device to another
* no real cross-platform version PC & Android/IOS
* copyright issues faced by OSU when it comes to download/upload tracks made by users using Copyrighted songs : (.osz files for example [here](https://osu.ppy.sh/beatmapsets/745984#osu/1572427) contains an illegal version of the song encoded in mp3)

We decided to start coding **spotify-hero** during a Web Development course at [INSA Lyon](https://www.insa-lyon.fr/) as the final project and to continue it even after being graded :construction_worker::chart_with_upwards_trend:.

## Features
* play osu!mania/Guitar-Hero style game with 4 rows of incoming notes
* use Spotify account to play copyrighted music 
* allow users to create their own beatmpas : recording notes played by user and associate spotify tracks

## Play

**Walkthrough**
1. Click [here](https://spotify-hero.herokuapp.com/) to open the app in your browser
2. Click on
    * **Play** if you have a **premium** Spotify account (recommended to be able to play our entire database) and **login** with your account
    * **try-me** if you don't and want to play with the few MP3s we uploaded
3. Select a track by clicking on its album's cover
4. Enjoy ! :tada:

## Install

> First you have to set-up your developper account [here](https://developer.spotify.com/), create a new app (i.e "spotify-hero") and defined a redirect URL : http://localhost:8888/spotify_cb/

```bash
git clone https://github.com/spotify-hero/spotify-hero-Hero.git
cd spotify-hero-Hero
npm install
```
> Now we will use **Client ID** and **Client Secret** for your new app on the Spotify Developper Dashboard

Create the following file *run.sh* with the following scipt :
``` bash
#!/bin/bash
PORT=8888 CLIENT_ID=YOUR_CLIENT_ID CLIENT_SECRET=YOUR_CLIENT_SECRET REDIRECT_URI=http://localhost:8888/spotify_cb/ nodemon index.js
```

## Sources
First, we are very grateful to [@jyschwrtz](https://github.com/jyschwrtz) who allowed us, with his projet [JS-Hero](https://github.com/jyschwrtz/JS-Hero), to start from a solid codebase using [three.js](https://threejs.org/)

We also found very useful ressources which helped us a lot :children_crossing:
- [the Spotify Web SDK quickstart](https://developer.spotify.com/documentation/web-playback-sdk/quick-start/)
- [the Spotify API Oauth examples](https://github.com/spotify/web-api-auth-examples)
- [Spotify API](https://developer.spotify.com/console/albums/)
- [Documentation for three.js](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)

## License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />(This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License)</a>.
#### [Antoine BALLIET](https://github.com/aballiet) - [Gabriel FORIEN](https://github.com/gforien) - [Cécile POUPON](https://github.com/ceciiile)
![Logo INSA Lyon](https://upload.wikimedia.org/wikipedia/commons/b/b9/Logo_INSA_Lyon_%282014%29.svg)
