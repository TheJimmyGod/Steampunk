package com.lec.spring.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Featured;
import com.lec.spring.repository.FeaturedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class FeaturedService {
    private final FeaturedRepository featuredRepository;

    @Transactional
    public Featured saveFeaturedGames (Featured featured) { return featuredRepository.save(featured);}

    @Transactional
    public List<Featured> findAll () {return featuredRepository.findAll();}
}
