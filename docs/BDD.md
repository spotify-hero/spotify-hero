# Requêtes à la BDD SQL

##1. Basics
```sql
> .tables                       -- print tables
> .schema TABLE                 -- print table composition
```
```bash
$ sqlite3 main.db .schema > docs/schema.sql
$ sqlite3 main.db .dump > docs/dump.sql
```

##2. Génération de la table
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
Timestamp DATETIME NOT NULL DEFAULT (GETDATE()),
Scorevalue INTEGER NOT NULL CHECK (Scorevalue <> ""),
TrackURI VARCHAR NOT NULL CHECK (TrackURI <> ""),
FOREIGN KEY(TrackURI) REFERENCES Track(TrackURI),
FOREIGN KEY(UserURI) REFERENCES User(UserURI),
PRIMARY KEY(UserURI, Timestamp)
);
```


##6. dbdiagram.io
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