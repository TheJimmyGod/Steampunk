package com.lec.spring.service;

import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;
import com.lec.spring.domain.UserDTO;
import com.lec.spring.repository.AuthorityRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, AuthorityRepository authorityRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authorityRepository = authorityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(UserDTO userDTO) {
        User user = User.builder()
                .username(userDTO.getUsername())
                .password(userDTO.getPassword())
                .re_password(userDTO.getRe_password())
                .address_main(userDTO.getAddress_main())
                .address_sub(userDTO.getAddress_sub())
                .birth(userDTO.getBirth())
                .build();

        String username = user.getUsername();
        String password = user.getPassword();
        String re_password = user.getRe_password();

        if(userRepository.existsByUsername(username)){
            System.out.println(0);
            return null;  // 회원 가입 실패
        }
        if(password == null || password.trim().isEmpty())
        {
            System.out.println(1);
            return null;
        }

        if(!password.equals(re_password))
        {
            System.out.println(2);
            return null;
        }
        user.setUsername(user.getUsername().toUpperCase());
        user.setPassword(passwordEncoder.encode(password));
        user.setAddress_main(user.getAddress_main());
        user.setAddress_sub(user.getAddress_sub());
        user.setBirth(user.getBirth());
        Authority auth = authorityRepository.findByName((!userDTO.getAdmin()) ? "ROLE_MEMBER"
                : "ROLE_ADMIN").orElse(null);
        if(auth == null)
        {
            auth = new Authority();
            auth.setName((!userDTO.getAdmin()) ? "ROLE_MEMBER" : "ROLE_ADMIN");
            authorityRepository.save(auth);
        }
        user.addAuthorities(auth);
        userRepository.save(user);
        return user;
    }

    public User ResetPassword(Long id, String newPassword)
    {
        User user = userRepository.findById(id).orElse(null);
        if(user == null)
            return null;

        user.setPassword(passwordEncoder.encode(newPassword));
        return user;
    }

    public User Find(String username) {return userRepository.findByUsername(username);}
    public Long FindPassword(String username, String birth){
        System.out.println(username);
        User user = userRepository.findByUsername(username);
        if(user == null)
        {
            System.out.println("0");
            return -1L;
        }
        if(birth.length() <= 8)
        {
            System.out.println("1");
            SimpleDateFormat dtFormat = new SimpleDateFormat("yyyy-MM-dd");
            birth = dtFormat.format(birth);
        }
        System.out.println(birth + " " + user.getBirth());
        System.out.println("2");
        if(birth.equals(user.getBirth()))
            return user.getId();
        return -1L;
    }
    public User findById(Long id) {return userRepository.findById(id).orElse(null);}
    public List<User> FindAll() {return userRepository.findAll();}
}
