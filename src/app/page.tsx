"use client";

import CardMovie from "@/components/CardMovie";
import {
  InstallPrompt,
} from "@/components/PushNotification";
import { useInstallPrompt } from "@/hooks/useInstalPrompt";

export default function Home() {
  const { handleInstallPrompt } = useInstallPrompt();

  const isIOS =
    typeof window !== "undefined" &&
    /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

  return (
    <>
      <div className="container mx-auto space-y-4">
      
        <InstallPrompt isIOS={isIOS} onInstall={handleInstallPrompt} />
      </div>
      <CardMovie />
    </>
  );
}
