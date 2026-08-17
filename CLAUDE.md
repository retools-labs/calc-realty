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
"리얼티북 — 토스 인앱 부동산 계산 툴킷 & 마케팅 마스터 플랜"
(https://docs.google.com/document/d/1MVF-Y1BIrXlH-nG0aEJkO0aus4eIaL_EaGj6lLFh4xg/edit)
— 8개 섹션(개요, 퍼널설계, 5개 계산기 스펙, UI/UX가이드, 기술스택, 마케팅, SNS전략,
무인 자동화 SNS 봇). **계산기 5개(3.1~3.5) 전부 구현·배포 완료(2026-08-17 부산 세션).** 남은 건
4장 디자인 리스타일, 앱인토스 SDK 연동, SNS 자동화 봇뿐(README "6. 다음 단계 백로그" 참고).

## 지금 살아있는 배포 상태

- **Production 배포**: https://calc-realty.vercel.app
- **GitHub**: https://github.com/xchanz-tech/calc-realty (Public, main 브랜치)
  → main에 push하면 Vercel이 자동 배포
- 로그인/DB/서버 API 없음 — 계산은 전부 브라우저에서 즉시 처리 (`.env.local` 불필요)
- 사업자등록증: 등록 진행 중 (발급 완료 후 상호/사업자번호 기재 예정 — Footer 컴포넌트 참고)

## 작업 규칙

apple-realty-settlement와 동일:

1. 시작할 때 `git pull`, 끝날 때 `git push`. 부산/울산 두 곳에서 같은 `C:\dev\calc-realty`
   경로를 쓰기로 했음.
2. 커밋 전엔 `npx tsc --noEmit -p tsconfig.json`으로 타입체크 먼저 돌려서 깨진 게 없는지 확인.
3. `git push` 하면 Vercel이 자동 배포하므로, push 직후 사용자에게 배포 확인 방법 안내할 것.
4. Windows 환경이라 줄바꿈(CRLF/LF) 경고가 종종 뜨는데 무해하니 무시해도 됨.

## 완료된 작업

상세 내역은 README.md "7. 2026-08-17 작업 내역(울산)" / "8. 2026-08-17 작업 내역(부산)" 섹션 참고.
요약:

- 3.1 법정 중개보수 상한 계산기 (매매/임대차/오피스텔/토지상가, 부가세 3종, 협의요율 슬라이더,
  결과 텍스트 복사) — 최초 구현, 마스터플랜 요율표와 100% 일치 확인됨
- 3.3 잔금일 월세·관리비 일할계산기 — `components/ProrateCalculator.tsx`, `lib/prorate.ts`
- 3.2 이사 총 부대비용(영수증) 계산기 — `components/MovingCostCalculator.tsx`, `lib/movingCost.ts`
- 일반고객 ⇄ 공인중개사 실무 모드 스위치 + 공동중개(단타/양타) + RS 분배율 — `BrokerageFeeCalculator.tsx`
- 3.4 상가 임대수익률(Cap Rate)·권리금 계산기 — `components/CapRateCalculator.tsx`, `lib/capRate.ts`
- 3.5 카톡 스마트 영수증 카드 이미지 생성기(html2canvas) — `components/ReceiptCard.tsx`,
  `components/ShareReceiptButton.tsx`, 3.1/3.2에 공통 적용
- 공용 UI는 `components/ui.tsx`(`WonInput`/`SegButton`)로 추출, `app/page.tsx`는 4개 탭 셸

## 아직 안 한 백로그

README.md "6. 다음 단계 백로그" 섹션 참고 (디자인 리스타일, 앱인토스 SDK 연동, SNS 자동화 봇 등).
이 문서에 중복 기재하지 않음 — README가 최신 소스.

## 자세한 내용

프로젝트 개요, 실행 방법, 계산 로직 근거(법령 조문), 앱인토스 입점 절차는 README.md 참고.
