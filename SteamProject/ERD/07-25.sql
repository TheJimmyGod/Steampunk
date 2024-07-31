
CREATE TABLE Authority
(
  id   INT         NOT NULL AUTO_INCREMENT,
  role VARCHAR(50) NULL    ,
  PRIMARY KEY (id)
) COMMENT '권한';

ALTER TABLE Authority
  ADD CONSTRAINT UQ_role UNIQUE (role);

CREATE TABLE Comment
(
  id      INT          NOT NULL AUTO_INCREMENT,
  content VARCHAR(200) NOT NULL,
  regDate DATETIME     NULL     DEFAULT now(),
  NewsId  INT          NOT NULL,
  UserId  INT          NOT NULL,
  PRIMARY KEY (id)
) COMMENT '댓글';

CREATE TABLE Game
(
  appId             INT           NOT NULL,
  gameName          VARCHAR(1000)  NOT NULL,
  developers        VARCHAR(500)  NOT NULL,
  is_free           BOOLEAN       NOT NULL,
  header_Image      VARCHAR(2000) NULL    ,
  capsule_Image     VARCHAR(2000) NULL    ,
  short_description VARCHAR(2000) NULL    ,
  minimum           VARCHAR(2000) NULL    ,
  recommended       VARCHAR(2000) NULL    ,
  price             VARCHAR(50)   NULL     DEFAULT "0",
  discount          INT           NULL     DEFAULT 0,
  genres            VARCHAR(1000) NULL    ,
  website           VARCHAR(1000) NULL    ,
  release_date      VARCHAR(20)   NULL    ,
  PRIMARY KEY (appId)
) COMMENT '게임';

CREATE TABLE MyGame
(
  id    INT NOT NULL,
  appId INT NOT NULL,
  PRIMARY KEY (id, appId)
) COMMENT '마이게임';

CREATE TABLE News
(
  id      INT          NOT NULL AUTO_INCREMENT,
  title   VARCHAR(200) NOT NULL,
  content VARCHAR(200) NOT NULL,
  url     VARCHAR(500) NULL    ,
  author  VARCHAR(50)  NULL     DEFAULT unknown,
  regDate DATETIME     NOT NULL,
  appId   INT          NOT NULL,
  PRIMARY KEY (id)
) COMMENT '뉴스';

CREATE TABLE User
(
  id       INT          NOT NULL AUTO_INCREMENT,
  username VARCHAR(50)  NOT NULL,
  password VARCHAR(20)  NOT NULL,
  address  VARCHAR(200) NOT NULL,
  birth    VARCHAR(20)  NOT NULL,
  regDate  DATETIME     NULL     DEFAULT now(),
  PRIMARY KEY (id)
) COMMENT '유저';

ALTER TABLE User
  ADD CONSTRAINT UQ_username UNIQUE (username);

CREATE TABLE User_Authorities
(
  Auth_id INT NOT NULL,
  User_id INT NOT NULL,
  PRIMARY KEY (Auth_id, User_id)
) COMMENT '권한테이블';

ALTER TABLE News
  ADD CONSTRAINT FK_Game_TO_News
    FOREIGN KEY (appId)
    REFERENCES Game (appId);

ALTER TABLE MyGame
  ADD CONSTRAINT FK_User_TO_MyGame
    FOREIGN KEY (id)
    REFERENCES User (id);

ALTER TABLE MyGame
  ADD CONSTRAINT FK_Game_TO_MyGame
    FOREIGN KEY (appId)
    REFERENCES Game (appId);

ALTER TABLE User_Authorities
  ADD CONSTRAINT FK_User_TO_User_Authorities
    FOREIGN KEY (User_id)
    REFERENCES User (id);

ALTER TABLE Comment
  ADD CONSTRAINT FK_News_TO_Comment
    FOREIGN KEY (NewsId)
    REFERENCES News (id);

ALTER TABLE Comment
  ADD CONSTRAINT FK_User_TO_Comment
    FOREIGN KEY (UserId)
    REFERENCES User (id);

ALTER TABLE User_Authorities
  ADD CONSTRAINT FK_Authority_TO_User_Authorities
    FOREIGN KEY (Auth_id)
    REFERENCES Authority (id);
