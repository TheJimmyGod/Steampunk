package com.lec.spring.domain;

import jakarta.persistence.Column;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class UserDTO {
    private String username;
    private String password;
    private String re_password;
    private String address_main;
    private String address_sub;
    private String birth;
    private Boolean admin;
}
