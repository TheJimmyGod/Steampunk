package com.lec.spring.service;

import com.lec.spring.domain.Rank;
import com.lec.spring.repository.RankRepository;
import org.springframework.stereotype.Service;

@Service
public class RankService {

    private final RankRepository rankRepository;

    public RankService(RankRepository rankRepository) {
        this.rankRepository = rankRepository;
    }

    public Rank saveRank(Rank rank) {return rankRepository.save(rank);}

    public void deleteAllRanks() {
        rankRepository.deleteAll(); // rankRepository는 Rank 엔티티를 관리하는 JPA 리포지토리입니다.
    }

}
