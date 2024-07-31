package com.lec.spring.domain;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "S_Rank")
public class Rank {

    @Id
    private Long id;

    @Column(length = 100)
    private String gameName;

    @Column(name="last_update")
    private Long lastUpdate;

    private Long rank;

    private Long concurrentInGame;


}
