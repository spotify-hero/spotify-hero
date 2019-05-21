# Requêtes à la BDD SQL

##1. Tables
```sql
> .tables                       -- print tables
> .schema TABLE                 -- print table composition
```

##2. Génération
```sql
CREATE TABLE Track(
TrackURI VARCHAR PRIMARY KEY NOT NULL CHECK (TrackURI <> ""),
Trackname VARCHAR NOT NULL CHECK (Trackname <> ""),
Trackartist VARCHAR NOT NULL CHECK (Trackartist <> ""),
Trackcover VARCHAR NOT NULL CHECK (Trackcover <> ""),
Trackdelay INTEGER NOT NULL CHECK (Trackdelay <> ""),
OSUfile VARCHAR NOT NULL CHECK (OSUfile <> "")
);

CREATE TABLE User (
UserURI VARCHAR PRIMARY KEY NOT NULL CHECK (UserURI <> ""),
Username VARCHAR NOT NULL CHECK (Username <> ""),
Country VARCHAR NOT NULL CHECK (Country <> ""),
Picture VARCHAR NOT NULL CHECK (Picture <> "")
);

CREATE TABLE Score (
UserURI VARCHAR NOT NULL CHECK (UserURI <> ""),
Timestamp VARCHAR NOT NULL CHECK (Timestamp <> ""),
Scorevalue INTEGER NOT NULL CHECK (Scorevalue <> ""),
TrackURI VARCHAR NOT NULL CHECK (TrackURI <> ""),
FOREIGN KEY(TrackURI) REFERENCES Track(TrackURI),
FOREIGN KEY(UserURI) REFERENCES User(UserURI),
PRIMARY KEY(UserURI, Timestamp)
);
```

##3. Valeurs
```sql
spotify:track:4BgJZJW9b24DEt3ONiAIQP|Venom|Warriyo|https://i.scdn.co/image/58c8cab6d6fb96681086f6fdae3f88bf1cc6318a|-800|warriyo_venom.osu
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


##4. INSERT INTO
```javascript
let db_init = `INSERT INTO Track (TrackURI, Trackname, Trackartist, Trackcover, Trackdelay, OSUfile)
VALUES("spotify:track:4BgJZJW9b24DEt3ONiAIQP", "Venom", "Warriyo", "", "-800", "warriyo_venom.osu");
VALUES("spotify:track:6ocbgoVGwYJhOv1GgI9NsF", "7 Rings", "Ariana Grande", "", "0", "7_rings.osu");
VALUES("spotify:track:48UPSzbZjgc449aqz8bxox", "Californication", "Red Hot Chili Peppers", "", "0", "californication.osu");
`;
db.run(db_init, function(err){
  if (err) {
      return console.log(err.message);
  }
  console.log("succes!");
});
```


##5. URIs d'albums
spotify:album:6oX7kNKqj9dwNk8i4btVcF
spotify:album:3jqQFIXUakuDXdhFVvI7Ko
spotify:album:2fYhqwDWXjbpjaIJPEfKFw


##6. dbdiagram.i
```sql
TABLE Track
{
  TrackURI text [pk]
  Trackname text [not null]
  Trackartist text [not null]
  Trackcover text [not null]
  Trackdelay int [not null]
  OSUfile text [not null]
}

TABLE Score
{
  UserURI text [pk]
  Timestamp text [pk]
  Scorevalue int [not null]
  SpotifyURI text [not null]
}
Ref: Score.UserURI >  User.UserURI
Ref: Score.SpotifyURI > Track.TrackURI

Table User
{
  UserURI text [pk]
  Username text [not null]
  Country text [not null]
  Picture text [not null]
}
```