
import { LoginForm } from "@/components/login-form"
import { GalleryVerticalEndIcon } from "lucide-react"

export default function LoginPage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#ebebeb] p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <img src="/logo.png" width={200} alt="" />
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
