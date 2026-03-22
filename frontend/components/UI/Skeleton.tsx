'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-muted", className)}
    />
  );
}
