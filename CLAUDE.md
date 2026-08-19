# 작업 시작 전 필독 (Claude용 컨텍스트)

이 문서는 이 저장소를 처음 열어보는 Claude 세션(부산/울산 등 다른 기기)이 바로 상황을
파악하고 이어서 작업할 수 있도록 만든 메모입니다. 사람이 아니라 AI 세션 인수인계용입니다.

## 세션 인수인계 및 동기화 규칙 — 가장 먼저 읽을 것

`apple-realty-settlement`(애플부동산 정산 시스템) 프로젝트와 완전히 동일한 규칙을 씁니다.
부산/울산 등 다른 기기·다른 Cowork 창에서 이 프로젝트를 열었을 때, 사용자가 아래 트리거
문구를 말하면 그에 맞는 동작을 한다.

- **"여기서 작업 시작"** — 이 CLAUDE.md와 README.md("7. 최근 작업 내역" 섹션)를 읽고 지금까지
  진행 상황과 다음 할 일을 파악한 뒤 이어서 작업한다.
- **"작업 마감" / "여기까지 하고 마감할게"** — 이번 세션에서 처리한 내용을 README.md
  "다음 단계 백로그" / "최근 작업 내역" 섹션과 이 CLAUDE.md에 반영한다.

**코드는 오직 GitHub(`git pull`/`git push`)로만 동기화.** 로컬 경로는 항상
`C:\dev\calc-realty` 고정. `.git`, `node_modules`, `.next` 등은 구글 드라이브로
복사/동기화하지 않는다(apple-realty-settlement에서 이미 겪은 문제 — 드라이브 동기화 클라이언트의
파일 잠금과 `npm install`/`git` 쓰기 작업이 충돌해 빌드가 깨질 수 있음).

## 이 프로젝트가 뭔지

**법정 상한요율 기준 부동산 계산기 모음(공개 웹앱)**. `apple-realty-settlement`(사무소 내부용,
로그인 필요한 정산 시스템)와는 **완전히 별개의 프로젝트**입니다 — 이쪽은 로그인 없이 누구나
쓰는 공개 유틸리티. 최종 목표는 토스 인앱(앱인토스) 미니앱으로 배포해서 광고 수익 + 애플부동산
정산 시스템(apple-realty.vercel.app) 가입 유도 마중물로 쓰는 것.

