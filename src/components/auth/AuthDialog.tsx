"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { loginAction, signUpAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type Mode = "login" | "signup";

export function AuthDialog() {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = (nextMode: Mode) => {
    startTransition(async () => {
      const action = nextMode === "signup" ? signUpAction : loginAction;
      const result = await action({ email, password });

      if (!result.ok) {
        toast({
          variant: "destructive",
          title: nextMode === "signup" ? "Sign up failed" : "Login failed",
          description: result.error,
        });
        return;
      }

      toast({
        title: nextMode === "signup" ? "Account created" : "Welcome back",
        description: nextMode === "signup" ? "Your account is ready to use." : "You are now logged in.",
      });

      setOpen(false);
      setPassword("");
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-white">Account Access</DialogTitle>
          <DialogDescription>
            Create an account or sign in with your email and password.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)} className="space-y-5">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <AuthForm
              mode="login"
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              isPending={isPending}
              submitLabel="Log In"
              onSubmit={() => submit("login")}
            />
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <AuthForm
              mode="signup"
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              isPending={isPending}
              submitLabel="Create Account"
              onSubmit={() => submit("signup")}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function AuthForm(props: {
  mode: Mode;
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  isPending: boolean;
  submitLabel: string;
  onSubmit: () => void;
}) {
  const { mode, email, password, setEmail, setPassword, isPending, submitLabel, onSubmit } = props;

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-2">
        <Label htmlFor={`${mode}-email`}>Email</Label>
        <Input
          id={`${mode}-email`}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${mode}-password`}>Password</Label>
        <Input
          id={`${mode}-password`}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          disabled={isPending}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Please wait..." : submitLabel}
      </Button>
    </form>
  );
}
