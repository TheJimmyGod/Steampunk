select * FROM S_GameDTO;
select * FROM S_Game;
select * FROM S_Game where appId = 221100;
select count(*) from S_Game where appId = 10;
select count(*) From S_Game;
delete FROM S_Game where appId = 0;
delete FROM S_Game where id > 10000;

SELECT * FROM S_News;
SELECT count(*) FROM S_News where is_free = false;
SELECT count(*) from S_News;
DELETE FROM S_News where appId = 10;
ALTER TABLE S_News AUTO_INCREMENT = 1;
Drop table if exists S_News;