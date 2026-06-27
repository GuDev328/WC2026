const dateFmt = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' })
const timeFmt = new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' })
const dtFmt = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export function formatDateVi(iso: string): string {
  return dateFmt.format(new Date(iso))
}

export function formatDateTimeVi(iso: string): string {
  return dateFmt.format(new Date(iso)) + '\n' + timeFmt.format(new Date(iso))
}

export function formatDateTimeViFull(iso: string): string {
  return dtFmt.format(new Date(iso))
}
