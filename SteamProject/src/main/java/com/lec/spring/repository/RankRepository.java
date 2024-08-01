package com.lec.spring.repository;

import com.lec.spring.domain.Rank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RankRepository extends JpaRepository<Rank, Long> {
    Rank findByAppId (Long appId);

}
