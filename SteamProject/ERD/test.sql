
select * from s_game;



select *
from s_rank;

select * from s_news where appId = 10;

DELETE FROM s_rank;
ALTER TABLE s_rank DROP COLUMN id;

DROP TABLE s_rank;
DRop TABLE s_news;
DRop TABLE f_games;

select * from f_games;

ALTER TABLE f_games MODIFY COLUMN id BIGINT AUTO_INCREMENT;
