import RetoolsMark from "./RetoolsMark";
import { RETOOLS_INFO } from "@/lib/retoolsInfo";

// 이 계산기는 결제/로그인이 없는 단순 리드젠 도구지만, 리얼티북 서비스로 연결되는
// 화면이라 방문자가 "뒤에 실제 사업자가 있다"는 걸 알 수 있도록 동일한 사업자정보
// Footer를 붙여둔다. 이용약관 등 문서 자체는 apple-realty-settlement 쪽에만 있으므로
// 절대경로 링크로 연결한다(중복 유지 방지).
export default function Footer() {
  const r = RETOOLS_INFO;
  return (
    <footer className="mt-10 border-t border-gray-200 bg-white px-4 py-6 text-[11px] leading-relaxed text-gray-400">
      <div className="mx-auto max-w-md">
        <div className="mb-3 flex items-center gap-2">
          <RetoolsMark size={22} />
          <span className="text-xs font-bold text-gray-500">{r.companyNameEn}</span>
        </div>

        <p className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-gray-500">
          <a href="https://apple-realty.vercel.app/terms" className="hover:text-[#0d3b52] hover:underline">이용약관</a>
          <span aria-hidden>·</span>
          <a href="https://apple-realty.vercel.app/privacy" className="hover:text-[#0d3b52] hover:underline">개인정보처리방침</a>
          <span aria-hidden>·</span>
          <a href="https://apple-realty.vercel.app/refund-policy" className="hover:text-[#0d3b52] hover:underline">구독 취소 및 환불 정책</a>
        </p>
        <p>
          상호명: {r.companyName} ({r.brandDesc}) · 대표자: {r.ceoName} · 사업자등록번호:{" "}
          {r.businessRegistrationNo || "등록 진행 중 (발급 완료 후 기재 예정)"}
        </p>
        <p>
          사업장 소재지: {r.address || "확정 후 기재 예정"} · 고객센터: {r.phone} · 이메일: {r.email}
        </p>
        <p>통신판매업 신고번호: {r.mailOrderRegistrationStatus}</p>
        <p className="mt-2 text-gray-300">
          &copy; {new Date().getFullYear()} {r.companyNameEn}. 리얼티북(RealtyBook)은 상표 출원 중입니다.
        </p>
      </div>
    </footer>
  );
}
