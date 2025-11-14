# n8n Workflow Fixes Required

## Analysis Date: November 8, 2025

This document outlines all incomplete or problematic parts found in the n8n workflow JSON and provides fixes.

---

## 🔴 Critical Issues Found

### 1. **Workflow Configuration Node** (Lines 23-30)
**Issue**: Empty Set node with no field assignments

**Fix Required**:
```json
{
  "parameters": {
    "mode": "manual",
    "duplicateItem": false,
    "assignments": {
      "assignments": [
        {
          "id": "1",
          "name": "journeyId",
          "value": "={{ $json.journeyId }}",
          "type": "string"
        },
        {
          "id": "2",
          "name": "userId",
          "value": "={{ $json.userId }}",
          "type": "string"
        },
        {
          "id": "3",
          "name": "goal",
          "value": "={{ $json.goal }}",
          "type": "string"
        },
        {
          "id": "4",
          "name": "intention",
          "value": "={{ $json.intention }}",
          "type": "string"
        },
        {
          "id": "5",
          "name": "duration",
          "value": "={{ $json.duration || 15 }}",
          "type": "number"
        },
        {
          "id": "6",
          "name": "userProfile",
          "value": "={{ $json.userProfile }}",
          "type": "object"
        },
        {
          "id": "7",
          "name": "userContext",
          "value": "={{ $json.userContext || [] }}",
          "type": "array"
        },
        {
          "id": "8",
          "name": "timestamp",
          "value": "={{ $now }}",
          "type": "string"
        }
      ]
    },
    "options": {}
  }
}
```

---

### 2. **Store Initial Data Node** (Lines 32-44)
**Issue**: Empty Set node, should be MongoDB insert

**Fix Required**:
```json
{
  "parameters": {
    "operation": "insert",
    "collection": "journeys",
    "fields": "journeyId,userId,goal,intention,duration,status,startedAt,userProfile,userContext",
    "fieldsUi": {
      "fieldValues": [
        {
          "fieldId": "journeyId",
          "fieldValue": "={{ $json.journeyId }}"
        },
        {
          "fieldId": "userId",
          "fieldValue": "={{ $json.userId }}"
        },
        {
          "fieldId": "goal",
          "fieldValue": "={{ $json.goal }}"
        },
        {
          "fieldId": "intention",
          "fieldValue": "={{ $json.intention }}"
        },
        {
          "fieldId": "duration",
          "fieldValue": "={{ $json.duration }}"
        },
        {
          "fieldId": "status",
          "fieldValue": "processing"
        },
        {
          "fieldId": "startedAt",
          "fieldValue": "={{ $now }}"
        },
        {
          "fieldId": "userProfile",
          "fieldValue": "={{ $json.userProfile }}"
        },
        {
          "fieldId": "userContext",
          "fieldValue": "={{ $json.userContext }}"
        }
      ]
    },
    "options": {}
  }
}
```

---

### 3. **All Pinecone Search Nodes** (Lines 46-140)
**Issue**: Empty `pineconeIndex` values

**Fixes Required**:

#### Search Pinecone - User Info:
```json
{
  "parameters": {
    "mode": "retrieve",
    "pineconeIndex": {
      "__rl": true,
      "mode": "list",
      "value": "user-information"
    },
    "topK": 5,
    "options": {}
  }
}
```

#### Search Pinecone - Core Knowledge:
```json
{
  "parameters": {
    "mode": "retrieve",
    "pineconeIndex": {
      "__rl": true,
      "mode": "list",
      "value": "core-hypnosis-knowledge"
    },
    "topK": 10,
    "options": {}
  }
}
```

#### Search Pinecone - Past Creations:
```json
{
  "parameters": {
    "mode": "retrieve",
    "pineconeIndex": {
      "__rl": true,
      "mode": "list",
      "value": "past-creations"
    },
    "topK": 5,
    "options": {}
  }
}
```

