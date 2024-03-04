***
## 🌿 서비스 소개 !

![Title](https://github.com/puru-puru/puru-puru-FE/assets/105138020/bd9ef7a4-60b7-48a8-b303-3b9fb2777c9f)
- **안녕하세요, 푸릇푸릇은 개인 성향에 맞는 반려 식물을 추천해주고, 키우는데 도움을 주는 서비스를 만들고 있습니다. 
  자신이 키우는 식물 일지를 작성하며 같이 성장하는 특별한 즐거움을 경험해요!**

***

## 🌱 Puru Puru 링크
- **도메인** - https://puru-puru.vercel.app/
- **FE Github** - https://github.com/puru-puru/puru-puru-FE.git
- **팀 브로슈어** - https://plum-robe-ea9.notion.site/eb76b2175c254486b52a353174d37d8a?pvs=4
- **Figma**

***

## ☘️ BACK-END 개발

|이름|분담|
|:---:|:---:|
|송우진| **로컬**( 회원가입, 로그인, 로그아웃, 닉네임 설정, 내 정보, 회원 탈퇴, 이용 약관, 인가 / 토큰 관리 ), <br> **OAuth2.0** ( 카카오 소셜 로그인, 구글 소셜 로그인 ), <br> **Github Action** ( CI/CD ) <br> **NGNIX** ( 로드밸런싱, HTTP → HTTPS 초기 설정 ), <br> **반려식물** ( CRUD 중 갤러리 부분 ), <br> **커뮤니티** ( CRUD ), <br> **AWS 서버 관리** (RDS, EC2, S3), <br> **SEEDER 데이터 입력/관리** |
|황정연| 담당 |
|정동현| 담당 |

***

## 🛠️ 주요기능

***

## 📜 서비스 아키텍처
<img width="1378" alt="서비스" src="https://github.com/puru-puru/puru-puru-BE/assets/152770526/e1263590-8686-4a6a-853f-09bc6e862cf4">

***

## 🗣️ 기술적 의사 결정

|사용 기술|기술 설명|
|:---:|:---:|
|Typescript|JavaScript로 개발하면 코드의 가독성과 유지보수성이 저하. 타입 오류를 빠르게 발견하고 타입 안정성을 높이기 위해 도입.|
|Sequelize|타입스크립트와 시퀄라이즈를 사용하면 확장 가능하고 유연한 애플리케이션을 개발 가능. 시퀄라이즈를 도입.|
|Nginx|비동기 처리와 이벤트 기반 아키텍처를 사용하여, 빠르고 경량화되면서 적은 리소스로 높은 처리량을 수행. 인프라 구축에 드는 시간을 단축시키고자 프록시 서버와 로드밸런싱의 역할로서 Nginx를 WAS로 선택|
|GtHub Actions|프론트엔드와 백엔드의 효율적인 협업을 위한 자동배포를 진행|

***

## 💥 트러블 슈팅

<details>
  <summary><b>1. NGINX ERROR & EC2 메모리 문제</b></summary>
  <div markdown="1">
    <ul>
      <li>1-1 : Typescript 사용시 웹 브라우저가 TS 파일을 읽지 못해 배포 환경에서 tsc -w 를 사용하여 TS 파일을 JS 파일로 변환시 EC2 서버의 메모리가 부족해 변환을 하지 못하는 문제 발생 → </li>
      <li>1-2 : EC2 메모리를 t2.micro 에서 small로 변환 으로 해결 → </li>
       <li>2-1 : IP 주소가 바뀌어 연결해 놓은 도메인에 접근을 하지 못하는 상황 발생 </li>
       <li>2-2 : 재 설정된 IP 주소로 가비아 및 NGINX 에 적용 후에 다시 시도 → Permission denied 라는 NGNIX 에러 발생 → 구글링 결과 /xxx/xxx/bulid/index.html, failed 라는 경로에 해당 권한이 없어 접근 하지 못하는 것 이라는 정보 를 얻고 → </li>
       <li>2-3 :  NGINX 에서 root 으로 설정한 디렉토리 경로의 권한 을 확인하고 → </li>
       <li>2-4 : 해당 유저 그룹을 /etc/nginx/nginx.conf 에서 일치 시키며 에러를 해결. </li>
       <li><img width="811" alt="해당룻" src="https://github.com/puru-puru/puru-puru-BE/assets/152770526/1fe7a8ef-81b1-40ad-889d-9b58f99b29cc">
</li>
       <li>2-5 : 유저 그룹을 파악 하고  /etc/nginx/nginx.conf 에서 일치 시키며 해결.</li>
       <li><img width="811" alt="해결" src="https://github.com/puru-puru/puru-puru-BE/assets/152770526/5deaf9e7-4be0-4cec-823c-affe1a377221">
</li>
    </ul>
  </div>
</details>

<details>
  <summary><b>2. NGINX 초기 세팅 오류 </b></summary>
  <div markdown="2">
    <ul>
      <li>1-1 : 엔지닉스를 사용하여 로드밸런싱을 구축 하기 전 파일 백업 하는과정 →
cp -rvf ngnix nginx_bak 하는 과정에 → Permission denied 가 출력이 되었음. → </li>
      <li>1-2 : 구글링 결과 ( 스택 오버 플로우 )
nginx소유한 ngnix 프로세스에서 생성된 로그 파일을 볼 수 있는 권한이 없기 때문에 표시됩니다 라는 정보를 얻고 → </li>
       <li>1-3 : 앞에 sudo 를 붙여 권한을 변경 함으로 해당 문제 해결.</li>
       <li><img width="682" alt="첫 문제 해결" src="https://github.com/puru-puru/puru-puru-BE/assets/152770526/db502d6c-772a-441c-9e35-23ec02733717">
</li>
       <li>1-4 : 이후 진행을 해보려 했을때 지속 되는 nginx -t 테스트 명령어 실패, 및 권한 오류 발생 → </li>
       <li>1-5 : 구글링 결과 ( 스택 오버 플로우 )→ <br><br> 1. 구성에서 가져온 파일 내부에 오타가 있을 수 있습니다. <br><br>
2. 공식 Nginx CookBook의 최신 버전에 따르면, 우리는 내부에서 어떤 구성도 생성할 필요가 없습니다. `/etc/nginx/sites-enabled/`이것은 이전 관행이었으며 현재는 더 이상 사용되지 않습니다. <br><br>
3. nginx.conf 파일 내부중 내용을 
`include /etc/nginx/conf.d/includes-optional/cpanel-proxy-vendors/*.conf;` 으로 교체 하여도 지속된 오류 발생 <br> </li>
       <li>1-6 : 많은 과정을 거쳤으나. 도출된 결과는 기본적으로 NGNIX 초기 세팅 부분에서 잘못되었고 → 이후 다시 NGINX 초기 세팅 마무리 후.→ </li>
      ``` 
      
      upstream myserver {
        server xxx.xx.x.xxx:xxx; <-- 프라이빗 ip 
        server xxx.xx.xx.x:xxx; <-- 프라이빗 ip 
    }

    server {
          listen 80;
          server_name xxx.xxxxx.xxx;<-- 내가 연결할 도메인. 입력


        location / {
          proxy_pass http://myserver;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header Host $http_host;
      }
    } 
    ```
  <li>1-7: 해당 방식으로 처음 부터 로드밸런싱을 진행할 IP 및 도메인을 미리 입력하고 certbot --nginx 명령어를 통해서 서브 서버로 사용할 주소 까지 certbot 에서 자동으로 입력하여 해결 할 수 있었음.</li>  
  </ul>
  </div>
</details>


***

## 👍 유저 피드백 & 반영

***
