# Complete Workflow Fixes for Your n8n Hypnosis Generator

## Overview

Your workflow is well-structured with good AI agent architecture! Here's what needs to be fixed for production use:

---

## ✅ What's Working Well

1. **AI Agent Structure** - Excellent hierarchical design with main agents and sub-agents
2. **Claude Models** - Good choice using Sonnet 4.5 for main tasks, Haiku for evaluation
3. **YouTube Research** - Nice addition for analyzing successful content
4. **ElevenLabs Integration** - Properly configured voice and audio generation
5. **Agent Tools** - Well-connected sub-agents with proper AI tool connections

---

## 🔧 Critical Fixes Needed

### 1. Workflow Configuration Node (Lines 20-30)

**Current**: Empty Set node
```json
"parameters": {
  "options": {}
}
```

**Fixed**: Add field assignments
```json
"parameters": {
  "mode": "manual",
  "duplicateItem": false,
  "assignments": {
    "assignments": [
      {
        "id": "1",
        "name": "journeyId",
        "value": "={{ $json.body.journeyId }}",
        "type": "string"
      },
      {
        "id": "2",
        "name": "userId",
        "value": "={{ $json.body.userId }}",
        "type": "string"
      },
      {
        "id": "3",
        "name": "goal",
        "value": "={{ $json.body.goal }}",
        "type": "string"
      },
      {
        "id": "4",
        "name": "intention",
        "value": "={{ $json.body.intention }}",
        "type": "string"
      },
      {
        "id": "5",
        "name": "duration",
        "value": "={{ $json.body.duration || 15 }}",
        "type": "number"
      },
      {
        "id": "6",
        "name": "userProfile",
        "value": "={{ $json.body.userProfile }}",
        "type": "object"
      },
      {
        "id": "7",
        "name": "userContext",
        "value": "={{ $json.body.userContext || [] }}",
        "type": "array"
      }
    ]
  }
}
```

---

### 2. Pinecone Index Values (Lines 37, 62, 87, 112, 623)

**Current**: All empty
```json
"pineconeIndex": {
  "__rl": true,
  "mode": "list",
  "value": ""  // ❌ EMPTY
}
```

**Fixed**:
- **Search Pinecone - User Info** (line 37): `"value": "user-information"`
- **Search Pinecone - Core Knowledge** (line 62): `"value": "core-hypnosis-knowledge"`
- **Search Pinecone - Past Creations** (line 87): `"value": "past-creations"`
- **Search Pinecone - Trends** (line 112): `"value": "interest-trends"`
- **Update Pinecone - Store Creation** (line 623): `"value": "past-creations"`

Also change `"disabled": true` to `"disabled": false` for all Pinecone nodes (lines 55, 80, 105, 130)

---

### 3. Keywords Sub-Agent Truncated Text (Line 169)

**Current**: Cuts off at `"embeddedCommands": ["com`

**Fixed**: Complete the text parameter:
```javascript
"embeddedCommands": ["command1", "command2", ...]
}
```

---

### 4. Loop 7 Days Setup (Line 363-371)

**Current**: Empty Code node

**Fixed**: Add this JavaScript:
```javascript
// Loop 7 Days Setup
const scriptBlueprint = $json.personalizedBlueprint || {};
const days = scriptBlueprint.days || [];

// Get current iteration
let currentIteration = 0;
if ($execution.customData && $execution.customData.dayIteration !== undefined) {
  currentIteration = $execution.customData.dayIteration;
}

if (currentIteration >= 7) {
  return [{
    json: {
      loopComplete: true,
      totalDays: 7,
      journeyId: $json.journeyId,
      allDaysComplete: true
    }
  }];
}

const currentDay = currentIteration + 1;
const dayData = days[currentIteration] || {
  focus: `Day ${currentDay} focus`,
  goal: `Progress toward ${$json.goal}`,
  approach: 'Progressive approach'
};

// Store iteration state
if (!$execution.customData) {
  $execution.customData = {};
}
$execution.customData.dayIteration = currentIteration + 1;

return [{
  json: {
    journeyId: $json.journeyId,
    userId: $json.userId,
    currentDay: currentDay,
    dayFocus: dayData.focus,
    dayGoal: dayData.goal,
    duration: $json.duration || 15,
    goal: $json.goal,
    intention: $json.intention,
    userProfile: $json.userProfile || {},
    personalizedBlueprint: scriptBlueprint,
    loopComplete: false
  }
}];
```

