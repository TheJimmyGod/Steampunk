package com.lec.spring.service;

import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;
import com.lec.spring.repository.AuthorityRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, AuthorityRepository authorityRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authorityRepository = authorityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {
        String username = user.getUsername();
        String password = user.getPassword();
        String re_password = user.getRe_password();

        if(userRepository.existsByUsername(username)){
            System.out.println("1");
            return null;  // 회원 가입 실패
        }
        if(password == null || password.trim().isEmpty())
        {
            System.out.println("2");
            return null;
        }

        if(!password.equals(re_password))
        {
            System.out.println(password);
            System.out.println(re_password);
            return null;
        }
        user.setUsername(user.getUsername().toUpperCase());
        user.setPassword(passwordEncoder.encode(password));
        user.setAddress_main(user.getAddress_main());
        user.setAddress_main(user.getAddress_sub());
        user.setBirth(user.getBirth());
        Authority auth = authorityRepository.findByRole("ROLE_MEMBER");
        user.addAuthority(auth);
        return userRepository.save(user);
    }

    public User Find(String username) {return userRepository.findByUsername(username);}
    public User findById(Long id) {return userRepository.findById(id).orElse(null);}
    public List<User> FindAll() {return userRepository.findAll();}
}
