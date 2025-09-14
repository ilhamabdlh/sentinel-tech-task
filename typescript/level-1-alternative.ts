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
  
console.log(wordFrequencyFixedOrder("Four One two two three Three three four four  four"));
  