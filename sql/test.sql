-- create user table
CREATE TABLE user (
  id int NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  created DATE NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (id),
  UNIQUE (username)
);
-- create user cretification
CREATE TABLE user_credentials (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  grant_type VARCHAR(20) NOT NULL,
  credentials VARCHAR(255) NOT NULL,
  created DATE NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES user (id),
);