---

### 5. Merge Audio Files (Line 546-555)

**Current**: Empty Code node

**Fixed**: Add this JavaScript:
```javascript
// Merge Audio Files
const voiceAudio = $('Voice Generation').first();
const backgroundAudio = $('Audio Generation').first();
const currentDay = $json.currentDay || 1;
const journeyId = $json.journeyId;

// For production, return both audio references
// Backend can handle actual merging or use them separately

return [{
  json: {
    day: currentDay,
    journeyId: journeyId,
    voiceAudioData: voiceAudio?.binary?.data || '',
    backgroundAudioData: backgroundAudio?.binary?.data || '',
    voiceFileName: `voice_day${currentDay}.mp3`,
    backgroundFileName: `background_day${currentDay}.mp3`,
    completeScript: $json.completeScript || '',
    duration: $json.totalDuration || 900,
    status: 'ready'
  },
  binary: {
    data: voiceAudio?.binary?.data || '',
    mimeType: 'audio/mpeg',
    fileName: `journey_${journeyId}_day${currentDay}.mp3`
  }
}];
```

---

### 6. Check Loop Completion (Line 588-597)

**Current**: Empty Code node

**Fixed**: Add this JavaScript:
```javascript
// Check Loop Completion
const currentDay = $json.day || $json.currentDay || 1;
const totalDays = 7;

if (currentDay >= totalDays) {
  console.log(`All ${totalDays} days complete`);
  
  return [{
    json: {
      loopComplete: true,
      totalDays: totalDays,
      journeyId: $json.journeyId,
      userId: $json.userId,
      allDaysComplete: true,
      completedAt: new Date().toISOString()
    }
  }];
  
} else {
  console.log(`Day ${currentDay} complete, continuing to day ${currentDay + 1}`);
  
  return [{
    json: {
      loopComplete: false,
      currentDay: currentDay,
      nextDay: currentDay + 1,
      journeyId: $json.journeyId,
      continueLoop: true
    }
  }];
}
```

---

### 7. Store Draft Sections (Line 476-494)

**Current**: Only has collection name

**Fixed**: Add operation configuration:
```json
"parameters": {
  "operation": "insert",
  "collection": "sections",
  "fields": "section,day,script,estimatedDuration,keyElements,journeyId,userId,draftId,createdAt",
  "options": {}
}
```

---

### 8. Check Score >= 8 (Line 512-524)

**Current**: Empty IF conditions

**Fixed**: Add condition:
```json
"parameters": {
  "conditions": {
    "number": [
      {
        "value1": "={{ $json.overallScore }}",
        "operation": "largerEqual",
        "value2": 8
      }
    ]
  },
  "options": {}
}
```

---

### 9. Retrieve Draft Sections (Line 526-544)

**Current**: Only has collection name

**Fixed**: Add query:
```json
"parameters": {
  "operation": "find",
  "collection": "sections",
  "query": "={ \"journeyId\": \"{{ $json.journeyId }}\", \"day\": {{ $json.currentDay }} }",
  "options": {
    "sort": "{ \"section\": 1 }",
    "limit": 10
  }
}
```

---

### 10. Store Complete Journey (Line 599-616)

**Current**: Empty MongoDB operation

**Fixed**: Add update operation:
```json
"parameters": {
  "operation": "update",
  "collection": "journeys",
  "updateKey": "journeyId",
  "fieldsUi": {
    "fieldValues": [
      {
        "fieldId": "status",
        "fieldValue": "completed"
      },
      {
        "fieldId": "completedAt",
        "fieldValue": "={{ $now }}"
      },
      {
        "fieldId": "days",
        "fieldValue": "={{ $json.days }}"
      }
    ]
  },
  "options": {}
}
```

---

### 11. Send Webhook to Backend (Line 643-654)

**Current**: Empty HTTP Request

**Fixed**: Add configuration:
```json
"parameters": {
  "method": "POST",
  "url": "={{ $env.BACKEND_URL }}/api/webhooks/n8n/journey-complete",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "Bearer {{ $env.N8N_API_KEY }}"
      },
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  },
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={\n  \"journeyId\": \"{{ $json.journeyId }}\",\n  \"userId\": \"{{ $json.userId }}\",\n  \"status\": \"completed\",\n  \"days\": {{ JSON.stringify($json.days) }}\n}",
  "options": {}
}
```

