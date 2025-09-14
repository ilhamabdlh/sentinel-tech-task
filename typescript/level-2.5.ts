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
  