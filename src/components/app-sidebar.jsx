"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Shirt,
  Gem,
  Receipt,
  Zap,
  Settings2,
  LifeBuoy,
  Send,
  Spotlight,
  RockingChairIcon,
} from "lucide-react";

const data = {
  user: {
    name: "Vela Noire",
    email: "velanoire@info.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Products",
      url: "/dashboard/products",
      icon: <Shirt />,
      isActive: true,
      items: [
        { title: "All Products", url: "/dashboard/products" },
        { title: "New Arrivals", url: "/dashboard/products/new-arrivals" },
        { title: "Best Sellers", url: "/dashboard/products/best-sellers" },
        { title: "Inventory", url: "/dashboard/products/inventory" },
      ],
    },

    {
      title: "Collections",
      url: "/dashboard/collections",
      icon: <Gem />,
      items: [
        {
          title: "Rare Collectibles",
          url: "/dashboard/collections/rare-collectibles",
        },
        {
          title: "Infinity Bride",
          url: "/dashboard/collections/infinity-bride",
        },
        { title: "Modern Muse", url: "/dashboard/collections/modern-muse" },
        { title: "Lux Infinity", url: "/dashboard/collections/lux-infinity" },
        {
          title: "Traditions Reimagined",
          url: "/dashboard/collections/traditions-reimagined",
        },
        {
          title: "Simplicity Speaks",
          url: "/dashboard/collections/simplicity-speaks",
        },
        { title: "Seasonal", url: "/dashboard/collections/seasonal" },
      ],
    },
    {
      title: "Orders & Sales",
      url: "/dashboard/orders",
      icon: <Receipt />,
      items: [
        { title: "All Orders", url: "/dashboard/orders" },
        { title: "Invoices", url: "/dashboard/orders/invoices" },
        {
          title: "Profit Analytics",
          url: "/dashboard/orders/profit-analytics",
        },
      ],
    },
    {
      title: "Flash Sales",
      url: "/dashboard/flash-sales",
      icon: <Zap />,
      items: [
        { title: "Eid Sales", url: "/dashboard/flash-sales/eid-sales" },
        {
          title: "Seasonal Offers",
          url: "/dashboard/flash-sales/seasonal-offers",
        },
        { title: "Bridal Offers", url: "/dashboard/flash-sales/bridal-offers" },
        { title: "24-Hour Deals", url: "/dashboard/flash-sales/24-hour-deals" },
      ],
    },
    {
      title: "Vn Gala",
      url: "/dashboard/gala",
      icon: <Spotlight />,
      isActive: false,
      items: [
        { title: "Fashion Shows", url: "/dashboard/gala/fashion-shows" },
        { title: "Art Culture", url: "/dashboard/gala/art-culture" },
        { title: "Models", url: "/dashboard/gala/models" },
        { title: "Vn Museum", url: "/dashboard/gala/museum" },
      ],
    },
    {
      title: "Vn Saloon",
      url: "/dashboard/saloon",
      icon: <RockingChairIcon />,
      isActive: false,
      items: [
        { title: "Fashion Shows", url: "/dashboard/saloon/fashion-shows" },
        { title: "Art Culture", url: "/dashboard/saloon/art-culture" },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <Settings2 />,
      items: [
        { title: "Notifications", url: "/dashboard/settings/notifications" },
        { title: "Team", url: "/dashboard/settings/team" },
        { title: "Billing", url: "/dashboard/settings/billing" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard" className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white  text-xs tracking-tight">
                  VN
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <img src="/logo.png" width={100} alt="" />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
