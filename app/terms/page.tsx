import type { Metadata } from "next";
import { RETOOLS_INFO } from "@/lib/retoolsInfo";

// ============================================================
// [2026-09-06 S-10] 복비 계산기 전용 이용약관.
//
// ★ 이 약관이 있는 이유는 제3조 하나다. 다른 조항은 없어도 앱이 돌아간다.
//
//   이 앱이 내놓는 숫자를 사람들이 실제 거래에 쓴다. 중개보수와 취득세는 법령과
//   요율이 바뀌고 지방자치단체 조례에 따라 달라진다. 계산이 실제와 어긋났을 때
//   「이 값이 확정된 세액이나 보수액이 아니다」를 말하는 자리가 어디에도 없었다.
//   개인정보처리방침은 개인정보만 다루므로 그 말을 담을 자리가 아니다.
//
//   ⚠️ 다음 사람에게: 3조를 지우지 마십시오. 3조가 이 문서의 이유입니다.
//
// 회원가입·결제·환불 조항을 넣지 않았다. 이 앱에 그 기능이 없다. 없는 절차를
// 약관에 적으면 그것이 곧 지키지 못할 약속이 된다.
//
// [제품명] 본문에서 이름을 부르는 자리는 제1조 한 줄과 화면 제목뿐이다. 지시 037
// 2절이 계산기 이름을 실측 뒤에 한 번만 바꾸기로 했으므로, 그때 고칠 자리를 하나로
// 모아 두었다. 개인정보처리방침도 같은 구조다.
//
// 사업자 정보는 lib/retoolsInfo.ts 에서만 읽는다. 여기에 값을 직접 적으면
// scripts/check-retools-info.ts 가 배포를 멈춘다.
// ============================================================

export const metadata: Metadata = {
  title: "이용약관 | 복비 계산기",
  description:
    "복비 계산기(리툴스)의 이용약관입니다. 계산 결과는 참고용이며 확정된 세액이나 중개보수액이 아닙니다.",
};

/** 약관이 실제로 시행된 날. 문구를 고칠 때 이 값도 함께 고친다. */
const EFFECTIVE_DATE = "2026년 9월 6일";

function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="text-[15px] font-bold text-navy">{title}</h2>
      <div className="mt-2 space-y-2 text-[13.5px] leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

