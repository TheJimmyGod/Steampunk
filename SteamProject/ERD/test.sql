
select * from s_game;

select *
from f_games;

select *
from s_rank;

DELETE FROM s_rank;
ALTER TABLE s_rank DROP COLUMN id;

DROP TABLE s_rank;

ALTER TABLE f_games MODIFY COLUMN id BIGINT AUTO_INCREMENT;
