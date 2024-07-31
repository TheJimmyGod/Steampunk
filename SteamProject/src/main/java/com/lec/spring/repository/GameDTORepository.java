package com.lec.spring.repository;

import com.lec.spring.domain.GameDTO;
import org.springframework.data.repository.CrudRepository;

public interface GameDTORepository extends CrudRepository<GameDTO, Long> {
}