기획 원본 문서(Gemini Spark 작성, 총괄 PM 역할): 구글독스
"리얼티북 — 부동산 계산기 개발 및 마케팅 플랜"
(https://docs.google.com/document/d/1MVF-Y1BIrXlH-nG0aEJkO0aus4eIaL_EaGj6lLFh4xg/edit)
— 10개 섹션(개요, 퍼널설계, 3.1~3.9 계산기 스펙, UI/UX가이드, 기술스택, 마케팅, SNS전략,
블로그 자동화, 백로그). **3.1~3.5(핵심 5종) + 3.6(전월세 전환율·5%) + 3.7(평수·평단가)
전부 구현·배포 완료(2026-08-19), 4장 디자인 리스타일도 완료(2026-08-18 — README "11.".
v1.1 상단 입력폼 리디자인 + 3.6/3.7 추가는 README "12." 참고).** 남은 건 3.8(상가 부가세·안분,
중장기), 3.9(양도세 비과세 간이계산, 중장기), 앱인토스 SDK 연동, SNS 자동화 봇.

## 지금 살아있는 배포 상태

- **Production 배포**: https://calc-realty.vercel.app
- **GitHub**: https://github.com/xchanz-tech/calc-realty (Public, main 브랜치)
  → main에 push하면 Vercel이 자동 배포
- 로그인/DB 없음 — 계산은 전부 브라우저에서 즉시 처리. 단, 2026-08-19부터 예외 1건: 전월세
  전환율 계산기가 기준금리 실시간 조회용 서버리스 라우트(`app/api/base-rate`)를 씀 —
  `ECOS_API_KEY` 환경변수 필요(README "2." 참고, 없어도 폴백값으로 동작은 함)
- 사업자등록증: 2026-08-18 발급 완료 (사업자등록번호 141-52-01181, `lib/retoolsInfo.ts`에 반영 —
  Footer/이용약관/개인정보처리방침/환불정책 페이지가 전부 이 값을 참조)

## 작업 규칙

apple-realty-settlement와 동일:

1. 시작할 때 `git pull`, 끝날 때 `git push`. 부산/울산 두 곳에서 같은 `C:\dev\calc-realty`
   경로를 쓰기로 했음.
2. 커밋 전엔 `npx tsc --noEmit -p tsconfig.json`으로 타입체크 먼저 돌려서 깨진 게 없는지 확인.
3. `git push` 하면 Vercel이 자동 배포하므로, push 직후 사용자에게 배포 확인 방법 안내할 것.
4. Windows 환경이라 줄바꿈(CRLF/LF) 경고가 종종 뜨는데 무해하니 무시해도 됨.

## 완료된 작업

상세 내역은 README.md "7. 2026-08-17 작업 내역(울산)" / "8~10. 2026-08-17 작업 내역(부산)" /
"11. 2026-08-18 작업 내역(부산)" / "12. 2026-08-19 작업 내역(울산)" / "13. 2026-08-20 작업
내역(울산)" 섹션 참고. 요약:

- **[2026-08-20] Android(TWA) 앱 패키징 + Play Store 출시 준비(울산).** 형이 calc-realty를
  구글 플레이스토어 단독 앱으로 출시 요청. 패키지명 `kr.retools.realtycalc`, 서명 키스토어
  생성(RSA 2048bit, alias `realtycalc`, 유효 10,000일 — **이후 업데이트마다 계속 재사용해야
  하는 키, 절대 분실 금지**), `public/.well-known/assetlinks.json` 생성·배포(커밋 `cee23bc`),
  `twa-manifest.json`을 Bubblewrap 스키마 기준으로 직접 작성. 샌드박스는 JDK/Android SDK
  다운로드가 매 호출마다 처음부터 다시 받아져서 실제 `.aab` 빌드는 못 끝냈고, 형 PC(로컬
  PowerShell)로 넘겨서 빌드 완료(`app-release-bundle.aab`). 빌드 도중 PowerShell 한글 인코딩
  깨짐/Gradle 메모리 부족/키스토어 비밀번호 오입력 3가지 문제를 겪고 해결함 — 상세 원인과 해결법은
  README "13." 참고, **재사용 가능한 빌드 커맨드 전체는 바로 아래 "Android(TWA) 앱
  빌드/업데이트 방법" 섹션**(부산 등 다른 PC에서도 그대로 사용 가능). 키스토어·비밀번호는
  구글 드라이브(`Work/리툴스/android-signing`)에 백업 완료. **형이 해야 할 일**: Play Console에
  `app-release-bundle.aab` 업로드 + 스토어 등록(Claude는 Play Console 계정 접근 권한 없음).
- **[2026-08-19, 또또 이어서] ECOS 인증키 실제 발급·검증 + 버그 수정(울산).** 형이 ECOS에서
  인증키(`A44NSDI3DHSZJ1XNOXS7`)를 실제로 발급받아 전달 → curl로 직접 호출 검증하다가
  **요청 건수 부족 버그 발견**: 180일치 일별 데이터(~180건)를 요청하면서 건수를 100건으로만
  잡아서, 실제로는 5개월 전(2026-03-22, 2.5%) 데이터를 "최신값"으로 잘못 읽고 있었음 →
  500건으로 올려서 수정, 재검증 완료(178건 정상 수신, 최신값 2026-08-16자 2.75% 확인).
  로컬 `.env.local`에 키 등록(gitignore 대상이라 커밋 안 됨). **형이 해야 할 일**: 같은 키를
  Vercel 프로젝트 환경변수에도 등록해야 프로덕션에 반영됨(Claude는 Vercel 접근 권한 없음).
  상세는 README "12-3." 참고. **배포 반영까지 확인 완료**: env var 추가 시점이 직전 push보다
  늦어서 최신 배포에 키가 안 들어가 있던 걸 Vercel 대시보드에서 Redeploy로 한 번 더 잡아줌 →
  프로덕션 `/api/base-rate`가 `{"ratePercent":2.75,"effectiveDate":"2026-08-16","source":"ecos","stale":false}`로
  실시간 응답하는 것까지 curl로 최종 검증함(2026-08-19).
- **[2026-08-19, 또 이어서] 기준금리 하드코딩 → ECOS Open API 실시간 연동(울산).** 형이
  "MAX 플랜이니 토큰 걱정 말고 사람이 매번 확인 안 해도 되게 자동 갱신으로" 요청 → 신규
  `app/api/base-rate`(서버리스, ECOS 통계표 722Y001 호출, 6시간 캐시, 키 없거나 실패 시
  폴백값으로 우아하게 저하) + `JeonseConversionCalculator.tsx`가 마운트 시 이걸 fetch해서
  전환율 상한을 실시간 반영. **이 프로젝트 최초의 서버 API 라우트이자 최초의 환경변수
  (`ECOS_API_KEY`)** — README "1./2."에 발급·등록 절차 문서화, `.env.local.example` 추가.
  키는 형이 https://ecos.bok.or.kr/api/ 에서 직접 발급받아 Vercel에 등록해야 함(Claude가
  대신 가입 불가) — 등록 전까지는 폴백값(2.75%, 2026-07-16)으로 정상 동작. 상세는 README
  "12-2." 참고.
