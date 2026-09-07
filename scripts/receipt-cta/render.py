# X-41 영수증 CTA 3판 렌더. 같은 폴더의 receipt-cta-v3.html 을 1460×460, 배율 2 로 찍는다.
import pathlib
from playwright.sync_api import sync_playwright
here = pathlib.Path(__file__).resolve().parent
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1460, "height": 460}, device_scale_factor=2)
    pg.goto((here / "receipt-cta-v3.html").as_uri())
    pg.wait_for_timeout(800)
    pg.screenshot(path=str(here / "receipt-cta-v3.png"))
    b.close()
print("ok")
