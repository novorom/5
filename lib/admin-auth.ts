// Simple admin authentication using a passcode stored in environment variable
// For production use, consider using proper authentication with bcrypt and database

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "admin123"

export function verifyAdminAccess(passcode: string): boolean {
  return passcode === ADMIN_PASSCODE
}

export function getAdminPasscode(): string {
  return ADMIN_PASSCODE
}
