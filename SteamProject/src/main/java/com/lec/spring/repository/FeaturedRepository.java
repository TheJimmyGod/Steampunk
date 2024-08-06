package com.lec.spring.repository;

import com.lec.spring.domain.Featured;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeaturedRepository extends JpaRepository <Featured, Long> {
}
