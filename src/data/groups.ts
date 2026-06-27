import type { Group } from '../types'

// WC2026: 12 groups (A-L) × 4 teams = 48 teams
// Group assignments based on actual match data
const GROUPS: Group[] = [
  {
    id: 'A', name: 'Bảng A', teams: [
      { id: 'mex', name: 'Mexico', nameVi: 'Mexico', flag: '🇲🇽', fifaCode: 'MEX', iso2: 'mx' },
      { id: 'kor', name: 'South Korea', nameVi: 'Hàn Quốc', flag: '🇰🇷', fifaCode: 'KOR', iso2: 'kr' },
      { id: 'rsa', name: 'South Africa', nameVi: 'Nam Phi', flag: '🇿🇦', fifaCode: 'RSA', iso2: 'za' },
      { id: 'cze', name: 'Czech Republic', nameVi: 'CH Séc', flag: '🇨🇿', fifaCode: 'CZE', iso2: 'cz' },
    ],
  },
  {
    id: 'B', name: 'Bảng B', teams: [
      { id: 'can', name: 'Canada', nameVi: 'Canada', flag: '🇨🇦', fifaCode: 'CAN', iso2: 'ca' },
      { id: 'sui', name: 'Switzerland', nameVi: 'Thụy Sĩ', flag: '🇨🇭', fifaCode: 'SUI', iso2: 'ch' },
      { id: 'bih', name: 'Bosnia & Herz.', nameVi: 'Bosnia', flag: '🇧🇦', fifaCode: 'BIH', iso2: 'ba' },
      { id: 'qat', name: 'Qatar', nameVi: 'Qatar', flag: '🇶🇦', fifaCode: 'QAT', iso2: 'qa' },
    ],
  },
  {
    id: 'C', name: 'Bảng C', teams: [
      { id: 'usa', name: 'United States', nameVi: 'Hoa Kỳ', flag: '🇺🇸', fifaCode: 'USA', iso2: 'us' },
      { id: 'aus', name: 'Australia', nameVi: 'Úc', flag: '🇦🇺', fifaCode: 'AUS', iso2: 'au' },
      { id: 'tur', name: 'Turkey', nameVi: 'Thổ Nhĩ Kỳ', flag: '🇹🇷', fifaCode: 'TUR', iso2: 'tr' },
      { id: 'par', name: 'Paraguay', nameVi: 'Paraguay', flag: '🇵🇾', fifaCode: 'PAR', iso2: 'py' },
    ],
  },
  {
    id: 'D', name: 'Bảng D', teams: [
      { id: 'arg', name: 'Argentina', nameVi: 'Argentina', flag: '🇦🇷', fifaCode: 'ARG', iso2: 'ar' },
      { id: 'aut', name: 'Austria', nameVi: 'Áo', flag: '🇦🇹', fifaCode: 'AUT', iso2: 'at' },
      { id: 'alg', name: 'Algeria', nameVi: 'Algérie', flag: '🇩🇿', fifaCode: 'ALG', iso2: 'dz' },
      { id: 'jor', name: 'Jordan', nameVi: 'Jordan', flag: '🇯🇴', fifaCode: 'JOR', iso2: 'jo' },
    ],
  },
  {
    id: 'E', name: 'Bảng E', teams: [
      { id: 'bra', name: 'Brazil', nameVi: 'Brazil', flag: '🇧🇷', fifaCode: 'BRA', iso2: 'br' },
      { id: 'mar', name: 'Morocco', nameVi: 'Ma Rốc', flag: '🇲🇦', fifaCode: 'MAR', iso2: 'ma' },
      { id: 'sco', name: 'Scotland', nameVi: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', fifaCode: 'SCO', iso2: 'gb-sct' },
      { id: 'hai', name: 'Haiti', nameVi: 'Haiti', flag: '🇭🇹', fifaCode: 'HAI', iso2: 'ht' },
    ],
  },
  {
    id: 'F', name: 'Bảng F', teams: [
      { id: 'ger', name: 'Germany', nameVi: 'Đức', flag: '🇩🇪', fifaCode: 'GER', iso2: 'de' },
      { id: 'civ', name: 'Ivory Coast', nameVi: 'Bờ Biển Ngà', flag: '🇨🇮', fifaCode: 'CIV', iso2: 'ci' },
      { id: 'ecu', name: 'Ecuador', nameVi: 'Ecuador', flag: '🇪🇨', fifaCode: 'ECU', iso2: 'ec' },
      { id: 'cuw', name: 'Curaçao', nameVi: 'Curaçao', flag: '🇨🇼', fifaCode: 'CUW', iso2: 'cw' },
    ],
  },
  {
    id: 'G', name: 'Bảng G', teams: [
      { id: 'por', name: 'Portugal', nameVi: 'Bồ Đào Nha', flag: '🇵🇹', fifaCode: 'POR', iso2: 'pt' },
      { id: 'col', name: 'Colombia', nameVi: 'Colombia', flag: '🇨🇴', fifaCode: 'COL', iso2: 'co' },
      { id: 'cod', name: 'DR Congo', nameVi: 'CHDC Congo', flag: '🇨🇩', fifaCode: 'COD', iso2: 'cd' },
      { id: 'uzb', name: 'Uzbekistan', nameVi: 'Uzbekistan', flag: '🇺🇿', fifaCode: 'UZB', iso2: 'uz' },
    ],
  },
  {
    id: 'H', name: 'Bảng H', teams: [
      { id: 'esp', name: 'Spain', nameVi: 'Tây Ban Nha', flag: '🇪🇸', fifaCode: 'ESP', iso2: 'es' },
      { id: 'cpv', name: 'Cape Verde', nameVi: 'Cabo Verde', flag: '🇨🇻', fifaCode: 'CPV', iso2: 'cv' },
      { id: 'uru', name: 'Uruguay', nameVi: 'Uruguay', flag: '🇺🇾', fifaCode: 'URU', iso2: 'uy' },
      { id: 'ksa', name: 'Saudi Arabia', nameVi: 'Ả Rập Saudi', flag: '🇸🇦', fifaCode: 'KSA', iso2: 'sa' },
    ],
  },
  {
    id: 'I', name: 'Bảng I', teams: [
      { id: 'eng', name: 'England', nameVi: 'Anh', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fifaCode: 'ENG', iso2: 'gb-eng' },
      { id: 'gha', name: 'Ghana', nameVi: 'Ghana', flag: '🇬🇭', fifaCode: 'GHA', iso2: 'gh' },
      { id: 'cro', name: 'Croatia', nameVi: 'Croatia', flag: '🇭🇷', fifaCode: 'CRO', iso2: 'hr' },
      { id: 'pan', name: 'Panama', nameVi: 'Panama', flag: '🇵🇦', fifaCode: 'PAN', iso2: 'pa' },
    ],
  },
  {
    id: 'J', name: 'Bảng J', teams: [
      { id: 'fra', name: 'France', nameVi: 'Pháp', flag: '🇫🇷', fifaCode: 'FRA', iso2: 'fr' },
      { id: 'nor', name: 'Norway', nameVi: 'Na Uy', flag: '🇳🇴', fifaCode: 'NOR', iso2: 'no' },
      { id: 'sen', name: 'Senegal', nameVi: 'Sénégal', flag: '🇸🇳', fifaCode: 'SEN', iso2: 'sn' },
      { id: 'irq', name: 'Iraq', nameVi: 'Iraq', flag: '🇮🇶', fifaCode: 'IRQ', iso2: 'iq' },
    ],
  },
  {
    id: 'K', name: 'Bảng K', teams: [
      { id: 'ned', name: 'Netherlands', nameVi: 'Hà Lan', flag: '🇳🇱', fifaCode: 'NED', iso2: 'nl' },
      { id: 'jpn', name: 'Japan', nameVi: 'Nhật Bản', flag: '🇯🇵', fifaCode: 'JPN', iso2: 'jp' },
      { id: 'swe', name: 'Sweden', nameVi: 'Thụy Điển', flag: '🇸🇪', fifaCode: 'SWE', iso2: 'se' },
      { id: 'tun', name: 'Tunisia', nameVi: 'Tunisia', flag: '🇹🇳', fifaCode: 'TUN', iso2: 'tn' },
    ],
  },
  {
    id: 'L', name: 'Bảng L', teams: [
      { id: 'ita', name: 'Italy', nameVi: 'Ý', flag: '🇮🇹', fifaCode: 'ITA', iso2: 'it' },
      { id: 'den', name: 'Denmark', nameVi: 'Đan Mạch', flag: '🇩🇰', fifaCode: 'DEN', iso2: 'dk' },
      { id: 'nga', name: 'Nigeria', nameVi: 'Nigeria', flag: '🇳🇬', fifaCode: 'NGA', iso2: 'ng' },
      { id: 'per', name: 'Peru', nameVi: 'Peru', flag: '🇵🇪', fifaCode: 'PER', iso2: 'pe' },
    ],
  },
]

export default GROUPS
