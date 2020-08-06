CREATE TABLE Users (
  ID int(11) NOT NULL AUTO_INCREMENT,
  UserName varchar(100) DEFAULT NULL,
  Name varchar(200) DEFAULT NULL,
  RUC int(50) DEFAULT NULL,
  Email varchar(100) DEFAULT NULL,
  Hash varchar(200) DEFAULT NULL,
  Salt varchar(200) DEFAULT NULL,
  RegisterDate datetime DEFAULT NULL,
  PRIMARY KEY (ID)
);
