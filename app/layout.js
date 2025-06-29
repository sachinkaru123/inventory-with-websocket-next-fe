import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "../lib/providers/ReduxProvider";
import { SocketProvider } from "../lib/providers/SocketProvider";
import { ToastNotifications } from "../lib/components/ToastNotifications";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Inventory WebSocket App",
  description: "Real-time inventory management with WebSocket",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <SocketProvider>
            {children}
            <ToastNotifications />
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
