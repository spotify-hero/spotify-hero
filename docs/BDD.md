# Requêtes à la BDD SQL

##1. Tables
```sql
> .tables                       -- print tables
> .schema TABLE                 -- print table composition
```

##2. Génération
```sql
CREATE TABLE Track(
TrackURI TEXT PRIMARY KEY,
Trackname TEXT NOT NULL,
Trackartist TEXT NOT NULL,
Trackcover TEXT NOT NULL,
OSUfile TEXT NOT NULL
);

CREATE TABLE Score (
Username TEXT NOT NULL,
Timestamp TEXT NOT NULL,
Scorevalue INTEGER NOT NULL,
SpotifyURI TEXT NOT NULL,
FOREIGN KEY(SpotifyURI) REFERENCES Track(TrackURI),
PRIMARY KEY(Username, Timestamp)
);
```

##3. Valeurs
```sql
CREATE TABLE Track(
TrackURI TEXT PRIMARY KEY,
OSUfile TEXT NOT NULL
);

insert into track values('spotify:track:6ocbgoVGwYJhOv1GgI9NsF', '7_rings');
insert into track values('spotify:track:1s2I9Q7zAE78m7aVZOq3ug', 'bang_bang');
insert into track values('spotify:track:48UPSzbZjgc449aqz8bxox', 'californication');
insert into track values('spotify:track:5mEqD00bdFcsiVd0MfvEeF', 'dream_lantern');
insert into track values('spotify:track:40YcuQysJ0KlGQTeGUosTC', 'me_myself_and_i');
insert into track values('spotify:track:6fgbQt13JlpN59PytgTMsA', 'snow');
insert into track values('spotify:track:1NeLwFETswx8Fzxl2AFl91', 'something_about_us');
insert into track values('spotify:track:3e9HZxeyfWwjeyPAMmWSSQ', 'thank_u_next');
insert into track values('spotify:track:2DLrgv7HhJanCuD8L9uJLR', 'zenzenzense');
```


7_rings.osu
bang_bang.osu
californication.osu
dream_lantern.osu
map.osu
me_myself_and_i.osu
snow.osu
something_about_us.osu
thank_u_next.osu
zenzenzense.osu

spotify:track:6ocbgoVGwYJhOv1GgI9NsF
spotify:track:1s2I9Q7zAE78m7aVZOq3ug
spotify:track:48UPSzbZjgc449aqz8bxox
spotify:track:5mEqD00bdFcsiVd0MfvEeF
map
spotify:track:40YcuQysJ0KlGQTeGUosTC
spotify:track:6fgbQt13JlpN59PytgTMsA
spotify:track:1NeLwFETswx8Fzxl2AFl91
spotify:track:3e9HZxeyfWwjeyPAMmWSSQ
spotify:track:2DLrgv7HhJanCuD8L9uJLR


##5. URIs d'albums
spotify:album:6oX7kNKqj9dwNk8i4btVcF
spotify:album:3jqQFIXUakuDXdhFVvI7Ko
spotify:album:2fYhqwDWXjbpjaIJPEfKFw
