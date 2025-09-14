# Take-Home Assignment Answers

## Table of Contents
1. [Basic System Design Question](#1-basic-system-design-question)
2. [Database/SQL Questions](#2-databasesql-questions)
3. [JavaScript/TypeScript Tasks](#3-javascripttypescript-tasks)
4. [Vue.js Conceptual Questions](#4-vuejs-conceptual-questions)
5. [Golang Coding Task](#5-golang-coding-task)
6. [Security Best Practices](#6-security-best-practices)
7. [Performance Best Practices](#7-performance-best-practices)
8. [Tools Rating](#8-tools-rating)

---

## 1. Basic System Design Question

### Question: Design a website that allows users to submit photos with moderation process

**Answer:**

I would design a photo submission and moderation system with the following approach:

#### Technologies Used:
- **Backend**: Go (Gin framework) for API services
- **Database**: PostgreSQL for structured data, Redis for caching
- **File Storage**: AWS S3 for photo storage
- **Message Queue**: Redis/RabbitMQ for async processing
- **Frontend**: Vue.js with TypeScript
- **Authentication**: JWT tokens
- **Image Processing**: Go with image processing libraries

#### Data Structures:

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- 'user', 'moderator', 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Photos table
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    filename VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    moderation_notes TEXT,
    moderator_id INTEGER REFERENCES users(id),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moderated_at TIMESTAMP
);

-- Moderation queue
CREATE TABLE moderation_queue (
    id SERIAL PRIMARY KEY,
    photo_id INTEGER REFERENCES photos(id),
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Workflow:
1. User uploads photo → stored in S3 with "pending" status
2. Photo added to moderation queue
3. Moderator reviews photo via admin panel
4. Moderator approves/rejects with notes
5. User receives notification of decision
6. Approved photos become publicly visible

---

## 2. Database/SQL Questions

### Level 1: Count customers from Germany
```sql
SELECT COUNT(*) as german_customers
FROM Customers 
WHERE Country = 'Germany';
```

### Level 2: Countries with most customers (min 5 customers)
```sql
SELECT Country, COUNT(CustomerID) as customer_count
FROM Customers
GROUP BY Country
HAVING COUNT(CustomerID) >= 5
ORDER BY customer_count DESC;
```

**Expected Result:**
- USA: 13
- Germany: 11
- France: 11
- Brazil: 9
- UK: 7
- Spain: 5
- Mexico: 5

### Level 3: Reverse Engineer - Customer Order Summary
```sql
SELECT 
    c.CustomerName,
    COUNT(o.OrderID) as OrderCount,
    MIN(o.OrderDate) as FirstOrder,
    MAX(o.OrderDate) as LastOrder
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.CustomerName
ORDER BY OrderCount DESC, c.CustomerName;
```

---

## 3. JavaScript/TypeScript Tasks

### Level 1: Title Case Function
```javascript
function titleCase(str) {
    return str.toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
}

// Test cases
console.log(titleCase("I'm a little tea pot")); // "I'm A Little Tea Pot"
console.log(titleCase("sHoRt AnD sToUt")); // "Short And Stout"
console.log(titleCase("SHORT AND STOUT")); // "Short And Stout"
```

### Level 2: Delay Function with Promise
```javascript
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage
delay(3000).then(() => alert('runs after 3 seconds'));
```

### Level 2.5: Async/Await Refactor

**Original Callback-based Code:**
```javascript
function fetchData(url, callback) {
    setTimeout(() => {
        if (!url) {
            callback(new Error('URL is required'), null);
        } else {
            callback(null, `Data from ${url}`);
        }
    }, 1000);
}

function processData(data, callback) {
    setTimeout(() => {
        if (!data) {
            callback(new Error('Data is required'), null);
        } else {
            callback(null, data.toUpperCase());
        }
    }, 1000);
}

// Callback usage
fetchData('https://api.example.com', (error, data) => {
    if (error) {
        console.error('Fetch error:', error);
    } else {
        processData(data, (processError, processedData) => {
            if (processError) {
                console.error('Process error:', processError);
            } else {
                console.log('Final result:', processedData);
            }
        });
    }
});
```

**Refactored with Async/Await:**
```javascript
function fetchData(url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!url) {
                reject(new Error('URL is required'));
            } else {
                resolve(`Data from ${url}`);
            }
        }, 1000);
    });
}

function processData(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!data) {
                reject(new Error('Data is required'));
            } else {
                resolve(data.toUpperCase());
            }
        }, 1000);
    });
}

// Async/Await usage
async function handleData() {
    try {
        const data = await fetchData('https://api.example.com');
        const processedData = await processData(data);
        console.log('Final result:', processedData);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

handleData();
```

### Level 3-4: Real-time Chat Application
*[See separate chat-app directory for complete implementation]*

---

## 4. Vue.js Conceptual Questions

### 1. Vue.js Reactivity and Common Tracking Issues

**Reactivity in Vue.js:**
Vue.js uses a reactive system based on JavaScript Proxies (Vue 3) or Object.defineProperty (Vue 2) to track changes in data and automatically update the DOM.

**Common Issues:**
- **Array mutations**: Direct array index assignment doesn't trigger reactivity
- **Object property addition**: Adding new properties to objects after creation
- **Nested object changes**: Deep nested changes might not be detected
- **Async data updates**: Data loaded asynchronously might not be reactive

**Solutions:**
- Use `Vue.set()` or `this.$set()` for object properties
- Use array methods like `push()`, `splice()` instead of direct assignment
- Use `reactive()` and `ref()` properly in Vue 3

### 2. Data Flow Between Components

**Parent to Child (Props Down):**
```javascript
// Parent
<ChildComponent :message="parentMessage" />

// Child
props: ['message']
```

**Child to Parent (Events Up):**
```javascript
// Child
this.$emit('update', newValue)

// Parent
<ChildComponent @update="handleUpdate" />
```

**Sibling Communication:**
- Event Bus (Vue 2)
- Provide/Inject
- State management (Vuex/Pinia)

### 3. Memory Leaks in Vue.js

**Common Causes:**
- Event listeners not removed
- Timers/intervals not cleared
- DOM references kept in closures
- Watchers not unsubscribed

**Solutions:**
- Use `beforeDestroy`/`beforeUnmount` lifecycle hooks
- Remove event listeners in cleanup
- Clear timers and intervals
- Use `$off()` for custom events

### 4. State Management Tools Used

I have experience with:
- **Vuex** (Vue 2) - Centralized state management
- **Pinia** (Vue 3) - Modern state management
- **Provide/Inject** - For simple state sharing
- **Event Bus** - For simple communication

### 5. Pre-rendering vs Server-Side Rendering

**Pre-rendering:**
- Static HTML generated at build time
- No server required for rendering
- Better for static content
- Examples: Nuxt.js static generation, Gatsby

**Server-Side Rendering (SSR):**
- HTML generated on each request
- Server processes and renders components
- Better for dynamic content
- SEO-friendly
- Examples: Nuxt.js SSR mode, Next.js

---

## 5. Golang Coding Task

### Word Frequency Counter

```go
package main

import (
    "fmt"
    "regexp"
    "sort"
    "strings"
)

func countWordFrequency(text string) map[string]int {
    // Remove punctuation and convert to lowercase
    re := regexp.MustCompile(`[^\w\s]`)
    cleanText := re.ReplaceAllString(text, " ")
    cleanText = strings.ToLower(cleanText)
    
    // Split into words
    words := strings.Fields(cleanText)
    
    // Count frequency
    frequency := make(map[string]int)
    for _, word := range words {
        frequency[word]++
    }
    
    return frequency
}

func main() {
    text := "Four, One two two three Three three four four four"
    frequency := countWordFrequency(text)
    
    // Sort keys for consistent output
    var keys []string
    for key := range frequency {
        keys = append(keys, key)
    }
    sort.Strings(keys)
    
    // Print results
    for _, key := range keys {
        fmt.Printf("%s => %d\n", key, frequency[key])
    }
}
```

**Expected Output:**
```
four => 4
one => 1
three => 3
two => 2
```

---

## 6. Security Best Practices

### Most Important Security Practices (in order of priority):

1. **Input Validation & Sanitization**
   - Validate all user inputs
   - Sanitize data before processing
   - Use parameterized queries to prevent SQL injection

2. **Authentication & Authorization**
   - Implement strong password policies
   - Use multi-factor authentication (MFA)
   - Implement proper session management
   - Use JWT tokens with appropriate expiration

3. **HTTPS Everywhere**
   - Encrypt all data in transit
   - Use TLS 1.3
   - Implement HSTS headers

4. **Data Protection**
   - Encrypt sensitive data at rest
   - Use proper key management
   - Implement data anonymization where possible

5. **API Security**
   - Implement rate limiting
   - Use API keys and authentication
   - Validate request/response schemas
   - Implement CORS properly

6. **Dependency Management**
   - Keep dependencies updated
   - Use vulnerability scanning tools
   - Implement dependency pinning

7. **Error Handling**
   - Don't expose sensitive information in errors
   - Implement proper logging without sensitive data
   - Use generic error messages for users

8. **File Upload Security**
   - Validate file types and sizes
   - Scan uploaded files for malware
   - Store files outside web root
   - Use content-type validation

9. **Security Headers**
   - Implement CSP (Content Security Policy)
   - Use X-Frame-Options
   - Set X-Content-Type-Options
   - Implement X-XSS-Protection

10. **Regular Security Audits**
    - Conduct penetration testing
    - Perform code reviews
    - Monitor for security vulnerabilities
    - Implement security monitoring

---

## 7. Performance Best Practices

### Most Important Performance Practices (in order of priority):

1. **Database Optimization**
   - Use proper indexing
   - Optimize queries (avoid N+1 problems)
   - Implement database connection pooling
   - Use query caching

2. **Caching Strategy**
   - Implement Redis/Memcached for data caching
   - Use CDN for static assets
   - Implement browser caching
   - Use application-level caching

3. **Code Optimization**
   - Minimize database queries
   - Use efficient algorithms and data structures
   - Implement lazy loading
   - Optimize loops and iterations

4. **Frontend Performance**
   - Minimize HTTP requests
   - Compress images and assets
   - Use lazy loading for images
   - Implement code splitting

5. **Server Performance**
   - Use load balancing
   - Implement horizontal scaling
   - Optimize server configuration
   - Use efficient web servers (Nginx, Apache)

6. **Network Optimization**
   - Enable Gzip compression
   - Use HTTP/2
   - Minimize redirects
   - Optimize DNS lookups

7. **Monitoring & Profiling**
   - Implement performance monitoring
   - Use profiling tools
   - Monitor resource usage
   - Set up alerts for performance issues

8. **Asset Optimization**
   - Minify CSS, JavaScript, HTML
   - Optimize images (WebP, compression)
   - Use sprite sheets for icons
   - Remove unused code

9. **Asynchronous Processing**
   - Use message queues for heavy tasks
   - Implement background jobs
   - Use async/await patterns
   - Avoid blocking operations

10. **Infrastructure Optimization**
    - Use appropriate server sizes
    - Implement auto-scaling
    - Use content delivery networks
    - Optimize database configuration

---

## 8. Tools Rating

### Self-Assessment (1-5 scale):

| Tool/Technology | Rating | Notes |
|----------------|--------|-------|
| **Git** | 5 | Expert level - comfortable with advanced workflows, branching strategies, and conflict resolution |
| **Redis** | 4 | Strong experience with caching, session storage, and pub/sub patterns |
| **VSCode** | 5 | Primary IDE, extensive plugin usage, debugging, and customization |
| **Linux** | 4 | Strong command-line skills, system administration, and server management |
| **AWS Services:** | | |
| - EC2 | 4 | Experience with instance management, security groups, and scaling |
| - Lambda | 3 | Good understanding of serverless architecture and event-driven programming |
| - RDS | 4 | Database management, backups, and performance optimization |
| - CloudWatch | 3 | Monitoring and logging, room for improvement in advanced metrics |
| - S3 | 4 | File storage, static website hosting, and CDN integration |
| **Unit Testing** | 4 | Strong experience with testing frameworks and TDD practices |
| **Kanban Boards** | 4 | Experienced with Jira, Trello, and agile project management |

### Additional Notes:
- **Go**: 5 - Primary backend language, experienced with Gin, Echo, and standard library
- **Vue.js**: 4 - Strong frontend experience with Vue 2/3, Nuxt.js
- **TypeScript**: 4 - Extensive experience in both frontend and backend development
- **Docker**: 4 - Containerization and orchestration experience
- **PostgreSQL**: 4 - Database design, optimization, and advanced queries

---

## 🎯 Summary

This assignment demonstrates my capabilities as a Senior Full Stack Developer with expertise in:
- **Backend**: Go, database design, API development
- **Frontend**: Vue.js, TypeScript, modern JavaScript
- **DevOps**: AWS, Docker, CI/CD
- **Best Practices**: Security, performance, code quality
- **System Design**: Scalable architecture and data modeling

All code solutions are production-ready and follow industry best practices.
