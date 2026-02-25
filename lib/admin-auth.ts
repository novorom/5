// Simple admin authentication using a passcode stored in environment variable
// For production use, consider using proper authentication with bcrypt and database

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "admin123"

export function verifyAdminAccess(passcode: string): boolean {
  console.log("[v0] Admin auth check - passcode exists:", !!ADMIN_PASSCODE, "env set:", !!process.env.NEXT_PUBLIC_ADMIN_PASSCODE)
  const isValid = passcode === ADMIN_PASSCODE
  console.log("[v0] Password verification result:", isValid)
  return isValid
}

export function getAdminPasscode(): string {
  return ADMIN_PASSCODE
}
