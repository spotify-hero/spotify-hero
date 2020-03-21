PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

CREATE TABLE Track(
TrackURI VARCHAR PRIMARY KEY NOT NULL CHECK (TrackURI <> ""),
Trackname VARCHAR NOT NULL CHECK (Trackname <> ""),
Trackartist VARCHAR NOT NULL CHECK (Trackartist <> ""),
Trackcover VARCHAR NOT NULL CHECK (Trackcover <> ""),
Trackdelay INTEGER NOT NULL CHECK (Trackdelay <> ""),
OSUfile VARCHAR NOT NULL CHECK (OSUfile <> "")
);

INSERT INTO "Track" VALUES('spotify:track:6ocbgoVGwYJhOv1GgI9NsF','7 rings','Ariana Grande','https://i.scdn.co/image/4edc7914bfab6ecb0a0faa49e09b33557009c1b0',-1600,'7_rings.osu');
INSERT INTO "Track" VALUES('spotify:track:1s2I9Q7zAE78m7aVZOq3ug','Bang Bang - My Baby Shot Me Down','Nancy Sinatra','https://i.scdn.co/image/1cb78817cd9d4a80757677e87a99ad701cfdebc0',0,'bang_bang.osu');
INSERT INTO "Track" VALUES('spotify:track:48UPSzbZjgc449aqz8bxox','Californication','Red Hot Chili Peppers','https://i.scdn.co/image/260c7a6da14bb13a4cc9e75bf5b549fb87fa22a9',0,'californication.osu');
INSERT INTO "Track" VALUES('spotify:track:5mEqD00bdFcsiVd0MfvEeF','Dream lantern','RADWIMPS','https://i.scdn.co/image/230df97a65b453292f4fcc41f93a5738a6cd3ddb',0,'dream_lantern.osu');
INSERT INTO "Track" VALUES('spotify:track:40YcuQysJ0KlGQTeGUosTC','Me, Myself & I','G-Eazy','https://i.scdn.co/image/f1442f362d4bd0d3906923a4895cb8896c6e2fbe',0,'me_myself_and_i.osu');
INSERT INTO "Track" VALUES('spotify:track:6fgbQt13JlpN59PytgTMsA','Snow (Hey Oh)','Red Hot Chili Peppers','https://i.scdn.co/image/5d7c133b41bf90b7ea1cdbc326ad18df4310c935',-1600,'snow.osu');
INSERT INTO "Track" VALUES('spotify:track:1NeLwFETswx8Fzxl2AFl91','Something About Us','Daft Punk','https://i.scdn.co/image/1a9dab25976c706fffccb6bf2cf8a6f5eadd0d29',0,'something_about_us.osu');
INSERT INTO "Track" VALUES('spotify:track:3e9HZxeyfWwjeyPAMmWSSQ','thank u, next','Ariana Grande','https://i.scdn.co/image/4edc7914bfab6ecb0a0faa49e09b33557009c1b0',-1500,'thank_u_next.osu');
INSERT INTO "Track" VALUES('spotify:track:2DLrgv7HhJanCuD8L9uJLR','Zenzenzense - movie ver.','RADWIMPS','https://i.scdn.co/image/230df97a65b453292f4fcc41f93a5738a6cd3ddb',0,'zenzenzense.osu');
INSERT INTO "Track" VALUES('spotify:track:1v7L65Lzy0j0vdpRjJewt1','Lose Yourself - From "8 Mile" Soundtrack','Eminem','https://i.scdn.co/image/05d67c2e30f5111a88cd29380eeb6a3bae442f33',0,'lose_yourself.osu');
INSERT INTO "Track" VALUES('spotify:track:4BgJZJW9b24DEt3ONiAIQP','Venom','Warriyo','https://i.scdn.co/image/58c8cab6d6fb96681086f6fdae3f88bf1cc6318a',-800,'venom.osu');
INSERT INTO "Track" VALUES('spotify:track:2QOoh5aipNI9tW94OGirkO','Putin, Putout','Klemen Slakonja','https://i.scdn.co/image/0cae9e789e9b0ab055a72c44afc5c551ba7983df',0,'undefined');

CREATE TABLE MP3(
Filename VARCHAR PRIMARY KEY NOT NULL CHECK (Filename <> ""),
Trackname VARCHAR NOT NULL CHECK (Trackname <> ""),
Trackartist VARCHAR NOT NULL CHECK (Trackartist <> ""),
Trackdelay INTEGER NOT NULL CHECK (Trackdelay <> ""),
OSUfile VARCHAR NOT NULL CHECK (OSUfile <> "")
);

INSERT INTO "MP3" VALUES('magic.mp3', 'Magic', 'Nhato', 0, 'nhato_magic.osu');

CREATE TABLE User (
UserURI VARCHAR PRIMARY KEY NOT NULL CHECK (UserURI <> ""),
Username VARCHAR NOT NULL CHECK (Username <> ""),
Country VARCHAR NOT NULL CHECK (Country <> ""),
Picture VARCHAR NOT NULL CHECK (Picture <> "")
);

INSERT INTO "User" VALUES('spotify:user:11133957842','Gabriel Forien','FR','https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/60669502_3222224824458217_8356717657373802496_n.jpg?_nc_cat=108&_nc_ht=scontent.xx&oh=3a118fe8147b9da76ef2b6e51b4e9743&oe=5D9D342B');
INSERT INTO "User" VALUES('spotify:user:9fe55lgmzzjfc1fi778jp3lrh','Cécile','FR','https://profile-images.scdn.co/images/userprofile/default/dbc988fae1944eeb4daab4b472ac0269115493bc');

CREATE TABLE Score (
UserURI VARCHAR NOT NULL CHECK (UserURI <> ""),
Timestamp DATETIME NOT NULL DEFAULT (GETDATE()),
Scorevalue INTEGER NOT NULL CHECK (Scorevalue <> ""),
TrackURI VARCHAR NOT NULL CHECK (TrackURI <> ""),
FOREIGN KEY(TrackURI) REFERENCES Track(TrackURI),
FOREIGN KEY(UserURI) REFERENCES User(UserURI),
PRIMARY KEY(UserURI, Timestamp)
);

COMMIT;