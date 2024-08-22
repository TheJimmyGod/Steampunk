package com.lec.spring.service;

import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;
import com.lec.spring.domain.UserDTO;
import com.lec.spring.repository.AuthorityRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
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

    public User register(User user)
    {
        Authority auth = authorityRepository.findByName("ROLE_MEMBER").orElse(null);
        if(auth == null)
        {
            auth = new Authority();
            auth.setName("ROLE_MEMBER");
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
        var n_password = passwordEncoder.encode(newPassword);
        if(passwordEncoder.matches(user.getPassword(), n_password))
            return null;
        user.setPassword(n_password);
        return userRepository.save(user);
    }

    public User Update(Long id, UserDTO userDTO)
    {
        User user = userRepository.findById(id).orElse(null);
        if(user == null)
            return null;
        if(!userDTO.getPassword().isEmpty())
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setAddress_main(userDTO.getAddress_main());
        user.setAddress_sub(userDTO.getAddress_sub());
        user.setBirth(userDTO.getBirth());
        return userRepository.save(user);
    }

    public String Remove(Long id){
        User user = userRepository.findById(id).orElse(null);
        if(user == null)
            return "존재하지 않는 유저";
        String name = user.getUsername();
        userRepository.deleteById(id);
        return name + " 계정 탈퇴되었습니다.";
    }

    public User Find(String username) {return userRepository.findByUsername(username);}
    public Long FindPassword(String username, String birth) throws ParseException {
        System.out.println(username);
        User user = userRepository.findByUsername(username);
        if(user == null)
            return -1L;
        if(birth.equals(user.getBirth()))
            return user.getId();
        return -1L;
    }
    public User findById(Long id) {return userRepository.findById(id).orElse(null);}
    public List<User> FindAll() {return userRepository.findAll();}

    public User findBestScore() {
        Integer max = Integer.MIN_VALUE;
        List<User> users = FindAll();
        User best = null;
        for(var user : users)
        {
            if(user.getMiniGame_Score() != null && user.getMiniGame_Score() > max)
            {
                max = user.getMiniGame_Score();
                best = user;
            }
        }
        return best;
    }

    public boolean setScore(User user, Integer num){
        boolean newScore = (user.getMiniGame_Score() == null || user.getMiniGame_Score() < num);
        if(newScore)
        {
            user.setMiniGame_Score((num == null) ? 0 : num);
            userRepository.save(user);
        }
        return newScore;
    }
    @Transactional
    public List<User> getMiniGameRank(){
        List<User> list = userRepository.findAll();
        for(User user : list)
        {
            if(user.getMiniGame_Score() == null)
            {
                user.setMiniGame_Score(0);
                userRepository.save(user);
            }
        }

        list.sort(new Comparator<User>() {
            @Override
            public int compare(User o1, User o2) {
                return o1.getMiniGame_Score().compareTo(o2.getMiniGame_Score());
            }
        });
        if(list.size() > 10)
        {
            list = list.stream().limit(10).toList();
        }
        return list;
    }

}