- **[2026-08-19, 이어서] 전월세 전환율(3.6) & 5% 갱신 상한 계산기 추가(울산).** 형이 "MAX 플랜
  전환했으니 토큰 걱정 말고 진행해라"고 해서, 이전에 보류했던 3.6을 바로 이어서 구현. 구글독스
  3.6 스펙 원문 확인("주임법 법정 전환율 상한선 판정, 갱신청구권 5% 상한액 보증금/월세별 자동
  산출") + 웹서치로 한국은행 기준금리 재확인(2026-07-16 금통위에서 2.50%→2.75% 인상 결정,
  2023년 1월 이후 첫 인상 — 2026-08-19 기준 유효, 다음 회의 08-27). 법정 전환율 상한 =
  min(연 10%, 기준금리+2%p) = **4.75%**(시행령 제9조), 갱신청구권 증액 상한은 기준금리와
  무관한 고정 **5%**(시행령 제8조) — 두 개 별도 법령 근거를 한 계산기에 담음. 신규
  `lib/jeonseConversion.ts`(기준금리 상수는 날짜 주석과 함께 박아둠, 세션마다 재확인 필요) +
  `components/JeonseConversionCalculator.tsx`(보증금⇄월세 전환 + 갱신 5% 상한, 상한 초과 시
  경고). `app/page.tsx`에 "전월세·5%" 탭으로 연결(총 6탭, `grid-cols-3` 2줄). `npx tsc --noEmit`
  통과. 구글독스 스크린 리딩 중 Ctrl+F 텍스트가 검색창이 아니라 문서 본문에 잘못 들어가는
  사고가 있었으나 즉시 Ctrl+Z로 원복 확인함(문서 정상).
  - **주의**: `CURRENT_BASE_RATE_PERCENT`(2.75, 2026-07-16 결정 기준)는 한국은행이 금리를
    바꿀 때마다(연 8회 회의) 반드시 재확인·갱신해야 하는 값. 다음 세션에서 이 계산기를 다시
    열면 우선 한국은행 기준금리 최신값부터 확인할 것.
- **[2026-08-19] v1.1 상단 입력폼 UI 리디자인 + 평수·평단가 계산기 신규 추가(울산).**
  Claude Design v1.1 목업(PM 권고사항 반영) 중 상단 입력폼 영역만 적용, 전월세 전환율(5%)
  계산기는 법정 기준금리 확인 전까지 **의도적으로 제외**. `components/ui.tsx`의
  `WonInput`에 "n억 n천만원" 한글 단위 자동 힌트 추가(`formatKoreanUnit`), 헤더를 네이비
  카드에서 라이트 배경 + FREE 뱃지로 교체, 모드 스위치를 별도 흰색 카드로 분리,
  `BrokerageFeeCalculator`의 2단계 거래유형 선택(매매·교환→전세/월세)을 매매/전세/월세
  3버튼 단일 SegButton으로 평탄화, "토지·상가"→"상가·토지" 라벨 순서 변경. 신규
  `lib/pyeong.ts` + `components/PyeongCalculator.tsx`(평↔㎡ 환산, 평당가/㎡당가, 1평=400/121㎡)
  추가해 탭 5개 구성(전월세 제외). 롤백 대비 원본 코드는 `design-v1.1-backup/*.orig.txt`에
  보관. `npx tsc --noEmit` 통과 확인. 아직 `git push` 전 — 사용자 확인 후 커밋 예정.
