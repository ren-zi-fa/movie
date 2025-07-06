"use client";

import { sendNotification, subscribeUser, unsubscribeUser } from "@/app/action";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <NavigationMenu className="w-full border-b shadow-sm bg-white px-4 py-2">
      <NavigationMenuList className="flex w-full items-center justify-between gap-4">
        <NavigationMenuItem>
          <h3 className="text-lg font-semibold">🔔 Push Notifications</h3>
        </NavigationMenuItem>

        {subscription ? (
          <>
            <NavigationMenuItem>
              <p className="text-sm text-muted-foreground">
                You are subscribed.
              </p>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Input
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-64"
              />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button onClick={sendTestNotification} variant="default">
                Send Test
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button onClick={unsubscribeFromPush} variant="outline">
                Unsubscribe
              </Button>
            </NavigationMenuItem>
          </>
        ) : (
          <>
            <NavigationMenuItem>
              <p className="text-sm text-muted-foreground">
                You are not subscribed.
              </p>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button onClick={subscribeToPush} variant="default">
                Subscribe
              </Button>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface InstallPromptProps {
  isIOS: boolean;
  onInstall: () => void;
}

export function InstallPrompt({ isIOS, onInstall }: InstallPromptProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">📲 Install App</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" onClick={onInstall}>
          Add to Home Screen
        </Button>

        {isIOS && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            To install this app on your iOS device:
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>
                Tap the <span className="font-semibold">Share</span> button{" "}
                <span role="img" aria-label="share icon">
                  ⎋
                </span>
              </li>
              <li>
                Select{" "}
                <span className="font-semibold">Add to Home Screen</span>{" "}
                <span role="img" aria-label="plus icon">
                  ➕
                </span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
