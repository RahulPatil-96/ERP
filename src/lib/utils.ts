/**
 * Classnames utility for Tailwind CSS
 * Merges class strings/objects and filters falsy values
 */
export function cn(...inputs: Array<string | Record<string, boolean> | null | undefined>): string {
  return inputs
    .flatMap(input => {
      if (!input) return []
      if (typeof input === 'string') return input
      if (typeof input === 'object') {
        return Object.entries(input)
          .filter(([_, value]) => value)
          .map(([key]) => key)
      }
      return []
    })
    .filter(Boolean)
    .join(' ')
    .trim()
}

/**
 * Checks if an object is empty (has no own properties)
 */
export function isEmpty(obj: Record<string, any> | null | undefined): boolean {
    return !obj || Object.keys(obj).length === 0
  }
  
  /**
   * Converts a string to a URL-friendly slug
   */
  export function slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  
  /**
   * Throttles a function to limit its execution rate
   */
  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): T {
    let lastFunc: NodeJS.Timeout
    let lastRan: number
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (!lastRan) {
        func.apply(this, args)
        lastRan = Date.now()
      } else {
        clearTimeout(lastFunc)
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args)
            lastRan = Date.now()
          }
        }, limit - (Date.now() - lastRan))
      }
    } as T
  }
  
  /**
   * Delays execution for a specified number of milliseconds
   */
  export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  
  /**
   * Validates an email address format
   */
  export function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }
  
  /**
   * Creates a deep clone of an object using JSON methods
   * Note: Does not handle functions, Symbols, or circular references
   */
  export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
  }
  
  /**
   * Parses a query string into an object
   */
  export function parseQueryString(query: string): Record<string, string> {
    return Object.fromEntries(new URLSearchParams(query))
  }
  
  /**
   * Generates a random integer between min and max (inclusive)
   */
  export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  
  /**
   * Removes undefined/null properties from an object
   */
  export function removeEmptyProperties<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v != null)
    ) as Partial<T>
  }