- **[2026-08-18] 마스터플랜 4장 디자인 전면 리스타일 + PM 마이너 개선 4건 + `main` 배포.**
  navy/cobalt/cyan 팔레트, Sora+IBM Plex Sans KR 폰트, 공용 `ResultCard` 컴포넌트, 헤더
  "부동산 계산기"로 재설계, 4개 아이콘 탭 네비, 영수증 카드 모달화, 오피스텔 라벨 정돈,
  0원 플레이스홀더, 일할계산 탭 잠금 완전 해제(모드 무관 4탭 전부 개방) — 전부 `main`에
  병합·배포 완료, 형이 프로덕션에서 직접 확인함. 상세는 README "11." 참고.
- **[연계] `apple-realty-settlement` NavBar에 이 계산기 새 탭 링크 추가** — 계약 등록 중에도
  옆 탭으로 바로 전환해서 쓸 수 있게 함. 그쪽 저장소 CLAUDE.md에도 기록됨.

- 3.1 법정 중개보수 상한 계산기 (매매/임대차/오피스텔/토지상가, 부가세 3종, 협의요율 슬라이더,
  결과 텍스트 복사) — 최초 구현, 마스터플랜 요율표와 100% 일치 확인됨
- 3.3 잔금일 월세·관리비 일할계산기 — `components/ProrateCalculator.tsx`, `lib/prorate.ts`
- 3.2 이사 총 부대비용(영수증) 계산기 — `components/MovingCostCalculator.tsx`, `lib/movingCost.ts`
- 일반고객 ⇄ 공인중개사 실무 모드 스위치 + 공동중개(단타/양타) + RS 분배율 — `BrokerageFeeCalculator.tsx`
- 3.4 상가 임대수익률(Cap Rate)·권리금 계산기 — `components/CapRateCalculator.tsx`, `lib/capRate.ts`
- 3.5 카톡 스마트 영수증 카드 이미지 생성기(html2canvas) — `components/ReceiptCard.tsx`,
  `components/ShareReceiptButton.tsx`, 3.1/3.2에 공통 적용
- 공용 UI는 `components/ui.tsx`(`WonInput`/`SegButton`)로 추출, `app/page.tsx`는 4개 탭 셸
- 영수증 카드 하단 CTA는 텍스트 조립이 아니라 **Claude Design에서 내보낸 정적 PNG
  이미지**(`public/images/receipt-cta-v2.png`, 3줄 세로형)를 `aspect-[73/23] w-full`로 스케일링
  — 모바일 카드 폭에서도 항상 디자인 그대로, 줄바꿈/뭉개짐 없이 보임 (README "10." 참고)

## 아직 안 한 백로그

README.md "6. 다음 단계 백로그" 섹션 참고 (명칭 변경, 디자인 리스타일, 앱인토스 SDK 연동,
SNS 자동화 봇 등). 이 문서에 중복 기재하지 않음 — README가 최신 소스.

## Android(TWA) 앱 빌드/업데이트 방법 — 로컬 PC 전용 실행 가이드

**이 섹션은 Cowork 세션이 아니라 로컬 Windows PowerShell에서 사람이 직접 실행하는 용도입니다.**
부산 등 다른 PC에서 이 저장소를 열었어도(= 이 문서를 git으로 받았어도) 아래 그대로 따라하면
새 빌드를 만들 수 있습니다. 2026-08-20에 울산 세션에서 겪은 시행착오가 전부 반영돼 있습니다
(README "13." 참고).

### 사전 준비물

- Node.js 설치돼 있는 Windows PC
- **서명 키스토어**: `realtycalc-release.keystore` + `PASSWORD_DO_NOT_LOSE.txt` — 구글 드라이브
  공유 폴더 `Work/리툴스/android-signing`에 백업돼 있음(PC마다 드라이브 문자는 다를 수 있으니
  "내 드라이브"에서 직접 찾을 것). **이 키가 없으면 새로 만들면 안 됩니다** — Play Store는 앱마다
  최초 등록한 서명 키만 계속 인정하므로, 다른 키로 서명하면 업데이트 업로드가 거부됩니다.

### 1. Bubblewrap CLI 설치

```powershell
npm install -g @bubblewrap/cli
```

### 2. 빌드 폴더 준비 (키스토어를 로컬로 복사)

