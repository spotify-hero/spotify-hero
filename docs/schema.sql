CREATE TABLE Track(                                                                                         
TrackURI VARCHAR PRIMARY KEY NOT NULL CHECK (TrackURI <> ""),                                               
Trackname VARCHAR NOT NULL CHECK (Trackname <> ""),                                                         
Trackartist VARCHAR NOT NULL CHECK (Trackartist <> ""),                                                     
Trackcover VARCHAR NOT NULL CHECK (Trackcover <> ""),                                                       
Trackdelay INTEGER NOT NULL CHECK (Trackdelay <> ""),                                                       
OSUfile VARCHAR NOT NULL CHECK (OSUfile <> "")                                                              
);                                                                                                          
CREATE TABLE MP3(                                                                                           
Filename VARCHAR PRIMARY KEY NOT NULL CHECK (Filename <> ""),                                               
Trackname VARCHAR NOT NULL CHECK (Trackname <> ""),                                                         
Trackartist VARCHAR NOT NULL CHECK (Trackartist <> ""),                                                     
Trackdelay INTEGER NOT NULL CHECK (Trackdelay <> ""),                                                       
Trackcover VARCHAR NOT NULL CHECK (Trackcover <> ""),                                                       
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