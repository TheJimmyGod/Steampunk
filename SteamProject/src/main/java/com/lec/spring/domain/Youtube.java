package com.lec.spring.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "S_Youtube")
public class Youtube {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
}
