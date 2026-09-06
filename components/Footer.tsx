import RetoolsMark from "./RetoolsMark";
import { POLICY_BASE_URL, RETOOLS_INFO } from "@/lib/retoolsInfo";
import { BASE_PATH } from "@/lib/basePath";

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
          {/* [2026-09-06 S-10] 계산기는 제 약관을 쓴다. 방침을 R-20 에서 갈아 끼울 때
              바로 옆의 이 링크가 그대로 남아 리얼티북 약관을 가리키고 있었다. 그쪽은
              회원·결제·환불이 있는 다른 서비스의 약관이라, 무료이고 가입도 없는 이 앱의
              이용자에게 보여 주면 「이 앱은 무료입니다」와 어긋난다. 방침과 같은 이유다. */}
          <a href={`${BASE_PATH}/terms`} className="hover:text-[#0d3b52] hover:underline">
            이용약관
          </a>
          <span aria-hidden>·</span>
          {/* [2026-09-05 R-20] 계산기는 제 방침을 쓴다. 리얼티북 방침을 가리키면 안 된다.
              구글 플레이는 앱 하나에 방침 하나를 보고, 심사자와 이용자가 앱 화면에서 바로
              닿는 곳이 이 링크다. 리얼티북 방침은 결제와 개인정보 수집이 있는 다른 서비스의
              것이라, 그것을 보여 주면 「이 앱은 수집하지 않습니다」와 어긋난다. */}
          <a href={`${BASE_PATH}/privacy`} className="hover:text-[#0d3b52] hover:underline">
            개인정보처리방침
          </a>
          {/* [2026-09-06 지시 039] 환불정책 링크를 뺐다. 이 앱은 무료이고 결제가 없어
              환불할 것이 없는데, 링크는 유료 서비스인 장부의 환불정책을 가리키고 있었다.
              약관에 환불 조항을 넣지 않기로 해 놓고 푸터에서 환불정책을 걸어 두면 두
              문서가 다른 말을 한다. 이용약관·방침 링크를 갈아 끼울 때 이 줄만 남았던
              것이라, 이 푸터에서 옆자리를 놓친 것이 세 번째다. */}
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
