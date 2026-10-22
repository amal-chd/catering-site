import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Staff sign in", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return <section className="login-wrap"><div className="login-card">
    <span className="eyebrow">PRIVATE STAFF AREA</span><h1>Sign in</h1>
    <p>Use the account provided by the business owner.</p>
    <LoginForm />
  </div></section>;
}
