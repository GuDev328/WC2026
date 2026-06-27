import type { Group } from '../types'

// WC2026: 12 groups (A-L) × 4 teams = 48 teams
// Group assignments based on actual match data
const GROUPS: Group[] = [
  {
    id: 'A', name: 'Bảng A', teams: [
      { id: 'mex', name: 'Mexico', nameVi: 'Mexico', flag: '🇲🇽', fifaCode: 'MEX' },
      { id: 'kor', name: 'South Korea', nameVi: 'Hàn Quốc', flag: '🇰🇷', fifaCode: 'KOR' },
      { id: 'rsa', name: 'South Africa', nameVi: 'Nam Phi', flag: '🇿🇦', fifaCode: 'RSA' },
      { id: 'cze', name: 'Czech Republic', nameVi: 'CH Séc', flag: '🇨🇿', fifaCode: 'CZE' },
    ],
  },
  {
    id: 'B', name: 'Bảng B', teams: [
      { id: 'can', name: 'Canada', nameVi: 'Canada', flag: '🇨🇦', fifaCode: 'CAN' },
      { id: 'sui', name: 'Switzerland', nameVi: 'Thụy Sĩ', flag: '🇨🇭', fifaCode: 'SUI' },
      { id: 'bih', name: 'Bosnia & Herz.', nameVi: 'Bosnia', flag: '🇧🇦', fifaCode: 'BIH' },
      { id: 'qat', name: 'Qatar', nameVi: 'Qatar', flag: '🇶🇦', fifaCode: 'QAT' },
    ],
  },
  {
    id: 'C', name: 'Bảng C', teams: [
      { id: 'usa', name: 'United States', nameVi: 'Hoa Kỳ', flag: '🇺🇸', fifaCode: 'USA' },
      { id: 'aus', name: 'Australia', nameVi: 'Úc', flag: '🇦🇺', fifaCode: 'AUS' },
      { id: 'tur', name: 'Turkey', nameVi: 'Thổ Nhĩ Kỳ', flag: '🇹🇷', fifaCode: 'TUR' },
      { id: 'par', name: 'Paraguay', nameVi: 'Paraguay', flag: '🇵🇾', fifaCode: 'PAR' },
    ],
  },
  {
    id: 'D', name: 'Bảng D', teams: [
      { id: 'arg', name: 'Argentina', nameVi: 'Argentina', flag: '🇦🇷', fifaCode: 'ARG' },
      { id: 'aut', name: 'Austria', nameVi: 'Áo', flag: '🇦🇹', fifaCode: 'AUT' },
      { id: 'alg', name: 'Algeria', nameVi: 'Algérie', flag: '🇩🇿', fifaCode: 'ALG' },
      { id: 'jor', name: 'Jordan', nameVi: 'Jordan', flag: '🇯🇴', fifaCode: 'JOR' },
    ],
  },
  {
    id: 'E', name: 'Bảng E', teams: [
      { id: 'bra', name: 'Brazil', nameVi: 'Brazil', flag: '🇧🇷', fifaCode: 'BRA' },
      { id: 'mar', name: 'Morocco', nameVi: 'Ma Rốc', flag: '🇲🇦', fifaCode: 'MAR' },
      { id: 'sco', name: 'Scotland', nameVi: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', fifaCode: 'SCO' },
      { id: 'hai', name: 'Haiti', nameVi: 'Haiti', flag: '🇭🇹', fifaCode: 'HAI' },
    ],
  },
  {
    id: 'F', name: 'Bảng F', teams: [
      { id: 'ger', name: 'Germany', nameVi: 'Đức', flag: '🇩🇪', fifaCode: 'GER' },
      { id: 'civ', name: 'Ivory Coast', nameVi: 'Bờ Biển Ngà', flag: '🇨🇮', fifaCode: 'CIV' },
      { id: 'ecu', name: 'Ecuador', nameVi: 'Ecuador', flag: '🇪🇨', fifaCode: 'ECU' },
      { id: 'cuw', name: 'Curaçao', nameVi: 'Curaçao', flag: '🇨🇼', fifaCode: 'CUW' },
    ],
  },
  {
    id: 'G', name: 'Bảng G', teams: [
      { id: 'por', name: 'Portugal', nameVi: 'Bồ Đào Nha', flag: '🇵🇹', fifaCode: 'POR' },
      { id: 'col', name: 'Colombia', nameVi: 'Colombia', flag: '🇨🇴', fifaCode: 'COL' },
      { id: 'cod', name: 'DR Congo', nameVi: 'CHDC Congo', flag: '🇨🇩', fifaCode: 'COD' },
      { id: 'uzb', name: 'Uzbekistan', nameVi: 'Uzbekistan', flag: '🇺🇿', fifaCode: 'UZB' },
    ],
  },
  {
    id: 'H', name: 'Bảng H', teams: [
      { id: 'esp', name: 'Spain', nameVi: 'Tây Ban Nha', flag: '🇪🇸', fifaCode: 'ESP' },
      { id: 'cpv', name: 'Cape Verde', nameVi: 'Cabo Verde', flag: '🇨🇻', fifaCode: 'CPV' },
      { id: 'uru', name: 'Uruguay', nameVi: 'Uruguay', flag: '🇺🇾', fifaCode: 'URU' },
      { id: 'ksa', name: 'Saudi Arabia', nameVi: 'Ả Rập Saudi', flag: '🇸🇦', fifaCode: 'KSA' },
    ],
  },
  {
    id: 'I', name: 'Bảng I', teams: [
      { id: 'eng', name: 'England', nameVi: 'Anh', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fifaCode: 'ENG' },
      { id: 'gha', name: 'Ghana', nameVi: 'Ghana', flag: '🇬🇭', fifaCode: 'GHA' },
      { id: 'cro', name: 'Croatia', nameVi: 'Croatia', flag: '🇭🇷', fifaCode: 'CRO' },
      { id: 'pan', name: 'Panama', nameVi: 'Panama', flag: '🇵🇦', fifaCode: 'PAN' },
    ],
  },
  {
    id: 'J', name: 'Bảng J', teams: [
      { id: 'fra', name: 'France', nameVi: 'Pháp', flag: '🇫🇷', fifaCode: 'FRA' },
      { id: 'nor', name: 'Norway', nameVi: 'Na Uy', flag: '🇳🇴', fifaCode: 'NOR' },
      { id: 'sen', name: 'Senegal', nameVi: 'Sénégal', flag: '🇸🇳', fifaCode: 'SEN' },
      { id: 'irq', name: 'Iraq', nameVi: 'Iraq', flag: '🇮🇶', fifaCode: 'IRQ' },
    ],
  },
  {
    id: 'K', name: 'Bảng K', teams: [
      { id: 'ned', name: 'Netherlands', nameVi: 'Hà Lan', flag: '🇳🇱', fifaCode: 'NED' },
      { id: 'jpn', name: 'Japan', nameVi: 'Nhật Bản', flag: '🇯🇵', fifaCode: 'JPN' },
      { id: 'swe', name: 'Sweden', nameVi: 'Thụy Điển', flag: '🇸🇪', fifaCode: 'SWE' },
      { id: 'tun', name: 'Tunisia', nameVi: 'Tunisia', flag: '🇹🇳', fifaCode: 'TUN' },
    ],
  },
  {
    id: 'L', name: 'Bảng L', teams: [
      { id: 'ita', name: 'Italy', nameVi: 'Ý', flag: '🇮🇹', fifaCode: 'ITA' },
      { id: 'den', name: 'Denmark', nameVi: 'Đan Mạch', flag: '🇩🇰', fifaCode: 'DEN' },
      { id: 'nga', name: 'Nigeria', nameVi: 'Nigeria', flag: '🇳🇬', fifaCode: 'NGA' },
      { id: 'per', name: 'Peru', nameVi: 'Peru', flag: '🇵🇪', fifaCode: 'PER' },
    ],
  },
]

export default GROUPS
