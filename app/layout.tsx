import { Ubuntu } from "next/font/google"
import { AuthProvider } from "@/components/auth-context"
import "./globals.css"

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
})

export const metadata = {
  title: "Threat X - Python Typing Test",
  description: "Master your Python coding speed with Threat X",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={ubuntu.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
