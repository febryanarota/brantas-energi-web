import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isArraysEq(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort both arrays
  const sortedArr1 = arr1.slice().sort((a, b) => a - b);
  const sortedArr2 = arr2.slice().sort((a, b) => a - b);

  // Compare each element
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

export function subtractArrays(arr1: number[], arr2: number[]): number[] {
  return arr1.filter(item => !arr2.includes(item));
}