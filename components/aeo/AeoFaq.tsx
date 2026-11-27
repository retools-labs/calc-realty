import { AEO_FAQS } from "@/lib/aeo/faq";

export default function AeoFaq() {
  return (
    <section className="mt-8" aria-labelledby="aeo-faq-title">
      <h2 id="aeo-faq-title" className="text-lg font-bold text-[#16232E]">복비 금액 자주 묻는 질문</h2>
      <div className="mt-3 space-y-5">
        {AEO_FAQS.map((faq) => (
          <div key={faq.question}>
            <h3 className="font-semibold text-[#333D4B]">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