---

### 12. Send Email to User (Line 655-675)

**Current**: Missing email configuration

**Fixed**: Add Gmail send operation:
```json
"parameters": {
  "authentication": "serviceAccount",
  "resource": "message",
  "operation": "send",
  "sendTo": "={{ $json.userEmail }}",
  "subject": "Your 7-Day Hypnosis Journey is Ready! 🎉",
  "emailType": "html",
  "message": "=<html><body><h1>Your Journey is Ready!</h1><p>{{ $json.userName }}, your personalized journey for {{ $json.goal }} is complete!</p></body></html>",
  "options": {}
}
```

---

### 13. Run an Actor Node (Line 998-1021)

**Current**: Empty actorId

**Fixed**: Set the actor ID or remove if not needed:
```json
"actorId": {
  "__rl": true,
  "mode": "list",
  "value": "YbmoVOUovb8Ixfv2z"  // YouTube transcription actor
}
```

---

## 🔗 Frontend Integration

### Webhook Endpoint

Your frontend should call:
```
POST https://your-n8n-url.com/webhook/journey-create
```

### Expected Payload Format

```typescript
interface JourneyCreatePayload {
  journeyId: string;          // UUID from frontend
  userId: string;             // User ID from auth
  goal: string;               // User's goal
  intention: string;          // User's intention
  duration: number;           // Duration in minutes (default: 15)
  userProfile: {
    name: string;
    preference_time_of_day: 'morning' | 'evening';
    preference_duration: number;
    onboarding_data: {
      hypnosis_experience: 'beginner' | 'intermediate' | 'advanced';
      [key: string]: any;
    };
  };
  userContext?: any[];        // Optional user context
}
```

### Backend Webhook Handler

Your backend should have an endpoint at:
```
POST /api/webhooks/n8n/journey-complete
```

Expected to receive:
```typescript
interface JourneyCompleteWebhook {
  journeyId: string;
  userId: string;
  status: 'completed';
  days: Array<{
    dayNumber: number;
    audioUrl: string;
    scriptText: string;
    duration: number;
  }>;
  completedAt: string;
}
```

---

## 🚀 Frontend Integration Code

### 1. Create Journey API Call

```typescript
// frontend/src/services/journey.service.js

export const createJourney = async (journeyData) => {
  try {
    // First, create journey record in your backend
    const journey = await api.post('/api/journeys', {
      goal: journeyData.goal,
      intention: journeyData.intention,
      duration: journeyData.duration
    });

    // Then trigger n8n workflow
    const n8nResponse = await fetch(
      'https://your-n8n-url.com/webhook/journey-create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          journeyId: journey.data.id,
          userId: journey.data.userId,
          goal: journeyData.goal,
          intention: journeyData.intention,
          duration: journeyData.duration || 15,
          userProfile: {
            name: journey.data.userName,
            preference_time_of_day: journey.data.timePreference,
            preference_duration: journeyData.duration,
            onboarding_data: journey.data.onboardingData
          }
        })
      }
    );

    if (!n8nResponse.ok) {
      throw new Error('Failed to trigger journey generation');
    }

    return {
      success: true,
      journeyId: journey.data.id,
      message: 'Journey generation started'
    };
    
  } catch (error) {
    console.error('Error creating journey:', error);
    throw error;
  }
};
```

### 2. Journey Status Polling

```typescript
// frontend/src/services/journey.service.js

export const pollJourneyStatus = async (journeyId, onUpdate) => {
  const maxAttempts = 120; // 10 minutes (5 sec intervals)
  let attempts = 0;

  const poll = async () => {
    try {
      const response = await api.get(`/api/journeys/${journeyId}`);
      const journey = response.data;

      onUpdate(journey);

      if (journey.status === 'completed') {
        return journey;
      }

      if (journey.status === 'error' || attempts >= maxAttempts) {
        throw new Error('Journey generation failed or timed out');
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000));
      return poll();
      
    } catch (error) {
      console.error('Error polling journey status:', error);
      throw error;
    }
  };

  return poll();
};
```

### 3. CreateJourney Component Updates

