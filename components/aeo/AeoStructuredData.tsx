import { isAeoV1Enabled } from "@/lib/aeo/flag";
import { getAeoStructuredData, serializeJsonLd } from "@/lib/aeo/structuredData";

export default function AeoStructuredData() {
  if (!isAeoV1Enabled()) return null;

  return getAeoStructuredData().map((data) => (
    <script
      key={data["@type"]}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  ));
}
