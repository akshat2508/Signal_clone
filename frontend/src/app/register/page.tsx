"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/api/client";

const formSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  display_name: z.string().trim().min(1, "Display name is required"),
  phone_number: z.string().trim().optional(),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

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
      await apiClient.post("/auth/register", data);
      // Pass username to verify page
      router.push(`/verify?username=${encodeURIComponent(data.username)}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 pt-10 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Create an account</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Join Signal Clone today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-10 space-y-4">
          <div className="space-y-1">
            <Input 
              placeholder="Username" 
              {...register("username")} 
              className={errors.username ? "border-destructive" : ""}
            />
            {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
          </div>
          
          <div className="space-y-1">
            <Input 
              placeholder="Display Name" 
              {...register("display_name")} 
              className={errors.display_name ? "border-destructive" : ""}
            />
            {errors.display_name && <p className="text-xs text-destructive">{errors.display_name.message}</p>}
          </div>

          <div className="space-y-1">
            <Input 
              placeholder="Phone Number (Optional)" 
              {...register("phone_number")} 
            />
          </div>

          <div className="space-y-1">
            <Input 
              type="password" 
              placeholder="Password" 
              {...register("password")} 
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          {error && <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md text-center">{error}</div>}

          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Create Account
          </Button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
