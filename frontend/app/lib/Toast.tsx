"use client";

import {
  AnimatePresence,
  useTransform,
  motion,
  useMotionValue,
} from "framer-motion";

import { LucideProps, ShieldAlertIcon, XIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

function NotificationItem({
  index,
  data,
  size,
  collapsed,
  onClick,
}: {
  size: number;
  index: number;
  data: NotificationType;
  collapsed: boolean;
  onClick: (index: number) => void;
}) {
  const actualSize = size - 1;
  const scaleTransformer = useTransform(
    useMotionValue(index),
    [0, actualSize],
    [0.8, 1]
  );

  return (
    <motion.div
      onClick={() => {
        onClick(index);
        data.onClick?.();
      }}
      className={`flex flex-col absolute items-end gap-2 shadow-md p-4 bottom-0 w-full bg-dark-dim border border-dark-semi-dim`}
      style={{
        zIndex: 51,
        opacity: actualSize - index > 5 && collapsed ? "0" : "1",
      }}
      initial={{ translateY: 200 }}
      transition={{ ease: "anticipate" }}
      exit={{
        opacity: 0.5,
      }}
      animate={{
        translateX: 0,
        translateY: collapsed
          ? (actualSize - index) * -10
          : (actualSize - index) * -73,
        scale: collapsed ? scaleTransformer.get() : 1,
      }}
    >
      <span className="absolute right-2 top-2">
        <XIcon
          className="text-gray-600 hover:text-gray-500 cursor-pointer"
          size={13}
        />
      </span>
      <div className="flex flex-row w-full gap-4">
        <data.icon
          className="min-w-[20px] min-h-[20px]"
          size={20}
          strokeWidth={1}
        />
        <div className="flex flex-col gap-1">
          <p className="uppercase line-clamp-1 text-ellipsis">{data.title}</p>
          <p className="text-xs text-gray-500 line-clamp-1 text-ellipsis">
            {data.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

type NotificationType = {
  title: string;
  icon: (props: LucideProps) => ReactNode;
  description: string;
  onClick?: () => void;
};

export const dispatchNotification = (detail: NotificationType) => {
  window.dispatchEvent(new CustomEvent("newNotification", { detail }));
};

export function ToastContainer() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const listener = (event: CustomEvent) => {
      setNotifications((oldNotifications) => [
        ...oldNotifications,
        event.detail,
      ]);
    };
    window.addEventListener("newNotification", listener as EventListener);
    return () => {
      window.removeEventListener("newNotification", listener as EventListener);
    };
  }, []);

  const [collapsed, setCollapsed] = useState(true);

  function deleteNotification(index: number) {
    notifications.splice(index, 1);
    if (!notifications.length) setCollapsed(true);
    setNotifications([...notifications]);
  }

  return (
    <motion.div
      className="absolute w-[400px] bottom-4 right-4"
      onHoverStart={() => setCollapsed(false)}
      onHoverEnd={() => setCollapsed(true)}
    >
      <motion.div
        animate={{ opacity: collapsed ? 0 : 1 }}
        className="fixed inset-0 z-50 bg-dark/80 backdrop-blur-sm pointer-events-none opacity-0"
      />
      <AnimatePresence>
        {notifications.map((message, index) => {
          return (
            <NotificationItem
              onClick={deleteNotification}
              key={index}
              index={index}
              data={message}
              size={notifications.length}
              collapsed={collapsed}
            />
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

export function dispatchServerError() {
  dispatchNotification({
    title: "Server Error.",
    description: "An error happened while processing the request.",
    icon: ShieldAlertIcon,
  });
}
