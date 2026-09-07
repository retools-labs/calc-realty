# 영수증 CTA 이미지 생성 소스 (X-41 · 2026-09-07)

`public/images/receipt-cta-v3.png` 는 이 폴더의 `receipt-cta-v3.html` 을 `render.py` 로 찍은 것이다.
결과 PNG 만 남기지 않고 소스를 저장소에 남긴다(대외 산출물 규칙 3).

- 값의 정본은 `C:\dev\정본.md` 다. 제품명(2절) · 무료 체험 1개월·카드 없이(5절) · 주소 `retools.kr/book/realty`(3절).
- 글꼴 Pretendard woff2 는 저장소에 없다. `C:\dev\retools-print\_원고\fonts\` 의 Medium·SemiBold·Bold·ExtraBold 넷을
  이 폴더의 `fonts/` 에 복사한 뒤 `python render.py` (playwright 필요).
- 2판(`receipt-cta-v2.png`)은 옛 제품명과 폐기된 값(2인 평생 무료)을 그림 안에 들고 있어 내렸다.
