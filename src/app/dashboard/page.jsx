import { Bell } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex  flex-col gap-4 p-4 h-full">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg">Hi there VN Admin</h1>
        <Sheet>
          <SheetTrigger asChild>
            <button className="border p-2 relative rounded-full hover:bg-zinc-100 cursor-pointer">
              <Bell className="size-4" />
              {/* notication indicator dot */}
              <div className="absolute w-[5px] h-[5px] top-0 right-1 rounded-full bg-black">

              </div>
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription>You have no notifications.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <Button type="submit">Mark all as read</Button>
              <SheetClose asChild>
                <Button variant="outline">Clear all notification</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      {/* body */}
      <div className="w-full h-full text-center flex items-center justify-center">
        i will decide whats in this page later
      </div>
    </div>
  );
}
