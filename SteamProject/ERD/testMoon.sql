select * FROM S_GameDTO;
select * FROM S_Game;
select * FROM S_Game where appId = 221100;
select count(*) from S_Game where appId = 10;
select count(*) From S_Game;
delete FROM S_Game where appId = 0;
delete FROM S_Game where id > 10000;
INSERT INTO S_Game (appId) VALUES (10);
INSERT INTO S_Game (appId) VALUES (20);
INSERT INTO S_Game (appId) VALUES (30);
INSERT INTO S_Game (appId) VALUES (40);
INSERT INTO S_Game (appId) VALUES (50);
INSERT INTO S_Game (appId) VALUES (60);
INSERT INTO S_Game (appId) VALUES (70);
INSERT INTO S_Game (appId) VALUES (80);
INSERT INTO S_Game (appId) VALUES (30);

delete FROM S_Game where id = 130;