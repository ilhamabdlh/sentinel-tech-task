# TypeScript Solutions

## Overview
Simple TypeScript solutions for basic programming tasks.

## Solutions

### Level 1: Title Case Function
**File**: `level-1.ts`

Converts any string to Title Case format.

**Test Cases**:
- `titleCase("I'm a little tea pot")` → `"I'm A Little Tea Pot"`
- `titleCase("sHoRt AnD sToUt")` → `"Short And Stout"`
- `titleCase("SHORT AND STOUT")` → `"Short And Stout"`

### Level 1 Alternative: Word Frequency Counter
**File**: `level-1-alternative.ts`

Counts word frequency in a string with fixed order output.

**Usage**:
```typescript
function wordFrequencyFixedOrder(text: string): string {
    const counts = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .reduce((acc: Record<string, number>, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
  
    const order = ["one", "two", "three", "four"];
  
    return order.map(word => `${word} => ${counts[word] || 0}`).join("\n");
}
```

### Level 2: Promise Delay Function
**File**: `level-2.ts`

Implements a delay function using TypeScript Promises.

**Usage**:
```typescript
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

delay(3000).then(() => alert('runs after 3 seconds'));
```

### Level 2.5: Async/Await Implementation
**File**: `level-2.5.ts`

Async/await implementation for data fetching and processing.

**Usage**:
```typescript
async function fetchData(url: string): Promise<string> {
    if (!url) throw new Error("URL is required");
    return new Promise(resolve => {
      setTimeout(() => resolve(`Data from ${url}`), 1000);
    });
}

async function processData(data: string): Promise<string> {
    if (!data) throw new Error("Data is required");
    return new Promise(resolve => {
      setTimeout(() => resolve(data.toUpperCase()), 1000);
    });
}

(async () => {
    try {
      const data = await fetchData("https://example.com");
      const processed = await processData(data);
      console.log("Processed Data:", processed);
    } catch (err) {
      console.error(err);
    }
})();
```

## How to Run

### Online TypeScript Playground
1. Copy code from any file
2. Paste into [TypeScript Playground](https://www.typescriptlang.org/play)
3. Run and see results