package com.lec.spring.config.oauth;

import com.lec.spring.config.PrincipalDetails;
import com.lec.spring.config.oauth.provider.GoogleUserInfo;
import com.lec.spring.config.oauth.provider.OAuth2UserInfo;
import com.lec.spring.domain.User;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

//@Service
//public class PrincipalOauth2UserService extends DefaultOAuth2UserService {
//    @Autowired
//    private UserService userService;
//
////    @Value("${app.oauth2.password}")
//    private String oauth2Password;
//
//    @Override
//    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
//        System.out.println("OAuth2UserService.loadUser() 호출");
//
//        OAuth2User oAuth2User = super.loadUser(userRequest);  // 사용자 프로필 정보 가져오기
//        // 어떠한 정보가 넘어오는지 확인
//        System.out.println("""
//             ClientRegistration: %s
//             RegistrationId: %s
//             AccessToken: %s
//             OAuth2User Attributes : %s
//           """.formatted(
//                userRequest.getClientRegistration()    // ClientRegistration
//                , userRequest.getClientRegistration().getRegistrationId()   // id?
//                , userRequest.getAccessToken().getTokenValue()  // access token
//                , oAuth2User.getAttributes()    // Map<String, Object>  <- 사용자 프로필 정보
//        ));
//
//        // 후처리: 회원가입
//        String provider = userRequest.getClientRegistration().getRegistrationId();  // ex: "google
//
//        OAuth2UserInfo oAuth2UserInfo;
//        if (provider.equalsIgnoreCase("google")) {
//            oAuth2UserInfo = new GoogleUserInfo(oAuth2User.getAttributes());
//        } else {
//            oAuth2UserInfo = null;
//        }
//
//        String providerId = null;
//        if (oAuth2UserInfo != null) {
//            providerId = oAuth2UserInfo.getProviderId();
//        }
//        String username = provider + "_" + providerId;  // ex) "google_xxxxx"
//        String password = oauth2Password;
//        User user = userService.Find(username);
//        if(user == null)
//        {
//            User newUser = User.builder()
//                    .username(username)
//                    .password(password)
//                    .address_main("입력 필요")
//                    .address_sub("입력 필요")
//                    .provider(provider)
//                    .providerId(providerId)
//                    .build();
//            User registedUser = userService.register(newUser);
//            if(registedUser != null)
//                System.out.println("[OAuth2 인증. 회원 가입 성공]");
//            else
//                System.out.println("[OAuth2 인증. 회원 가입 실패!]");
//        }else {
//            System.out.println("[OAuth2 인증. 이미 가입된 회원입니다]");
//        }
//        PrincipalDetails principalDetails = new PrincipalDetails(user, oAuth2User.getAttributes());
//        principalDetails.setUserService(userService);
//        return null;
//    }
//}
