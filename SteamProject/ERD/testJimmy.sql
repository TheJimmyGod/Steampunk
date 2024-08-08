SELECT * FROM S_User;
SELECT * FROM S_Authority;
SELECT * FROM s_user_authorities;
SELECT * FROM S_Bookmark;

INSERT INTO S_Authority (name) VALUES ('ROLE_MEMBER'), ('ROLE_ADMIN');
Truncate s_authority;
DROP TABLE IF EXISTS s_user_authorities;
DROP TABLE IF EXISTS s_role;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS s_authority;
DROP TABLE IF EXISTS s_user;
DROP TABLE IF EXISTS s_user_games;
DROP TABLE IF EXISTS s_game;
DROP TABLE IF EXISTS S_Bookmark;
DROP TABLE IF EXISTS s_user_bookmarks;
DROP TABLE IF EXISTS s_news_bookmarks;

DROP TABLE IF EXISTS s_gamedto;
DROP TABLE IF EXISTS s_news;
DROP TABLE IF EXISTS s_rank;
DROP TABLE IF EXISTS steam_news.f_games;
show tables;

Truncate S_User;