#### Search Pinecone - Trends:
```json
{
  "parameters": {
    "mode": "retrieve",
    "pineconeIndex": {
      "__rl": true,
      "mode": "list",
      "value": "interest-trends"
    },
    "topK": 5,
    "options": {}
  }
}
```

---

### 4. **Keywords Sub-Agent (Knowledge)** (Line 178)
**Issue**: Truncated text parameter - cuts off at "embeddedCommands": ["com

**Complete Fix**:
```javascript
"text": "=Generate powerful hypnotic keywords and phrases for:\n\nGOAL: {{$json.goal}}\nINTENTION: {{$json.intention}}\nUSER BACKGROUND: {{$json.userContext}}\n\nBased on knowledge extraction:\n{{$json.knowledgeExtraction}}\n\nProvide:\n1. Core keywords (10-15 words that should appear frequently)\n2. Power phrases (15-20 short phrases for suggestions)\n3. Metaphors (5-7 metaphors relevant to the goal)\n4. Sensory words (words that evoke sight, sound, touch, taste, smell)\n5. Embedded commands (10-15 subtle commands)\n\nFormat as JSON:\n{\n  \"coreKeywords\": [\"keyword1\", \"keyword2\", ...],\n  \"powerPhrases\": [\"phrase1\", \"phrase2\", ...],\n  \"metaphors\": [\n    {\n      \"metaphor\": \"description\",\n      \"usage\": \"how to incorporate\"\n    }\n  ],\n  \"sensoryWords\": {\n    \"visual\": [\"word1\", \"word2\"],\n    \"auditory\": [\"word1\", \"word2\"],\n    \"kinesthetic\": [\"word1\", \"word2\"]\n  },\n  \"embeddedCommands\": [\"command1\", \"command2\", ...]\n}"
```

---

### 5. **Loop 7 Days Setup Node** (Line 479-487)
**Issue**: Empty Code node

**Complete Fix**:
```javascript
// Loop 7 Days Setup - Prepares iteration data for each day

const personalizedBlueprint = $json.personalizedBlueprint || {};
const days = personalizedBlueprint.days || [];
const currentIteration = $input.context?.currentIteration || 0;

if (currentIteration >= 7) {
  // All days complete
  return [{
    json: {
      loopComplete: true,
      totalDays: 7,
      journeyId: $json.journeyId
    }
  }];
}

const currentDay = currentIteration + 1;
const dayData = days[currentIteration] || {};

return [{
  json: {
    currentDay: currentDay,
    dayFocus: dayData.focus || '',
    dayGoal: dayData.goal || '',
    dayApproach: dayData.approach || '',
    keyMessage: dayData.keyMessage || '',
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

---

### 6. **Merge Audio Files Node** (Line 686-695)
**Issue**: Empty Code node

**Complete Fix**:
```javascript
// Merge Audio Files - Combines voice and background audio using ffmpeg

const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const voiceAudio = $('Generate Audio - ElevenLabs').first();
const backgroundAudio = $('Generate Background Sound').first();
const currentDay = $json.currentDay || 1;
const journeyId = $json.journeyId;

// Get binary data from previous nodes
const voiceAudioPath = `/tmp/voice_day${currentDay}.mp3`;
const backgroundAudioPath = `/tmp/background_day${currentDay}.mp3`;
const outputPath = `/tmp/journey_${journeyId}_day${currentDay}_complete.mp3`;

// Write binary data to files
fs.writeFileSync(voiceAudioPath, voiceAudio.binary.data, 'base64');
fs.writeFileSync(backgroundAudioPath, backgroundAudio.binary.data, 'base64');

try {
  // Merge with background at 20% volume
  const command = `ffmpeg -i ${voiceAudioPath} -i ${backgroundAudioPath} -filter_complex "[1:a]volume=0.2[bg];[0:a][bg]amix=inputs=2:duration=first" -y ${outputPath}`;
  
  await execPromise(command);
  
  // Read merged file
  const mergedAudioBuffer = fs.readFileSync(outputPath);
  
  // Get audio duration
  const { stdout } = await execPromise(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${outputPath}`);
  const duration = parseFloat(stdout);
  
  // Clean up temp files
  fs.unlinkSync(voiceAudioPath);
  fs.unlinkSync(backgroundAudioPath);
  
  return [{
    json: {
      day: currentDay,
      journeyId: journeyId,
      duration: Math.round(duration),
      status: 'merged'
    },
    binary: {
      data: mergedAudioBuffer.toString('base64'),
      fileName: `journey_${journeyId}_day${currentDay}_complete.mp3`,
      mimeType: 'audio/mpeg'
    }
  }];
  
} catch (error) {
  throw new Error(`Audio merge failed: ${error.message}`);
}
```

---

### 7. **Check Loop Completion Node** (Line 729-737)
**Issue**: Empty Code node

**Complete Fix**:
```javascript
// Check Loop Completion - Determines if all 7 days are complete

const currentDay = $json.currentDay || 1;
const totalDays = 7;
const journeyId = $json.journeyId;
const userId = $json.userId;

// Retrieve all completed days from MongoDB
const completedDays = $('Store Draft Sections').all().length;

if (currentDay >= totalDays) {
  // All days complete - proceed to final steps
  console.log(`Journey ${journeyId}: All ${totalDays} days complete`);
  
  return [{
    json: {
      loopComplete: true,
      totalDays: totalDays,
      journeyId: journeyId,
      userId: userId,
      allDaysComplete: true,
      completedAt: new Date().toISOString()
    }
  }];
  
} else {
  // More days to process - continue loop
  console.log(`Journey ${journeyId}: Day ${currentDay} complete, continuing to day ${currentDay + 1}`);
  
  return [{
    json: {
      loopComplete: false,
      currentDay: currentDay,
      nextDay: currentDay + 1,
      journeyId: journeyId,
      userId: userId,
      continueLoop: true
    }
  }];
}
```

---

### 8. **Generate Audio - ElevenLabs Node** (Line 663-671)
**Issue**: Empty HTTP Request configuration

**Complete Fix**:
```json
{
  "parameters": {
    "method": "POST",
    "url": "https://api.elevenlabs.io/v1/text-to-speech/={{ $env.ELEVENLABS_VOICE_ID }}",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "xi-api-key",
          "value": "={{ $env.ELEVENLABS_API_KEY }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={\n  \"text\": \"{{ $json.completeScript }}\",\n  \"model_id\": \"eleven_monolingual_v1\",\n  \"voice_settings\": {\n    \"stability\": 0.75,\n    \"similarity_boost\": 0.75,\n    \"style\": 0.5,\n    \"use_speaker_boost\": true\n  }\n}",
    "options": {
      "response": {
        "response": {
          "responseFormat": "file"
        }
      }
    }
  }
}
```

---

### 9. **Generate Background Sound Node** (Line 676-684)
**Issue**: Empty HTTP Request configuration

**Fix Options**:

**Option A: Use Pre-made Background Track**
```json
{
  "parameters": {
    "method": "GET",
    "url": "={{ $env.BACKGROUND_SOUND_URL || 'https://yourdomain.com/sounds/ambient-' + $json.timeOfDay + '.mp3' }}",
    "options": {
      "response": {
        "response": {
          "responseFormat": "file"
        }
      }
    }
  }
}
```

**Option B: Generate with Mubert API**
```json
{
  "parameters": {
    "method": "POST",
    "url": "https://api-b2b.mubert.com/v2/RecordTrack",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Authorization",
          "value": "Bearer {{ $env.MUBERT_API_KEY }}"
        }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={\n  \"method\": \"RecordTrack\",\n  \"params\": {\n    \"mode\": \"track\",\n    \"duration\": {{ $json.duration * 60 }},\n    \"tags\": \"ambient,meditation,peaceful\",\n    \"bitrate\": 320\n  }\n}",
    "options": {
      "response": {
        "response": {
          "responseFormat": "file"
        }
      }
    }
  }
}
```

---

### 10. **Store Draft Sections Node** (Line 592-609)
**Issue**: Missing operation configuration

**Complete Fix**:
```json
{
  "parameters": {
    "operation": "insert",
    "collection": "sections",
    "fields": "section,day,script,estimatedDuration,keyElements,transitionNote,draftId,journeyId,userId,technique,metaphorsUsed,triggers",
    "fieldsUi": {
      "fieldValues": [
        {
          "fieldId": "section",
          "fieldValue": "={{ $json.section }}"
        },
        {
          "fieldId": "day",
          "fieldValue": "={{ $json.day }}"
        },
        {
          "fieldId": "script",
          "fieldValue": "={{ $json.script }}"
        },
        {
          "fieldId": "estimatedDuration",
          "fieldValue": "={{ $json.estimatedDuration }}"
        },
        {
          "fieldId": "keyElements",
          "fieldValue": "={{ $json.keyElements }}"
        },
        {
          "fieldId": "transitionNote",
          "fieldValue": "={{ $json.transitionNote }}"
        },
        {
          "fieldId": "draftId",
          "fieldValue": "={{ $json.draftId || $('Draft Creator Agent').item.json.draftId }}"
        },
        {
          "fieldId": "journeyId",
          "fieldValue": "={{ $json.journeyId }}"
        },
        {
          "fieldId": "userId",
          "fieldValue": "={{ $json.userId }}"
        },
        {
          "fieldId": "technique",
          "fieldValue": "={{ $json.technique }}"
        },
        {
          "fieldId": "createdAt",
          "fieldValue": "={{ $now }}"
        }
      ]
    },
    "options": {}
  }
}
```

---

### 11. **Check Score >= 8 Node** (Line 628-639)
**Issue**: Empty IF condition

**Complete Fix**:
```json
{
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "strict"
      },
      "conditions": [
        {
          "id": "1",
          "leftValue": "={{ $json.overallScore }}",
          "rightValue": 8,
          "operator": {
            "type": "number",
            "operation": "gte"
          }
        }
      ],
      "combinator": "and"
    },
    "options": {}
  }
}
```

---

### 12. **Retrieve Draft Sections Node** (Line 644-658)
**Issue**: Missing query configuration

**Complete Fix**:
```json
{
  "parameters": {
    "operation": "find",
    "collection": "sections",
    "query": "={\n  \"journeyId\": \"{{ $json.journeyId }}\",\n  \"day\": {{ $json.currentDay }},\n  \"draftId\": \"{{ $json.draftId }}\"\n}",
    "options": {
      "sort": "{ \"section\": 1 }",
      "limit": 10
    }
  }
}
```

---

### 13. **Store Complete Journey Node** (Line 739-756)
**Issue**: Missing update configuration

**Complete Fix**:
```json
{
  "parameters": {
    "operation": "update",
    "collection": "journeys",
    "updateKey": "journeyId",
    "updateOptions": "upsert=false",
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
        },
        {
          "fieldId": "metadata.totalDuration",
          "fieldValue": "={{ $json.totalDuration }}"
        },
        {
          "fieldId": "metadata.averageScore",
          "fieldValue": "={{ $json.averageEvaluationScore }}"
        },
        {
          "fieldId": "metadata.techniques",
          "fieldValue": "={{ $json.allTechniques }}"
        },
        {
          "fieldId": "metadata.keywords",
          "fieldValue": "={{ $json.allKeywords }}"
        }
      ]
    },
    "options": {}
  }
}
```

---

### 14. **Update Pinecone - Store Creation Node** (Line 758-781)
**Issue**: Missing mode and proper configuration

**Complete Fix**:
```json
{
  "parameters": {
    "mode": "insert",
    "pineconeIndex": {
      "__rl": true,
      "mode": "list",
      "value": "past-creations"
    },
    "text": "={{ $json.goal + ' - ' + $json.intention + '. Created for user achieving: ' + $json.metadata.keyOutcomes }}",
    "metadata": "={\n  \"journey_id\": \"{{ $json.journeyId }}\",\n  \"user_id\": \"{{ $json.userId }}\",\n  \"goal\": \"{{ $json.goal }}\",\n  \"intention\": \"{{ $json.intention }}\",\n  \"rating\": {{ $json.averageScore }},\n  \"duration\": {{ $json.duration }},\n  \"created_date\": \"{{ $now }}\",\n  \"techniques\": {{ JSON.stringify($json.techniques) }},\n  \"keywords\": {{ JSON.stringify($json.keywords) }}\n}",
    "options": {}
  }
}
```

---

### 15. **Send Webhook to Backend Node** (Line 783-794)
**Issue**: Empty HTTP Request configuration

**Complete Fix**:
```json
{
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
    "jsonBody": "={\n  \"journeyId\": \"{{ $json.journeyId }}\",\n  \"userId\": \"{{ $json.userId }}\",\n  \"status\": \"completed\",\n  \"days\": {{ JSON.stringify($json.days) }},\n  \"metadata\": {{ JSON.stringify($json.metadata) }}\n}",
    "options": {}
  }
}
```

---

### 16. **Save to Google Drive Node** (Line 697-726)
**Issue**: Missing file upload configuration

**Complete Fix**:
```json
{
  "parameters": {
    "authentication": "serviceAccount",
    "resource": "file",
    "operation": "upload",
    "driveId": {
      "__rl": true,
      "mode": "list",
      "value": "My Drive"
    },
    "folderId": {
      "__rl": true,
      "mode": "list",
      "value": "={{ $env.GOOGLE_DRIVE_FOLDER_ID }}",
      "cachedResultName": "Hypnosis Journeys"
    },
    "name": "=Journey_{{ $json.journeyId }}_Day{{ $json.currentDay }}.mp3",
    "binaryData": true,
    "options": {
      "googleFileConversion": {
        "conversion": {
          "doNotConvert": true
        }
      }
    }
  }
}
```

---

### 17. **Send Email to User Node** (Line 796-815)
**Issue**: Missing email configuration

**Complete Fix**:
```json
{
  "parameters": {
    "authentication": "serviceAccount",
    "resource": "message",
    "operation": "send",
    "sendTo": "={{ $json.userEmail }}",
    "subject": "Your 7-Day Hypnosis Journey is Ready! 🎉",
    "emailType": "html",
    "message": "=<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\n    .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }\n    .content { background: #f9fafb; padding: 30px; }\n    .button { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }\n    .day-card { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }\n    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <div class=\"header\">\n      <h1>🎉 Your Journey is Ready!</h1>\n      <p>Your personalized 7-day hypnosis journey has been created</p>\n    </div>\n    \n    <div class=\"content\">\n      <p>Hi {{ $json.userName }},</p>\n      \n      <p>Great news! Your personalized 7-day hypnosis journey for <strong>{{ $json.goal }}</strong> is now ready and waiting for you.</p>\n      \n      <p>We've created a unique experience tailored specifically to your goals, preferences, and personal situation.</p>\n      \n      <p style=\"text-align: center;\">\n        <a href=\"{{ $env.FRONTEND_URL }}/dashboard/journey/{{ $json.journeyId }}\" class=\"button\">\n          Start Your Journey\n        </a>\n      </p>\n      \n      <h3>Tips for Success:</h3>\n      <ul>\n        <li>Listen at the same time each day for best results</li>\n        <li>Find a quiet, comfortable space</li>\n        <li>Use headphones for the best experience</li>\n        <li>Keep a journal to track your progress</li>\n        <li>Be patient with yourself - change takes time</li>\n      </ul>\n      \n      <p>We're excited to be part of your transformation journey!</p>\n      \n      <p>Happy listening! 🎧</p>\n    </div>\n    \n    <div class=\"footer\">\n      <p>The Hypnosis Generator Team</p>\n      <p><a href=\"{{ $env.FRONTEND_URL }}\">Visit Dashboard</a> | <a href=\"{{ $env.FRONTEND_URL }}/settings\">Settings</a></p>\n    </div>\n  </div>\n</body>\n</html>",
    "options": {}
  }
}
```

---

## ⚠️ Missing Nodes

The following nodes from the workflow plan are completely missing:

### 1. YouTube Search & Download (for online research)
- YouTube Search node
- Download Top Videos node  
- Transcribe Videos node
- These are referenced but not present in connections

### 2. Agent Sub-Nodes Missing Configuration
All the following sub-agent nodes have incomplete or missing text parameters:
- Structure Sub-Agent (Knowledge)
- Structure Sub-Agent (Research) 
- Structure Sub-Agent (Script)
- Keywords Sub-Agent (Script)
- Hypnotic Elements Sub-Agent (Script)
- Why It Works Sub-Agent (Script)

---

## 🔧 Configuration Requirements

### Environment Variables Needed (Set in n8n)
```bash
# Backend
BACKEND_URL=https://your-backend.railway.app
N8N_API_KEY=your-n8n-api-key

# Frontend
FRONTEND_URL=https://your-app.vercel.app

# AI Models
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
DEEPSEEK_API_KEY=your-deepseek-key

# ElevenLabs
ELEVENLABS_API_KEY=your-elevenlabs-key
ELEVENLABS_VOICE_ID=your-voice-id

# Google APIs
GOOGLE_API_KEY=your-google-api-key
GOOGLE_DRIVE_FOLDER_ID=your-folder-id

# Databases
MONGODB_SCRIPTS_URI=mongodb://...
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=your-pinecone-environment

# Optional
BACKGROUND_SOUND_URL=https://your-cdn.com/sounds/
MUBERT_API_KEY=your-mubert-key (if using AI-generated background)
```

### Credentials to Configure in n8n
1. **MongoDB** - Connection to scripts database
2. **Pinecone API** - For vector storage
3. **OpenAI API** - For GPT-4 and Whisper
4. **Anthropic API** - For Claude models  
5. **DeepSeek API** - For DeepSeek model
6. **Google Service Account** - For Drive and Gmail
7. **ElevenLabs** - For TTS
8. **HTTP Header Auth** - For webhook authentication

---

## 📋 Recommended Implementation Order

1. ✅ Fix Workflow Configuration node
2. ✅ Fix Store Initial Data node
3. ✅ Fix all Pinecone search nodes
4. ✅ Fix Merge Knowledge Sources node
5. ✅ Fix all MongoDB operation nodes
6. ✅ Fix Code nodes (Loop Setup, Merge Audio, Check Completion)
7. ✅ Fix HTTP Request nodes (ElevenLabs, Webhook, Email)
8. ✅ Complete all sub-agent text parameters
9. ✅ Add missing YouTube research nodes (optional for MVP)
10. ✅ Test with mock data
11. ✅ Deploy and integrate with backend

---

## 🎯 Testing Checklist

- [ ] Webhook receives payload correctly
- [ ] Workflow Configuration extracts all fields
- [ ] Store Initial Data saves to MongoDB
- [ ] All Pinecone searches return results
- [ ] Knowledge merge combines all sources
- [ ] Loop iterates through 7 days
- [ ] Draft sections stored to MongoDB
- [ ] Evaluation scores calculated
- [ ] Audio generation works
- [ ] Audio merge produces valid MP3
- [ ] Google Drive upload succeeds
- [ ] Loop completion detected correctly
- [ ] Final journey stored
- [ ] Pinecone update succeeds
- [ ] Backend webhook delivered
- [ ] Email sent to user

---

## 📞 Support

For questions or issues:
- Check n8n execution logs
- Review MongoDB collections
- Verify all environment variables
- Check API rate limits
- Monitor workflow execution time

**Last Updated**: November 8, 2025