```jsx
// frontend/src/pages/CreateJourney.jsx

import { useState } from 'react';
import { createJourney, pollJourneyStatus } from '../services/journey.service';
import { useNavigate } from 'react-router-dom';

export const CreateJourney = () => {
  const [formData, setFormData] = useState({
    goal: '',
    intention: '',
    duration: 15
  });
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setProgress(10);

    try {
      // Create journey and trigger n8n
      const result = await createJourney(formData);
      setProgress(20);

      // Poll for completion
      await pollJourneyStatus(result.journeyId, (journey) => {
        // Update progress based on days completed
        const completed = journey.days?.filter(d => d.status === 'completed').length || 0;
        setProgress(20 + (completed / 7) * 70);
      });

      setProgress(100);
      
      // Navigate to journey detail
      setTimeout(() => {
        navigate(`/journey/${result.journeyId}`);
      }, 1000);

    } catch (error) {
      console.error('Failed to create journey:', error);
      alert('Failed to create journey. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Your Hypnosis Journey</h1>
      
      {generating ? (
        <div className="text-center">
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-gray-600">
            Creating your personalized journey... {progress}%
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              What is your goal?
            </label>
            <input
              type="text"
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
              className="w-full p-3 border rounded-lg"
              placeholder="e.g., Reduce stress and anxiety"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              What is your intention?
            </label>
            <textarea
              value={formData.intention}
              onChange={(e) => setFormData({...formData, intention: e.target.value})}
              className="w-full p-3 border rounded-lg h-32"
              placeholder="e.g., Find inner peace and calm..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Session Duration (minutes)
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Journey
          </button>
        </form>
      )}
    </div>
  );
};
```

---

## 📋 Environment Variables Needed

Add these to your n8n environment:

```bash
# Backend Integration
BACKEND_URL=https://your-backend.railway.app
N8N_API_KEY=your-n8n-api-key-for-backend-webhooks

# Frontend
FRONTEND_URL=https://your-app.vercel.app

# AI Services
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
DEEPSEEK_API_KEY=your-deepseek-key

# ElevenLabs
ELEVENLABS_API_KEY=your-elevenlabs-key
ELEVENLABS_VOICE_ID=JBFqnCBsd6RMkjVDRZzb

# Google
GOOGLE_DRIVE_FOLDER_ID=your-drive-folder-id

# Databases
PINECONE_API_KEY=pcsk_2R6V3W_U7BaEjBzNoPCmaBgMsmFmBH3ApA9GyqJxeMwugnCR63QeQwGpDhiorJr8msh3Qe
PINECONE_ENVIRONMENT=us-east-1
```

---

## ✅ Testing Checklist

After applying all fixes:

- [ ] Webhook receives payload correctly
- [ ] Workflow Configuration extracts all fields
- [ ] Store Initial Data saves to MongoDB
- [ ] All Pinecone searches work (or are properly disabled)
- [ ] Knowledge merge combines all sources
- [ ] Loop iterates through 7 days correctly
- [ ] Script sections generated by AI agents
- [ ] Evaluation scores calculated
- [ ] Score check routes correctly
- [ ] Audio generation works
- [ ] Files saved to Google Drive
- [ ] Loop completion detected correctly
- [ ] Final journey stored in MongoDB
- [ ] Pinecone updated with creation
- [ ] Backend webhook delivered
- [ ] Frontend receives status updates

---

## 🎯 Quick Fix Priority

1. **High Priority** (Breaks workflow):
   - Workflow Configuration node
   - Pinecone index values (or disable nodes)
   - Loop 7 Days Setup code
   - Check Loop Completion code
   - Merge Audio Files code

2. **Medium Priority** (Degrades function):
   - MongoDB operations
   - HTTP Request configurations
   - Check Score condition

3. **Low Priority** (Nice to have):
   - Email configuration
   - Error handling
   - Logging

---

## 📞 Need Help?

If you get stuck:
1. Check n8n execution logs
2. Test nodes individually using "Test Step"
3. Verify all credentials are configured
4. Check environment variables are set
5. Monitor MongoDB for data flow
6. Check Pinecone for vector storage

---

**Last Updated**: November 8, 2025  
**Status**: Ready for implementation  
**Estimated Fix Time**: 2-3 hours for full workflow

