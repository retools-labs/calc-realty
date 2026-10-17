import { getPartnerHookUrl, hasPlayCookie } from '../lib/partnerHook.ts';

const playUrl = getPartnerHookUrl(true);
const webUrl = getPartnerHookUrl(false);

if (playUrl !== 'https://retools.kr/book/realty?utm_source=play_realtycalc&utm_medium=app&utm_campaign=hook_card') {
  throw new Error(`플레이 URL이 다릅니다: ${playUrl}`);
}
if (webUrl !== 'https://retools.kr/book/realty?utm_source=web_realtycalc&utm_medium=web') {
  throw new Error(`웹 URL이 다릅니다: ${webUrl}`);
}
if (!hasPlayCookie('foo=bar; rt_play=1')) {
  throw new Error('rt_play 쿠키를 읽지 못했습니다.');
}
if (hasPlayCookie('foo=bar; rt_play=0')) {
  throw new Error('rt_play가 아닌 쿠키를 플레이 유입으로 읽었습니다.');
}

console.log('후킹 카드 URL·플레이 쿠키 검증 완료.');
