# Golang Word Frequency Counter

## Overview
Simple word frequency counter that processes text input and counts word occurrences.

## Requirements
- Case insensitive processing
- Ignore punctuation marks
- Input: `"Four, One two two three Three three four four four"`
- Expected output: one => 1, two => 2, three => 3, four => 4

## Implementation

```go
func wordFrequency(input string) map[string]int {
	re := regexp.MustCompile(`[\W\s]+`)
	clean := re.ReplaceAllString(input, " ")
	words := strings.Fields(strings.ToLower(clean))

	counts := make(map[string]int)
	for _, w := range words {
		counts[w]++
	}
	return counts
}
```

## How to Run

### Go Playground
1. Copy the code from `task.go`
2. Paste into [Go Playground](https://goplay.tools/)
3. Click "Run"

## Sample Output
```
one => 1
two => 2
three => 3
four => 4
```

## Implementation Details
- Uses regex to remove punctuation and normalize whitespace
- Converts text to lowercase for case-insensitive comparison
- Returns results in fixed order: one, two, three, four
- Simple and efficient implementation