```powershell
mkdir C:\android-build -ErrorAction SilentlyContinue
cd C:\android-build
copy "G:\내 드라이브\Work\리툴스\android-signing\realtycalc-release.keystore" .
copy "G:\내 드라이브\Work\리툴스\android-signing\PASSWORD_DO_NOT_LOSE.txt" .
```
(`G:\내 드라이브\...` 경로는 본인 PC의 실제 구글 드라이브 경로로 바꿀 것)

### 3. `twa-manifest.json` 작성 — 반드시 아래 방법 그대로 (한글 깨짐 방지)

콘솔에 한글(앱 이름 등)을 직접 타이핑/붙여넣기 하면 PowerShell 5.1이 잘못된 인코딩으로 읽어서
깨집니다("부동산" → "遺?숈궛" 식). 아래처럼 Base64로 붙여넣어 바이트 그대로 저장하세요:

```powershell
cd C:\android-build
$b64 = "ewogICJwYWNrYWdlSWQiOiAia3IucmV0b29scy5yZWFsdHljYWxjIiwKICAiaG9zdCI6ICJjYWxjLXJlYWx0eS52ZXJjZWwuYXBwIiwKICAibmFtZSI6ICLrtoDrj5nsgrAg6rOE7IKw6riwIChieSDrpqzslrzti7DrtoEpIiwKICAibGF1bmNoZXJOYW1lIjogIuu2gOuPmeyCsOqzhOyCsOq4sCIsCiAgImRpc3BsYXkiOiAic3RhbmRhbG9uZSIsCiAgInRoZW1lQ29sb3IiOiAiIzBkM2I1MiIsCiAgIm5hdmlnYXRpb25Db2xvciI6ICIjMGQzYjUyIiwKICAiYmFja2dyb3VuZENvbG9yIjogIiNGMkY2RkEiLAogICJlbmFibGVOb3RpZmljYXRpb25zIjogZmFsc2UsCiAgInN0YXJ0VXJsIjogIi8iLAogICJpY29uVXJsIjogImh0dHBzOi8vY2FsYy1yZWFsdHkudmVyY2VsLmFwcC9pY29ucy9pY29uLTUxMi5wbmciLAogICJtYXNrYWJsZUljb25VcmwiOiAiaHR0cHM6Ly9jYWxjLXJlYWx0eS52ZXJjZWwuYXBwL2ljb25zL2ljb24tNTEyLW1hc2thYmxlLnBuZyIsCiAgInNwbGFzaFNjcmVlbkZhZGVPdXREdXJhdGlvbiI6IDMwMCwKICAic2lnbmluZ0tleSI6IHsKICAgICJwYXRoIjogIi4vcmVhbHR5Y2FsYy1yZWxlYXNlLmtleXN0b3JlIiwKICAgICJhbGlhcyI6ICJyZWFsdHljYWxjIgogIH0sCiAgImFwcFZlcnNpb25Db2RlIjogMSwKICAiYXBwVmVyc2lvbiI6ICIxLjAuMCIsCiAgInNob3J0Y3V0cyI6IFtdLAogICJnZW5lcmF0b3JBcHAiOiAiYnViYmxld3JhcC1jbGkiLAogICJ3ZWJNYW5pZmVzdFVybCI6ICJodHRwczovL2NhbGMtcmVhbHR5LnZlcmNlbC5hcHAvbWFuaWZlc3QuanNvbiIsCiAgImZhbGxiYWNrVHlwZSI6ICJjdXN0b210YWJzIiwKICAiZW5hYmxlU2l0ZVNldHRpbmdzU2hvcnRjdXQiOiB0cnVlLAogICJpc0Nocm9tZU9TT25seSI6IGZhbHNlLAogICJpc01ldGFRdWVzdCI6IGZhbHNlLAogICJvcmllbnRhdGlvbiI6ICJwb3J0cmFpdCIsCiAgImZpbmdlcnByaW50cyI6IFsKICAgIHsKICAgICAgIm5hbWUiOiAicmVsZWFzZSIsCiAgICAgICJ2YWx1ZSI6ICJGNTozQzpCNTpEOToyODpDQjowMTo5MzowODpFQzpFODpENjpBRDoxMDpGRTpCOTpFOTo2NjpGMTowNjoyMTpERTpEMDowNDo5QzpDODpFNDo3NDpBMDpCMTo2Qjo0RiIKICAgIH0KICBdCn0K"
[System.IO.File]::WriteAllBytes("C:\android-build\twa-manifest.json", [System.Convert]::FromBase64String($b64))

# 검증 (인코딩 명시 필수)
Get-Content twa-manifest.json -Raw -Encoding UTF8 | ConvertFrom-Json | Select-Object packageId, name, signingKey
```
`name`이 "부동산 계산기 (by 리얼티북)"으로 정상 출력되면 OK. 버전을 올려야 하는 업데이트 빌드라면
이 JSON의 `appVersionCode`/`appVersion` 값을 원하는 값으로 바꾼 뒤 저장(또는 빌드 중 물어보는
`versionName`에 새 버전 입력하면 자동으로 +1 됨).

