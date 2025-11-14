# Quick Fix Guide - n8n Workflow

**Goal**: Get the workflow functional in < 2 hours

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] n8n instance running (local or cloud)
- [ ] MongoDB connection string
- [ ] Pinecone API key + 4 indices created
- [ ] OpenAI API key
- [ ] ElevenLabs API key + voice ID
- [ ] Google Service Account credentials JSON
- [ ] Google Drive folder ID
- [ ] Backend URL for webhooks

---

## Step-by-Step Fix Process

### Step 1: Environment Variables (5 min)

In n8n Settings → Environment Variables, add:

```bash
BACKEND_URL=your-backend-url
N8N_API_KEY=your-api-key
FRONTEND_URL=your-frontend-url
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
GOOGLE_DRIVE_FOLDER_ID=...
MONGODB_SCRIPTS_URI=mongodb://...
```

### Step 2: Configure Credentials (10 min)

In n8n Settings → Credentials, create:

1. **MongoDB** - Name: "MongoDB account"
2. **Pinecone API** - Name: "AI Agents"  
3. **OpenAI API** - Name: "Gregersen Properties"
4. **Google Service Account** - Name: "Google Search API"
5. **HTTP Header Auth** - Name: "N8N API Key"

### Step 3: Import Workflow (2 min)

1. Go to n8n dashboard
2. Click "+" → Import from File
3. Select the original JSON file
4. Click Import

### Step 4: Fix Critical Nodes (30 min)

#### Fix 1: Workflow Configuration Node
1. Find "Workflow Configuration" node
2. Click to edit
3. Change `mode` to "manual"
4. Add these assignments:
   - journeyId → `={{ $json.journeyId }}`
   - userId → `={{ $json.userId }}`
   - goal → `={{ $json.goal }}`
   - intention → `={{ $json.intention }}`
   - duration → `={{ $json.duration || 15 }}`
   - userProfile → `={{ $json.userProfile }}`
   - userContext → `={{ $json.userContext || [] }}`
5. Save

#### Fix 2: Store Initial Data
1. Find "Store Initial Data" node
2. Change type to "MongoDB"
3. Set operation: "insert"
4. Set collection: "journeys"
5. Add fields: journeyId, userId, goal, intention, duration, status, startedAt, userProfile, userContext
6. Save

#### Fix 3: All Pinecone Nodes
For each Pinecone node (4 total), set:

- **Search Pinecone - User Info**: value = "user-information"
- **Search Pinecone - Core Knowledge**: value = "core-hypnosis-knowledge"
- **Search Pinecone - Past Creations**: value = "past-creations"
- **Search Pinecone - Trends**: value = "interest-trends"

#### Fix 4: Merge Knowledge Sources
1. Find node, click edit
2. Paste this code:

```javascript
const workflowConfig = $('Workflow Configuration').first().json;
const userInfoResults = $('Search Pinecone - User Info').all();
const coreKnowledgeResults = $('Search Pinecone - Core Knowledge').all();
const pastCreationsResults = $('Search Pinecone - Past Creations').all();
const trendsResults = $('Search Pinecone - Trends').all();

function formatPineconeResults(results, source) {
  if (!results || results.length === 0) return `No ${source} data found.`;
  let formatted = `\n=== ${source.toUpperCase()} ===\n`;
  results.forEach((item, index) => {
    const json = item.json;
    formatted += `\n[Result ${index + 1}]\n`;
    if (json.metadata) {
      Object.keys(json.metadata).forEach(key => {
        formatted += `${key}: ${json.metadata[key]}\n`;
      });
    }
    if (json.pageContent) formatted += `Content: ${json.pageContent}\n`;
    if (json.score) formatted += `Relevance Score: ${json.score}\n`;
  });
  return formatted;
}

return [{
  json: {
    goal: workflowConfig.goal,
    intention: workflowConfig.intention,
    duration: workflowConfig.duration,
    userProfile: workflowConfig.userProfile || {},
    journeyId: workflowConfig.journeyId,
    userId: workflowConfig.userId,
    userInfoResults: formatPineconeResults(userInfoResults, 'User Information'),
    coreKnowledgeResults: formatPineconeResults(coreKnowledgeResults, 'Core Knowledge'),
    pastCreationsResults: formatPineconeResults(pastCreationsResults, 'Past Creations'),
    trendsResults: formatPineconeResults(trendsResults, 'Current Trends'),
    timestamp: new Date().toISOString()
  }
}];
```

#### Fix 5: Loop 7 Days Setup
1. Find node, click edit
2. Paste this code:

```javascript
const personalizedBlueprint = $json.personalizedBlueprint || {};
const days = personalizedBlueprint.days || [];
const currentIteration = $input.context?.currentIteration || 0;

if (currentIteration >= 7) {
  return [{ json: { loopComplete: true, totalDays: 7, journeyId: $json.journeyId } }];
}

const currentDay = currentIteration + 1;
const dayData = days[currentIteration] || {};

return [{
  json: {
    currentDay: currentDay,
    dayFocus: dayData.focus || '',
    dayGoal: dayData.goal || '',
    duration: $json.duration || 15,
    goal: $json.goal,
    intention: $json.intention,
    userProfile: $json.userProfile || {},
    personalizedBlueprint: personalizedBlueprint,
    journeyId: $json.journeyId,
    userId: $json.userId,
    loopComplete: false
  }
}];
```

#### Fix 6: Check Score >= 8
1. Find node
2. Set condition: `{{ $json.overallScore }}` >= 8
3. Save

