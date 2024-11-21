import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function transformTestCases(originalData) {
    return {
      testCases: originalData.map((item) => {
        const { expectedOutput, isHidden, ...inputs } = item
        return {
          inputs,
          expectedOutput
        }
      })
    }
  }

export function transformTestScript(originalData) {
  return {
    testCases: originalData.map((item) => {
      const { expectedOutput, isHidden, order, ...inputs } = item
      return {
        inputs,
        expectedOutput,
        isHidden,
        orderIndex: 1
      }
    })
  }
}

