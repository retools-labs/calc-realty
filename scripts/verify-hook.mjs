import { detectPlay, getPartnerHookUrl } from '../lib/partnerHook.ts';

const playUrl = getPartnerHookUrl(true);
const webUrl = getPartnerHookUrl(false);

if (playUrl !== 'https://retools.kr/book/realty?utm_source=play_realtycalc&utm_medium=app&utm_campaign=hook_card') {
  throw new Error(`플레이 URL이 다릅니다: ${playUrl}`);
}
if (webUrl !== 'https://retools.kr/book/realty?utm_source=web_realtycalc&utm_medium=web&utm_campaign=hook_card') {
  throw new Error(`웹 URL이 다릅니다: ${webUrl}`);
}
function memoryStorage() {
  const map = new Map();
  return { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v) };
}
const check = (ok, msg) => { if (!ok) throw new Error(msg); };
const session = memoryStorage();
check(detectPlay({ referrer: 'android-app://kr.retools.realtycalc/', storage: session }), '플레이 referrer 를 못 읽었습니다.');
check(session.getItem('rt_play') === '1', '앱 세션에 기억하지 않았습니다.');
check(detectPlay({ referrer: '', storage: session }), '같은 앱 화면에서 기억을 잃었습니다.');
check(!detectPlay({ referrer: '', storage: memoryStorage() }), '다른 탭(일반 크롬)을 플레이로 읽었습니다.');
check(!detectPlay({ referrer: 'android-app://kr.retools.realtycalcx', storage: memoryStorage() }), '다른 패키지를 플레이로 읽었습니다.');

console.log('후킹 카드 URL·플레이 판정 검증 완료.');
