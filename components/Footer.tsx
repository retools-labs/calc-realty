import RetoolsMark from "./RetoolsMark";
import { POLICY_BASE_URL, RETOOLS_INFO } from "@/lib/retoolsInfo";

// 이 계산기는 결제와 로그인이 없는 유입 도구지만, 방문자가 뒤에 실제 사업자가 있다는
// 것을 알 수 있도록 리얼티북 본체와 같은 사업자정보를 붙여 둔다. 전자상거래법 제10조가
// 요구하는 표시이기도 하다.
//
// [2026-09-04 R-18] 값이 낡아 대표 개인 휴대폰과 「신고 진행 중」이 나가고 있었다.
// 값은 lib/retoolsInfo.ts 한 곳에서만 관리한다. 정본은 대외 표기 정본 대장 4절이다.
export default function Footer() {
  const r = RETOOLS_INFO;
  // 출원 4건을 한 줄로 합친다. 조사 「는」이 붙어야 하므로 JSX 줄바꿈으로 공백이
  // 끼지 않도록 문자열로 미리 만들어 넣는다.
  const trademarkNotice =
    r.trademarks
      .map((t) => `${t.mark}™(${t.applicationNos.join(", ")})`)
      .join(" · ") + "는 리툴스가 특허청에 출원한 상표이며, 현재 심사가 진행 중입니다.";

  return (
    <footer className="mt-10 border-t border-gray-200 bg-white px-4 py-6 text-[11px] leading-relaxed text-gray-400">
      <div className="mx-auto max-w-md">
        <div className="mb-3 flex items-center gap-2">
          <RetoolsMark size={22} />
          <a
            href="https://retools.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-gray-500 hover:text-[#0d3b52] hover:underline"
          >
            {r.companyNameEn}
          </a>
        </div>

        <p className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-gray-500">
          <a href={`${POLICY_BASE_URL}/terms`} className="hover:text-[#0d3b52] hover:underline">
            이용약관
          </a>
          <span aria-hidden>·</span>
          <a href={`${POLICY_BASE_URL}/privacy`} className="hover:text-[#0d3b52] hover:underline">
            개인정보처리방침
          </a>
          <span aria-hidden>·</span>
          <a href={`${POLICY_BASE_URL}/refund-policy`} className="hover:text-[#0d3b52] hover:underline">
            구독 취소 및 환불 정책
          </a>
        </p>
        <p>
          상호명: {r.companyName} · 대표자: {r.ceoName} · 사업자등록번호: {r.businessRegistrationNo}
        </p>
        <p>
          사업장 소재지: {r.address} · 고객센터: {r.phone} ({r.phoneHours}) · 이메일: {r.email}
        </p>
        <p>통신판매업 신고번호: {r.mailOrderRegistrationNo}</p>
        <p className="mt-2 text-gray-300">
          &copy; {new Date().getFullYear()} {r.companyNameEn}. {trademarkNotice}
        </p>
      </div>
    </footer>
  );
}