export default function CalculatorTermsPage() {
  const r = RETOOLS_INFO;

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <header className="border-b border-gray-200 pb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-cobalt">복비 계산기</p>
        <h1 className="mt-2 text-2xl font-bold text-navy">이용약관</h1>
        <p className="mt-3 text-[12.5px] leading-relaxed text-gray-500">
          시행일 {EFFECTIVE_DATE} · 서비스 운영 {r.companyName}
        </p>
      </header>

      <p className="mt-6 rounded-xl bg-mist px-4 py-4 text-[14px] font-semibold leading-relaxed text-navy">
        이 앱이 내놓는 값은 참고용 계산 결과이며, 확정된 세액이나 중개보수액이 아닙니다. 실제
        거래와 신고에 쓰기 전에는 관할 관청과 개업공인중개사, 세무 전문가에게 확인하셔야 합니다.
      </p>

      <Article title="제1조 (목적)">
        <p>
          이 약관은 {r.companyName}(이하 &ldquo;회사&rdquo;)가 제공하는 「복비 계산기」(이하
          &ldquo;이 앱&rdquo;)를 이용하는 데 필요한 사항을 정합니다. 이 앱은 웹과 안드로이드
          응용프로그램으로 제공되며, 둘 다 이 약관을 따릅니다.
        </p>
      </Article>

      <Article title="제2조 (이 앱이 제공하는 것)">
        <p>
          ① 이 앱은 부동산 거래에 쓰이는 계산 도구 여섯 가지를 제공합니다. 복비 계산, 잔금일 일할,
          취득세·부대, 상가·수익률, 평수·평단가, 전월세·5% 입니다.
        </p>
        <p>
          ② 이 앱은 무료입니다. 회원가입과 로그인 절차가 없고, 이용료를 받지 않으며, 결제 기능이
          없습니다.
        </p>
        <p>
          ③ 이용자는 별도의 신청 없이 이 앱에 접속하는 것만으로 이용할 수 있습니다. 접속하여
          이용하면 이 약관에 동의한 것으로 봅니다.
        </p>
      </Article>

      <Article title="제3조 (계산 결과의 성격)">
        <p>
          ① 이 앱이 내놓는 값은 참고용 계산 결과이며, 확정된 세액이나 중개보수액이 아닙니다.
        </p>
        <p>
          ② 중개보수는 「공인중개사법」과 시·도 조례가 정한 상한요율을 기준으로 계산하며, 실제
          보수는 그 범위 안에서 거래 당사자와 개업공인중개사가 협의하여 정합니다. 취득세와 그
          부대비용도 지방세 관계 법령과 조례, 그리고 개별 거래의 사정에 따라 달라집니다.
        </p>
        <p>
          ③ 법령과 요율, 공시 기준은 바뀝니다. 회사는 이를 반영하려고 노력하지만, 이 앱의 계산
          기준이 항상 최신임을 보장하지 않습니다.
        </p>
        <p>
          ④ 그러므로 실제 거래와 신고에 쓰기 전에는 관할 관청, 개업공인중개사, 세무 전문가에게
          확인하셔야 합니다. 이용자가 이 앱의 결과를 확인 없이 그대로 사용하여 생긴 손해에 대하여
          회사는 책임을 지지 않습니다.
        </p>
      </Article>

      <Article title="제4조 (외부에서 받아오는 정보)">
        <p>
          전월세 전환 계산에 쓰는 한국은행 기준금리는 회사의 서버가 한국은행 ECOS 공개 자료에서
          받아와 전달합니다. 그 자료의 정확성과 제공 여부는 한국은행이 정하며, 자료를 받지 못하는
          동안에는 해당 계산이 동작하지 않을 수 있습니다.
        </p>
      </Article>

      <Article title="제5조 (개인정보)">
        <p>
          이 앱은 이용자의 개인정보를 수집하지 않습니다. 이용자가 입력한 금액과 면적은 이용자의
          기기 안에서 계산되며 회사의 서버로 전송되지 않습니다. 자세한 내용은 별도의
          개인정보처리방침에 따릅니다.
        </p>
      </Article>

      <Article title="제6조 (이용자가 하지 않아야 할 것)">
        <p>① 자동화된 수단으로 이 앱에 반복 접속하여 서비스 운영을 방해하는 행위</p>
        <p>② 이 앱을 역으로 분석하거나 복제하여 같은 기능의 서비스를 제공하는 행위</p>
        <p>③ 회사의 상표와 표장을 회사의 서비스인 것처럼 오인하게 쓰는 행위</p>
        <p>④ 그 밖에 법령을 어기거나 다른 이용자의 이용을 방해하는 행위</p>
      </Article>

      <Article title="제7조 (서비스의 변경과 중단)">
        <p>① 회사는 계산 기능과 화면을 개선하기 위하여 이 앱의 내용을 변경할 수 있습니다.</p>
        <p>
          ② 회사는 시스템 점검과 장애 복구, 그 밖에 부득이한 사유가 있을 때 이 앱의 제공을
          일시적으로 멈출 수 있습니다. 미리 알릴 수 있는 경우에는 이 앱 안에 알립니다.
        </p>
        <p>
          ③ 회사가 이 앱의 제공을 완전히 끝내려는 경우에는 최소 30일 전에 이 앱 안에 알립니다.
        </p>
      </Article>

      <Article title="제8조 (지식재산권)">
        <p>
          이 앱의 화면 구성과 계산 논리, 문구, 상표에 관한 권리는 회사에 있습니다. 이용자는 계산
          결과를 자신의 업무와 거래에 자유롭게 쓸 수 있으나, 이 앱 자체를 복제하거나 배포할 수는
          없습니다.
        </p>
      </Article>

      <Article title="제9조 (책임의 한계)">
        <p>
          ① 회사는 무료로 제공되는 이 앱에 관하여, 회사의 고의 또는 중대한 과실이 없는 한
          이용자에게 생긴 손해를 배상할 책임을 지지 않습니다.
        </p>
        <p>
          ② 천재지변, 정전, 통신망 장애, 외부 자료 제공처의 사정과 같이 회사가 통제할 수 없는
          사유로 이 앱을 제공하지 못한 경우에도 같습니다.
        </p>
        <p>
          ③ 이 조항은 법령이 회사의 책임을 면제하지 못하도록 정한 부분에는 적용되지 않습니다.
        </p>
      </Article>

      <Article title="제10조 (약관의 변경)">
        <p>
          ① 회사는 필요한 경우 이 약관을 바꿀 수 있으며, 바뀐 약관은 시행일 7일 전부터 이 앱 안에
          알립니다.
        </p>
        <p>② 이용자에게 불리하게 바뀌는 경우에는 시행일 30일 전부터 알립니다.</p>
        <p>③ 알린 뒤에도 이용자가 이 앱을 계속 이용하면 바뀐 약관에 동의한 것으로 봅니다.</p>
      </Article>

      <Article title="제11조 (준거법과 분쟁 해결)">
        <p>① 이 약관과 이 앱의 이용에 관하여는 대한민국 법을 적용합니다.</p>
        <p>
          ② 회사와 이용자 사이에 다툼이 생긴 경우 서로 협의하여 해결하며, 협의가 이루어지지 않으면
          민사소송법이 정한 관할 법원에 소를 제기합니다.
        </p>
      </Article>

      <Article title="제12조 (문의)">
        <p>
          {r.ceoName} · {r.phone} ({r.phoneHours}) · {r.email}
        </p>
      </Article>

      <Article title="부칙">
        <p>이 약관은 {EFFECTIVE_DATE}부터 시행합니다.</p>
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
