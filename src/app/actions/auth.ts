"use server";

import { revalidatePath } from "next/cache";

import { clearUserSession, createUserSession } from "@/lib/auth";
import { loginUser, signupUser } from "@/lib/db/users";

type AuthResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
    };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function validateCredentials(email: string, password: string): string | null {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return "Email and password are required.";
  }

  if (!normalizedEmail.includes("@")) {
    return "Enter a valid email address.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  return null;
}

function getDatabaseConnectionErrorMessage() {
  const databaseUrl = process.env.DATABASE_URL || "";

  if (
    databaseUrl.includes("johndoe:randompassword") ||
    databaseUrl.includes("localhost:5432/mydb")
  ) {
    return "Database is still using the placeholder DATABASE_URL. Update .env with a real Postgres connection and run prisma:migrate.";
  }

  return "Unable to create the account right now. Check your database connection and try again.";
}

export async function signUpAction(input: { email: string; password: string }): Promise<AuthResult> {
  try {
    const email = normalizeEmail(input.email);
    const validationError = validateCredentials(email, input.password);

    if (validationError) {
      return { ok: false, error: validationError };
    }

    const user = await signupUser({
      email,
      password: input.password,
    });

    await createUserSession(user.id);
    revalidatePath("/");

    return { ok: true };
  } catch (error) {
    console.error("Sign up failed:", error);
    return { ok: false, error: getDatabaseConnectionErrorMessage() };
  }
}

export async function loginAction(input: { email: string; password: string }): Promise<AuthResult> {
  try {
    const email = normalizeEmail(input.email);
    const validationError = validateCredentials(email, input.password);

    if (validationError) {
      return { ok: false, error: validationError };
    }

    const user = await loginUser({ email, password: input.password });

    await createUserSession(user.id);
    revalidatePath("/");

    return { ok: true };
  } catch (error) {
    console.error("Login failed:", error);
    return { ok: false, error: getDatabaseConnectionErrorMessage() };
  }
}

export async function logoutAction() {
  await clearUserSession();
  revalidatePath("/");
}
