"use client"; 

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        router.replace("/dashboard"); 
      } else {
        router.replace("/sign-in"); 
      }
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <Button disabled>Redirecting...</Button>
    </div>
  );
}
