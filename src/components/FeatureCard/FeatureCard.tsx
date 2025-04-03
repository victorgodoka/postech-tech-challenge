"use client";

import { Icon, IconifyIcon } from "@iconify/react";

type FeatureCardProps = {
  icon: IconifyIcon | string;
  title: string;
  description: string;
};

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8 rounded">
      <div className="text-green mb-2">
        <Icon icon={icon} className="text-8xl" />
      </div>
      <h3 className="text-xl font-bold text-green mb-2">{title}</h3>
      <p className="text-base text-gray-medium max-w-xs">{description}</p>
    </div>
  );
};
