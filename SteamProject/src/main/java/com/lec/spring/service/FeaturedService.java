package com.lec.spring.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.Featured;
import com.lec.spring.repository.FeaturedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Service
public class FeaturedService {
    private final FeaturedRepository featuredRepository;

    @Transactional
    public Featured saveFeaturedGames (Featured featured) { return featuredRepository.save(featured);}

    @Transactional
    public List<Featured> findAll () {return featuredRepository.findAll();}

    @Transactional
    public boolean updateFeatured(Featured[] featureds){
        List<Featured> curr = featuredRepository.findAll();
        for (var f : featureds)
        {
            if(curr.stream().noneMatch(z -> Objects.equals(z.getAppId(), f.getAppId())))
                featuredRepository.save(f);
        }
        return true;
    }

    @Transactional
    public String removeFeatured(Featured app){
        String name = app.getGameName();
        featuredRepository.delete(app);
        return name + " 가 삭제되었습니다.";
    }

    public Featured findByAppId(Long appId) {
        return featuredRepository.findByAppId(appId).orElse(null);
    }
}
