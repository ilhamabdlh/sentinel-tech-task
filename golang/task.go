package main

import (
	"fmt"
	"regexp"
	"strings"
)

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

func main() {
	text := "Four, One two two three Three three four four  four"
	counts := wordFrequency(text)

	order := []string{"one", "two", "three", "four"}

	for _, w := range order {
		fmt.Printf("%s => %d\n", w, counts[w])
	}
}
