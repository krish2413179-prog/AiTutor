# Fix Make.com Webhook Response

## The Problem
Your webhook is returning JSON with unescaped newlines and quotes, which breaks JSON parsing.

## Solution: Update Your Make.com Scenario

### Option 1: Use JSON Module (Recommended)

In your Make.com scenario, after getting the OpenAI response:

1. Add a **"Create JSON"** module
2. Configure it like this:
   ```
   Data Structure: Custom
   JSON String: 
   {
     "reply": "{{replace(openai.response; newline; ' ')}}"
   }
   ```

### Option 2: Use Text Aggregator

1. Add **"Text Aggregator"** module
2. Set Text to aggregate: `{{openai.response}}`
3. Then add **"Set Variable"** module:
   ```json
   {
     "reply": "{{replace(aggregator.text; newline; ' ')}}"
   }
   ```

### Option 3: Simple Text Response (Easiest)

Change your webhook response to return ONLY the text:

**Webhook Response Body:**
```
{{openai.response}}
```

**Webhook Response Headers:**
```
Content-Type: text/plain
```

Then I'll update the frontend to handle plain text responses.

## Current Issue in Your Response

Your response has:
```json
{
  "reply": "Hello there! As your Solana tutor, I'd love to share one of the most unique "secrets" behind..."
}
```

The word `"secrets"` has unescaped quotes inside the JSON string, which breaks parsing.

## Quick Fix (Frontend)

I've added fallback parsing that tries to extract the reply even if JSON is malformed.

Try sending a message now - it should work!
