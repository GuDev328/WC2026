import type { Team } from '../types'

const TEAMS: Record<string, Team> = {
  // Group A
  mex: { id: 'mex', name: 'Mexico', nameVi: 'Mexico', flag: '🇲🇽', fifaCode: 'MEX', iso2: 'mx' },
  kor: { id: 'kor', name: 'South Korea', nameVi: 'Hàn Quốc', flag: '🇰🇷', fifaCode: 'KOR', iso2: 'kr' },
  rsa: { id: 'rsa', name: 'South Africa', nameVi: 'Nam Phi', flag: '🇿🇦', fifaCode: 'RSA', iso2: 'za' },
  cze: { id: 'cze', name: 'Czech Republic', nameVi: 'CH Séc', flag: '🇨🇿', fifaCode: 'CZE', iso2: 'cz' },
  // Group B
  can: { id: 'can', name: 'Canada', nameVi: 'Canada', flag: '🇨🇦', fifaCode: 'CAN', iso2: 'ca' },
  sui: { id: 'sui', name: 'Switzerland', nameVi: 'Thụy Sĩ', flag: '🇨🇭', fifaCode: 'SUI', iso2: 'ch' },
  bih: { id: 'bih', name: 'Bosnia & Herz.', nameVi: 'Bosnia', flag: '🇧🇦', fifaCode: 'BIH', iso2: 'ba' },
  qat: { id: 'qat', name: 'Qatar', nameVi: 'Qatar', flag: '🇶🇦', fifaCode: 'QAT', iso2: 'qa' },
  // Group C
  usa: { id: 'usa', name: 'United States', nameVi: 'Hoa Kỳ', flag: '🇺🇸', fifaCode: 'USA', iso2: 'us' },
  aus: { id: 'aus', name: 'Australia', nameVi: 'Úc', flag: '🇦🇺', fifaCode: 'AUS', iso2: 'au' },
  tur: { id: 'tur', name: 'Turkey', nameVi: 'Thổ Nhĩ Kỳ', flag: '🇹🇷', fifaCode: 'TUR', iso2: 'tr' },
  par: { id: 'par', name: 'Paraguay', nameVi: 'Paraguay', flag: '🇵🇾', fifaCode: 'PAR', iso2: 'py' },
  // Group D
  arg: { id: 'arg', name: 'Argentina', nameVi: 'Argentina', flag: '🇦🇷', fifaCode: 'ARG', iso2: 'ar' },
  aut: { id: 'aut', name: 'Austria', nameVi: 'Áo', flag: '🇦🇹', fifaCode: 'AUT', iso2: 'at' },
  alg: { id: 'alg', name: 'Algeria', nameVi: 'Algérie', flag: '🇩🇿', fifaCode: 'ALG', iso2: 'dz' },
  jor: { id: 'jor', name: 'Jordan', nameVi: 'Jordan', flag: '🇯🇴', fifaCode: 'JOR', iso2: 'jo' },
  // Group E
  bra: { id: 'bra', name: 'Brazil', nameVi: 'Brazil', flag: '🇧🇷', fifaCode: 'BRA', iso2: 'br' },
  mar: { id: 'mar', name: 'Morocco', nameVi: 'Ma Rốc', flag: '🇲🇦', fifaCode: 'MAR', iso2: 'ma' },
  sco: { id: 'sco', name: 'Scotland', nameVi: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', fifaCode: 'SCO', iso2: 'gb-sct' },
  hai: { id: 'hai', name: 'Haiti', nameVi: 'Haiti', flag: '🇭🇹', fifaCode: 'HAI', iso2: 'ht' },
  // Group F
  ger: { id: 'ger', name: 'Germany', nameVi: 'Đức', flag: '🇩🇪', fifaCode: 'GER', iso2: 'de' },
  civ: { id: 'civ', name: 'Ivory Coast', nameVi: 'Bờ Biển Ngà', flag: '🇨🇮', fifaCode: 'CIV', iso2: 'ci' },
  ecu: { id: 'ecu', name: 'Ecuador', nameVi: 'Ecuador', flag: '🇪🇨', fifaCode: 'ECU', iso2: 'ec' },
  cuw: { id: 'cuw', name: 'Curaçao', nameVi: 'Curaçao', flag: '🇨🇼', fifaCode: 'CUW', iso2: 'cw' },
  // Group G
  por: { id: 'por', name: 'Portugal', nameVi: 'Bồ Đào Nha', flag: '🇵🇹', fifaCode: 'POR', iso2: 'pt' },
  col: { id: 'col', name: 'Colombia', nameVi: 'Colombia', flag: '🇨🇴', fifaCode: 'COL', iso2: 'co' },
  cod: { id: 'cod', name: 'DR Congo', nameVi: 'CHDC Congo', flag: '🇨🇩', fifaCode: 'COD', iso2: 'cd' },
  uzb: { id: 'uzb', name: 'Uzbekistan', nameVi: 'Uzbekistan', flag: '🇺🇿', fifaCode: 'UZB', iso2: 'uz' },
  // Group H
  esp: { id: 'esp', name: 'Spain', nameVi: 'Tây Ban Nha', flag: '🇪🇸', fifaCode: 'ESP', iso2: 'es' },
  cpv: { id: 'cpv', name: 'Cape Verde', nameVi: 'Cabo Verde', flag: '🇨🇻', fifaCode: 'CPV', iso2: 'cv' },
  uru: { id: 'uru', name: 'Uruguay', nameVi: 'Uruguay', flag: '🇺🇾', fifaCode: 'URU', iso2: 'uy' },
  ksa: { id: 'ksa', name: 'Saudi Arabia', nameVi: 'Ả Rập Saudi', flag: '🇸🇦', fifaCode: 'KSA', iso2: 'sa' },
  // Group I
  eng: { id: 'eng', name: 'England', nameVi: 'Anh', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fifaCode: 'ENG', iso2: 'gb-eng' },
  gha: { id: 'gha', name: 'Ghana', nameVi: 'Ghana', flag: '🇬🇭', fifaCode: 'GHA', iso2: 'gh' },
  cro: { id: 'cro', name: 'Croatia', nameVi: 'Croatia', flag: '🇭🇷', fifaCode: 'CRO', iso2: 'hr' },
  pan: { id: 'pan', name: 'Panama', nameVi: 'Panama', flag: '🇵🇦', fifaCode: 'PAN', iso2: 'pa' },
  // Group J
  fra: { id: 'fra', name: 'France', nameVi: 'Pháp', flag: '🇫🇷', fifaCode: 'FRA', iso2: 'fr' },
  nor: { id: 'nor', name: 'Norway', nameVi: 'Na Uy', flag: '🇳🇴', fifaCode: 'NOR', iso2: 'no' },
  sen: { id: 'sen', name: 'Senegal', nameVi: 'Sénégal', flag: '🇸🇳', fifaCode: 'SEN', iso2: 'sn' },
  irq: { id: 'irq', name: 'Iraq', nameVi: 'Iraq', flag: '🇮🇶', fifaCode: 'IRQ', iso2: 'iq' },
  // Group K
  ned: { id: 'ned', name: 'Netherlands', nameVi: 'Hà Lan', flag: '🇳🇱', fifaCode: 'NED', iso2: 'nl' },
  jpn: { id: 'jpn', name: 'Japan', nameVi: 'Nhật Bản', flag: '🇯🇵', fifaCode: 'JPN', iso2: 'jp' },
  swe: { id: 'swe', name: 'Sweden', nameVi: 'Thụy Điển', flag: '🇸🇪', fifaCode: 'SWE', iso2: 'se' },
  tun: { id: 'tun', name: 'Tunisia', nameVi: 'Tunisia', flag: '🇹🇳', fifaCode: 'TUN', iso2: 'tn' },
  // Group L
  ita: { id: 'ita', name: 'Italy', nameVi: 'Ý', flag: '🇮🇹', fifaCode: 'ITA', iso2: 'it' },
  den: { id: 'den', name: 'Denmark', nameVi: 'Đan Mạch', flag: '🇩🇰', fifaCode: 'DEN', iso2: 'dk' },
  nga: { id: 'nga', name: 'Nigeria', nameVi: 'Nigeria', flag: '🇳🇬', fifaCode: 'NGA', iso2: 'ng' },
  per: { id: 'per', name: 'Peru', nameVi: 'Peru', flag: '🇵🇪', fifaCode: 'PER', iso2: 'pe' },
  // Extra teams from API
  bel: { id: 'bel', name: 'Belgium', nameVi: 'Bỉ', flag: '🇧🇪', fifaCode: 'BEL', iso2: 'be' },
  irn: { id: 'irn', name: 'Iran', nameVi: 'Iran', flag: '🇮🇷', fifaCode: 'IRN', iso2: 'ir' },
  egy: { id: 'egy', name: 'Egypt', nameVi: 'Ai Cập', flag: '🇪🇬', fifaCode: 'EGY', iso2: 'eg' },
  nzl: { id: 'nzl', name: 'New Zealand', nameVi: 'New Zealand', flag: '🇳🇿', fifaCode: 'NZL', iso2: 'nz' },
}

export default TEAMS