#### Fix 7: Generate Audio - ElevenLabs
1. Find node
2. Set URL: `https://api.elevenlabs.io/v1/text-to-speech/={{ $env.ELEVENLABS_VOICE_ID }}`
3. Add header: `xi-api-key` = `={{ $env.ELEVENLABS_API_KEY }}`
4. Set body:
```json
{
  "text": "{{ $json.completeScript }}",
  "model_id": "eleven_monolingual_v1",
  "voice_settings": {
    "stability": 0.75,
    "similarity_boost": 0.75
  }
}
```
5. Set response format: "file"
6. Save

#### Fix 8: Merge Audio Files
1. Find node
2. For now, use simplified code:

```javascript
const voiceAudio = $('Generate Audio - ElevenLabs').first().json;
const currentDay = $json.currentDay || 1;
const journeyId = $json.journeyId;

return [{
  json: {
    day: currentDay,
    journeyId: journeyId,
    audioUrl: voiceAudio.audioUrl || '',
    mergedAudioPath: `/tmp/journey_${journeyId}_day${currentDay}_complete.mp3`,
    duration: voiceAudio.duration || 900,
    status: 'ready'
  }
}];
```

#### Fix 9: Check Loop Completion
1. Find node
2. Paste:

```javascript
const currentDay = $json.currentDay || 1;
const totalDays = 7;

if (currentDay >= totalDays) {
  return [{ json: { loopComplete: true, totalDays: 7, journeyId: $json.journeyId, allDaysComplete: true } }];
} else {
  return [{ json: { loopComplete: false, currentDay: currentDay, journeyId: $json.journeyId, continueLoop: true } }];
}
```

#### Fix 10: Send Webhook to Backend
1. Find node
2. Set URL: `={{ $env.BACKEND_URL }}/api/webhooks/n8n/journey-complete`
3. Add header: `Authorization` = `Bearer {{ $env.N8N_API_KEY }}`
4. Set body:
```json
{
  "journeyId": "{{ $json.journeyId }}",
  "userId": "{{ $json.userId }}",
  "status": "completed",
  "days": {{ JSON.stringify($json.days) }}
}
```

### Step 5: Test Workflow (20 min)

#### Test Payload
Use this webhook payload for testing:

```json
{
  "journeyId": "test-123",
  "userId": "user-456",
  "goal": "Reduce stress and anxiety",
  "intention": "Find peace and calm",
  "duration": 15,
  "userProfile": {
    "name": "Test User",
    "preference_time_of_day": "evening",
    "preference_duration": 15,
    "onboarding_data": {
      "hypnosis_experience": "beginner"
    }
  },
  "userContext": []
}
```

#### Testing Steps
1. Click on "Journey Creation Request" webhook node
2. Click "Test Step"
3. Copy webhook URL
4. Use Postman/curl to send test payload:

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @test-payload.json
```

5. Watch execution in n8n
6. Check for errors

---

## Common Issues & Solutions

### Issue: "Pinecone index not found"
**Solution**: Create indices in Pinecone with these names:
- user-information
- core-hypnosis-knowledge
- past-creations
- interest-trends

### Issue: "MongoDB connection failed"
**Solution**: Check connection string format:
```
mongodb://username:password@host:port/database?retryWrites=true&w=majority
```

### Issue: "OpenAI rate limit"
**Solution**: Add rate limiting or use slower model (gpt-3.5-turbo)

### Issue: "ElevenLabs auth failed"
**Solution**: Verify API key and voice ID are correct

### Issue: "Audio merge fails"
**Solution**: Skip merge for MVP, just use voice audio alone

### Issue: "Execution timeout"
**Solution**: Increase n8n timeout in settings or split into multiple workflows

---

## Quick Validation

After fixes, verify these work:

```bash
# 1. Test webhook responds
curl -X POST YOUR_WEBHOOK_URL

# 2. Check MongoDB has journey
mongo YOUR_DB --eval "db.journeys.count()"

# 3. Check Pinecone has vectors
curl -X GET "https://YOUR-INDEX.pinecone.io/vectors/stats" -H "Api-Key: YOUR_KEY"

# 4. Test ElevenLabs
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID" \
  -H "xi-api-key: YOUR_KEY" \
  -d '{"text":"Test"}'
```

---

## Minimal Working Version

If pressed for time, this subset will work:

1. Webhook → Workflow Config → Store Initial → Done
2. Skip Pinecone searches (use mock data)
3. Skip AI agents (use template scripts)
4. Skip audio generation (just store text)
5. Just send completion webhook

This proves the flow works, then add features incrementally.

---

## Time Estimates

- **Minimal (text only)**: 45 minutes
- **With AI agents**: 2 hours
- **With audio**: 3 hours  
- **Full featured**: 4-6 hours

---

## Success Indicators

You're done when:
- ✅ Webhook triggers without errors
- ✅ Data stored in MongoDB
- ✅ Workflow completes successfully
- ✅ Backend receives webhook
- ✅ Execution time < 5 minutes (for MVP)

---

## Next Steps After Working

1. Add error handling
2. Add retry logic
3. Optimize for speed
4. Add monitoring/logging
5. Load test with multiple journeys
6. Add YouTube research branch
7. Implement quality iteration loop

---

## Emergency Contacts

- **n8n Docs**: https://docs.n8n.io
- **n8n Community**: https://community.n8n.io
- **MongoDB Docs**: https://docs.mongodb.com
- **Pinecone Docs**: https://docs.pinecone.io
- **OpenAI Docs**: https://platform.openai.com/docs
- **ElevenLabs Docs**: https://docs.elevenlabs.io

---

**Remember**: Start simple, test often, add complexity gradually.

Good luck! 🚀

