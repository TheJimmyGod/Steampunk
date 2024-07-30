package com.lec.spring.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "S_GameDTO")
public class GameDTO {

    @Id
    private Long id;
    private String name;
}
