// realtybook.retools.kr/calc 서브패스 배포용 basePath 헬퍼.
// 기존 calc-realty.vercel.app(루트, TWA 앱 연결)은 이 값이 비어있는 채로 그대로 유지되고,
// /calc 서브패스로 별도 배포되는 Vercel 프로젝트에서만 NEXT_PUBLIC_BASE_PATH=/calc 환경변수를 설정한다.
// next.config.js의 basePath는 next/link, next/image, 라우팅은 자동 처리해주지만
// 순수 <img src="/...">, fetch("/...") 같은 절대경로는 자동으로 안 붙기 때문에
// 이 상수를 수동으로 앞에 붙여줘야 한다.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
