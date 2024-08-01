package com.lec.spring.config;

import com.lec.spring.domain.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;

public class PrincipalDetails implements UserDetails {
    private final User user;

    public User getUser(){
        return this.user;
    }

    // 일반 로그인 용 생성자
    public PrincipalDetails(User user){
        System.out.println("UserDetails(user) 생성: " + user);
        this.user = user;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        System.out.println("getAuthorities() 호출");

        Collection<GrantedAuthority> collect = new ArrayList<>();
        System.out.println(user.getId() + " " + user.getUsername() + " " + (user.getAuthorities() == null ? "권한 없음" : user.getAuthorities().size()));
        // user.getRole() 은 현재 "ROLE_MEMBER,ROLE_ADMIN" 과 같은 형태이기에
        if(user.getAuthorities() == null ||
        user.getAuthorities().isEmpty()) return collect;

        for(var item : user.getAuthorities())
        {
            collect.add(new GrantedAuthority() {
                @Override
                public String getAuthority() {
                    return item.getName().trim();
                }

                @Override
                public String toString(){
                    return item.toString().trim();
                }
            });
        }
        return collect;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