### 4. 빌드 실행

```powershell
bubblewrap build --manifest=twa-manifest.json
```

- "regenerate your project?" → 최초 빌드면 Yes, 이미 빌드해본 폴더 재사용이면 No
- "versionName for the new App version" → 버전 입력 (또는 Enter로 기본값)
- 키스토어/키 비밀번호 → `PASSWORD_DO_NOT_LOSE.txt` 안의 `GENERATED_KEYSTORE_PASSWORD=` **뒤의
  값만** 입력 (라벨까지 같이 붙여넣지 말 것 — 이거 때문에 한 번 실패한 적 있음)

**만약 `Could not reserve enough space for 1572864KB object heap` 에러가 나면** (Gradle 메모리
문제, 물리 메모리 충분해도 발생 가능):

```powershell
(Get-Content gradle.properties) | Where-Object { $_ -ne "org.gradle.jvmargs=-Xmx1536m" } | Set-Content gradle.properties -Encoding UTF8
Add-Content gradle.properties "`norg.gradle.jvmargs=-Xmx1024m -XX:MaxMetaspaceSize=256m"
Add-Content gradle.properties "`norg.gradle.daemon=false"
bubblewrap build --manifest=twa-manifest.json   # 다시 실행, regenerate는 No로
```

### 5. 결과물

성공하면 같은 폴더에 `app-release-bundle.aab`(Play Console 업로드용)와
`app-release-signed.apk`가 생성됩니다.

### 6. Play Console 업로드 시 참고 정보

- 패키지명: `kr.retools.realtycalc`
- 앱 이름: 부동산 계산기 (by 리얼티북)
- SHA256 인증서 지문(앱 서명 메뉴에서 대조):
  `F5:3C:B5:D9:28:CB:01:93:08:EC:E8:D6:AD:10:FE:B9:E9:66:F1:06:21:DE:D0:04:9C:C8:E4:74:A0:B1:6B:4F`
- `assetlinks.json`은 이미 저장소에 커밋돼 있어서(`public/.well-known/assetlinks.json`) 코드만
  `git pull` 받으면 자동 포함됨 — 이 파일은 새로 안 만들어도 됨(키스토어를 안 바꾸는 한).

## 참고 — 브라우저 자동화 테스트 이슈 (2026-08-17, 이후 해소됨)

2026-08-17엔 프로덕션 페이지에서 브라우저 자동화 인터랙션 테스트가 반응 없는 도구 이슈가
있었음. 2026-08-18 세션에서 형이 실제 폰/PC로 탭 전환·모드 스위치·영수증 카드 모달을 직접
캡처해 확인해줘서 실사용 기준으로는 정상 동작 확인됨(README "11." 참고) — 더 이상 열린
이슈 아님.

## 참고 — PWA 서비스워커 캐시로 인한 "배포했는데 안 바뀜" 현상

`public/sw.js`가 stale-while-revalidate 방식(캐시 우선 응답 + 백그라운드 갱신)이라, 배포
직후 사용자 화면에는 이전 버전이 한 번 더 보일 수 있음. 배포했는데 반영이 안 된 것처럼
보이면 버그로 의심하기 전에 먼저 강력 새로고침(`Ctrl+Shift+R`) 또는 DevTools → Application
→ Service Workers → Unregister를 안내할 것 (2026-08-18에 실제로 이 현상이 있었음).

## 자세한 내용

프로젝트 개요, 실행 방법, 계산 로직 근거(법령 조문), 앱인토스 입점 절차는 README.md 참고.
