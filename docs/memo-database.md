# Mémo pour la gestion de la base de données :card_file_box::recycle:

##1. Gestion avec SQLite3 (file-based) :page_facing_up::card_file_box:
```bash
$ sqlite3 main.db
> .tables                       # print tables
> .schema Track                 # print table composition
> select * from Track;
> exit
$ sqlite3 main.db .schema > schema.sql
$ sqlite3 main.db .dump > dump.sql
$ sqlite3 backup.db < dump.sql
```
**Pros and cons :**
:white_check_mark: tout est contenu dans un fichier
:white_check_mark: facile à éditer / remplacer / sauvegarder
:x: la database est vulnérable car elle est directement sur le serveur
:x: pas d'encryption possible dans la version open-source de sqlite3

##2. Gestion avec PostGreSQL :muscle::card_file_box:
```bash
# initialisation de Heroku Postgres, installation de pgAdmin
# on crée la BDD dans pgAdmin, puis on la push
PS> pg_dump.exe > test.sql
PS> cat .\\test.sql | heroku pg:psql -a spotify-hero
# on peut aussi se connecter directement avec
PS> heroku pg:psql -a spotify-hero
spotify-hero::DATABASE=> SELECT * FROM osu;
```
**Pros and cons :**
:white_check_mark: +robuste
:white_check_mark: database réellement séparée du serveur Node
:x: +complexe à mettre en oeuvre

##3. Gestion avec ElasticSearch ? :fire::fire:

##Annexe: dbdiagram.io
```sql
TABLE osu
{
  osu_file text [pk]
  track_id text [not null]
  track_id_table text [not null]
  user_uri text [not null]
  popularity text [not null]
}

TABLE spotify
{
  track_uri text [pk]
  track_name text [not null]
  track_artist text [not null]
  track_cover text [not null]
  track_delay int [not null]
  osu_file text [not null]
}

TABLE mp3
{
  filename text [pk]
  track_name text [not null]
  track_artist text [not null]
  track_cover text [not null]
  track_delay int [not null]
  osu_file text [not null]
}

TABLE user
{
  user_uri text [pk]
  name text [not null]
  country text [not null]
  picture text [not null]
}

TABLE highscore
{
  user_uri text [pk]
  Timestamp text [pk]
  osu_file text [pk]
  highscore int [not null]
}
Ref: spotify.osu_file > osu.osu_file
Ref: mp3.osu_file > osu.osu_file
Ref: highscore.osu_file > osu.osu_file
Ref: highscore.user_uri >  user.user_uri
```