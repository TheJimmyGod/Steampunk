package com.lec.spring.controller;


import com.lec.spring.domain.Rank;
import com.lec.spring.service.RankService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/rank")
public class RankController {

    private final RankService rankService;

    public RankController(RankService rankService) {
        this.rankService = rankService;
    }

    @GetMapping("/findAllRank")
    public List<Rank> findAllRank(){return rankService.findAllRank();}

    @GetMapping("/findByRank")
    public List<Rank> findByRank(){
        return rankService.findByRank();
    }

    @GetMapping("/saveRank")
    public void getJsonRank() {
        rankService.saveRank();
    }
}
