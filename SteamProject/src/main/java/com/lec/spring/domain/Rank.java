package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "S_rank")
public class Rank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Long appId;

    @Column(length = 100)
    private String gameName;

    @Column(name = "last_update")
    private Long lastUpdate;

    @Column(name = "game_rank")
    private Long rank;

    private Long concurrentInGame;
}