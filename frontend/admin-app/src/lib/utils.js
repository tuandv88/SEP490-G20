import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function transformTestCases(originalData) {
  console.log(originalData)
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

export function transformTestCasesUpdate(originalData) {
  console.log(originalData);
  return {
    testCases: originalData.map((item) => {
      const { id, expectedOutput, isHidden, ...inputs } = item; 
      return {
        inputs,
        expectedOutput,
      };
    })
  };
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

export function transformTestScriptUpdate(originalData) {
  return {    
    testCases: originalData.map((item) => {
      const { expectedOutput, isHidden, order, id, ...inputs } = item
      return {
        id: id || null,
        inputs,
        expectedOutput,
        isHidden,
        orderIndex: 1
      }
    })
  }
}

export function reverseTransformTestScript(transformedData) {
  return transformedData.map(({ id, inputs, expectedOutput, isHidden }) => {
    return { 
      id,
      ...inputs,
      expectedOutput,
      isHidden
    };
  });
}

export function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject('Invalid file')
      return
    }

    const videoElement = document.createElement('video')
    videoElement.preload = 'metadata'

    videoElement.onloadedmetadata = function () {
      window.URL.revokeObjectURL(videoElement.src)
      const duration = Math.round(videoElement.duration)
      resolve(duration)
    }

    videoElement.onerror = function () {
      reject('Error loading video')
    }

    videoElement.src = URL.createObjectURL(file)
  })
}
