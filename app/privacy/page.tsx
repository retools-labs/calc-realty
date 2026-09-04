import type { Metadata } from "next";
import { RETOOLS_INFO } from "@/lib/retoolsInfo";

// ============================================================
// [2026-09-05 R-20] 복비 계산기 전용 개인정보처리방침.
//
// 구글 플레이 데이터 보안 제출이 방침 URL 하나에 막혀 있었다. 이 페이지가 그 URL 이다.
// 주소는 calc-realty.vercel.app/privacy 이고, 앱(TWA)이 그 도메인을 붙박이로 물고 있다.
//
// 리얼티북 방침에 절을 얹지 않고 따로 만든 이유가 둘이다(총괄 판정, 지시 031 2-1).
//   · 구글 플레이는 앱 하나에 방침 하나를 본다. 리얼티북 방침을 내면 심사자가 이 앱과
//     무관한 내용이 대부분인 페이지를 읽게 된다.
//   · 계산기는 수집하는 것이 없어 방침이 짧다. 결제와 개인정보 수집이 있는 리얼티북
//     방침에 섞으면 「수집하지 않습니다」가 흐려진다. 이 방침에서 가장 중요한 문장이 그것이다.
//
// 문구는 심사·제출 창이 코드와 화면에서 사실을 확인해 쓴 초안이고, 3절만 총괄이 코드를
// 열어 확인한 뒤 확정한 문장이다(지시 031 2-3). 사실이 바뀌면 여기부터 고친다.
//
// 사업자 정보는 lib/retoolsInfo.ts 에서만 읽는다. 여기에 값을 직접 적으면
// scripts/check-retools-info.ts 가 배포를 멈춘다.
// ============================================================

export const metadata: Metadata = {
  title: "개인정보처리방침 | 복비 계산기",
  description:
    "복비 계산기(리툴스)는 이용자의 개인정보를 수집하지 않습니다. 수집 항목, 계산 값의 처리, 문의처를 안내합니다.",
};

/** 방침이 실제로 시행된 날. 문구를 고칠 때 이 값도 함께 고친다. */
const EFFECTIVE_DATE = "2026년 9월 5일";

function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="text-[15px] font-bold text-navy">{title}</h2>
      <div className="mt-2 space-y-2 text-[13.5px] leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

export default function CalculatorPrivacyPage() {
  const r = RETOOLS_INFO;

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <header className="border-b border-gray-200 pb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-cobalt">복비 계산기</p>
        <h1 className="mt-2 text-2xl font-bold text-navy">개인정보처리방침</h1>
        <p className="mt-3 text-[12.5px] leading-relaxed text-gray-500">
          시행일 {EFFECTIVE_DATE} · 서비스 운영 {r.companyName}
        </p>
      </header>

      <p className="mt-6 rounded-xl bg-mist px-4 py-4 text-[14px] font-semibold leading-relaxed text-navy">
        {r.companyName}는 「복비 계산기」(이하 &ldquo;이 앱&rdquo;)를 제공하며, 이 앱은 이용자의
        개인정보를 수집하지 않습니다.
      </p>

      <Article title="1. 수집하는 개인정보">
        <p>
          없습니다. 이 앱에는 회원가입과 로그인, 결제 기능이 없으며, 이름과 연락처, 계좌번호를
          비롯한 어떤 개인정보도 입력받지 않습니다.
        </p>
      </Article>

      <Article title="2. 자동으로 수집되는 정보">
        <p>
          없습니다. 앱 사용 기록을 분석하거나 화면 조작을 기록하는 도구를 사용하지 않습니다.
        </p>
      </Article>

      <Article title="3. 계산 값의 처리">
        <p>
          이용자가 입력한 금액과 면적은 이용자의 브라우저 안에서만 계산되며 저희 서버로 전송되지
          않습니다. 전월세 전환 계산에 쓰는 한국은행 기준금리는 저희 서버가 한국은행 ECOS 공개
          API 에서 받아와 전달하며, 그 요청에 이용자의 입력값은 포함되지 않습니다.
        </p>
      </Article>

      <Article title="4. 제3자 제공 및 처리 위탁">
        <p>없습니다.</p>
      </Article>

      <Article title="5. 브라우저 저장소">
        <p>
          화면 편의를 위해 브라우저 저장소를 쓸 수 있으며, 그 값은 이용자의 기기를 벗어나지
          않습니다.
        </p>
      </Article>

      <Article title="6. 이용자의 권리">
        <p>
          저장하는 개인정보가 없으므로 열람과 정정, 삭제를 요청할 대상이 없습니다. 문의는 아래
          연락처로 받습니다.
        </p>
      </Article>

      <Article title="7. 개인정보 보호책임자">
        <p>
          {r.ceoName} · {r.phone} ({r.phoneHours}) · {r.email}
        </p>
      </Article>

      <Article title="8. 고지의 의무">
        <p>이 방침이 바뀌면 시행 7일 전에 이 페이지에 알립니다.</p>
      </Article>

      <div className="mt-9 border-t border-gray-200 pt-5 text-[12px] leading-relaxed text-gray-500">
        <p>
          {r.companyName} · 대표자 {r.ceoName} · 사업자등록번호 {r.businessRegistrationNo}
        </p>
        <p>
          통신판매업 신고번호 {r.mailOrderRegistrationNo} · {r.address}
        </p>
      </div>
    </main>
  );
}
