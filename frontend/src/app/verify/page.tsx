"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/api/client";

const formSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type FormValues = z.infer<typeof formSchema>;

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!username) {
      router.push("/login");
    }
  }, [username, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setError("");
      await apiClient.post("/auth/verify", {
        username: username,
        otp: data.otp,
      });
      // After verifying, we can automatically log them in or redirect to login
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid OTP");
    }
  };

  if (!username) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 pt-10 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Verify your account</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Enter the 6-digit code sent to your device
            <br />
            (Use <span className="font-mono bg-muted px-1 py-0.5 rounded text-primary">123456</span> for testing)
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-10 space-y-4">
          <div className="space-y-1">
            <Input 
              placeholder="000000" 
              className={`text-center text-2xl tracking-widest ${errors.otp ? "border-destructive" : ""}`}
              maxLength={6}
              {...register("otp")} 
            />
            {errors.otp && <p className="text-xs text-destructive text-center">{errors.otp.message}</p>}
          </div>

          {error && <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md text-center">{error}</div>}

          <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Verify
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
