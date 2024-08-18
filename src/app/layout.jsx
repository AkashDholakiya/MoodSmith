import { Urbanist } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { ThemeProvider } from "../components/theme-provider";
import { Navbar } from "../components/Navbar";
import { icons } from "lucide-react";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata = {
  title: "MoodSmith",
  description: "This web app is a mood detection game that uses your webcam to detect your mood. Apart from that it provides personalized AI chat feature which can help you in scheduling your day. Also you can also customize it on your own.",
  keywords: "mood, detection, game, chat, AI, schedule, customize",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/shines.png" type="image/x-icon" />
      </head>
      <body className={`${urbanist.className} ${cn("h-screen w-full bg-background antialiased")}`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
