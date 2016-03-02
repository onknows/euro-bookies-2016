CREATE DATABASE bookies;

USE bookies;

CREATE TABLE teams
(
  id int NOT NULL AUTO_INCREMENT,
  teamName varchar(255) NOT NULL,
  countryCode varchar(255) NOT NULL,
  PRIMARY KEY(ID)
)

INSERT INTO teams (teamname, countryCode) VALUES ('Oranje', 'nl');
INSERT INTO teams (teamname, countryCode) VALUES ('Germany', 'de');
INSERT INTO teams (teamname, countryCode) VALUES ('Belgium', 'be');
INSERT INTO teams (teamname, countryCode) VALUES ('Spain', 'es');