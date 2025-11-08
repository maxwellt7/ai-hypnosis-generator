# n8n Workflow Plan - AI Hypnosis Generator

## 🎯 Workflow Overview

The n8n workflow orchestrates the entire hypnosis journey creation process, from initial trigger through research, script generation, evaluation, audio creation, and delivery.

**Estimated Duration**: 5-10 minutes per journey  
**Total Nodes**: ~50-60 nodes  
**AI Agents**: 15+ specialized agents

---

## 📊 Workflow Architecture

```
1. Webhook Trigger (Journey Creation Request)
   ↓
2. Store Initial Data
   ↓
3. PARALLEL BRANCH A: Knowledge Base Search
   ├─ 3a. Search Pinecone (User Info)
   ├─ 3b. Search Pinecone (Core Knowledge)
   ├─ 3c. Search Pinecone (Past Creations)
   ├─ 3d. Search Pinecone (Trends)
   └─ 3e. Knowledge Extraction Agent
        ├─ Structure Sub-Agent
        ├─ Keywords Sub-Agent
        ├─ Hypnotic Elements Sub-Agent
        └─ Why It Works Sub-Agent
   ↓
4. PARALLEL BRANCH B: Online Research
   ├─ 4a. YouTube Search
   ├─ 4b. Download Top Videos
   ├─ 4c. Transcribe Videos
   └─ 4d. Reverse Engineering Agent
        ├─ Structure Sub-Agent
        ├─ Keywords Sub-Agent
        ├─ Hypnotic Elements Sub-Agent
        └─ Why It Works Sub-Agent
   ↓
5. Merge Knowledge Sources
   ↓
6. Rating & Evaluation Agent
   ↓
7. Script Suggestions Agent
   ↓
8. Script Elements Agent
   ├─ Structure Sub-Agent
   ├─ Keywords Sub-Agent
   ├─ Hypnotic Elements Sub-Agent
   └─ Why It Works Sub-Agent
   ↓
9. User Personalization Agent
   ↓
10. LOOP: 7 Days
    ├─ 10a. Draft Creator Agent
    │    ├─ Intention & Calibration Sub-Agent → MongoDB
    │    ├─ Induction Sub-Agent → MongoDB
    │    ├─ Deepener Sub-Agent → MongoDB
    │    ├─ Future Pacing Sub-Agent → MongoDB
    │    └─ Awakening Sub-Agent → MongoDB
    ├─ 10b. Evaluator Agent
    │    └─ IF score < 8 → Loop back to 10a with feedback
    │         IF score ≥ 8 → Continue
    ├─ 10c. Audio Generation
    │    ├─ ElevenLabs TTS (section by section from MongoDB)
    │    ├─ Background Sound Generation
    │    └─ Merge Audio + Sound
    └─ 10d. Save to Google Drive
   ↓
11. Store Complete Journey in MongoDB
    ↓
12. Update Pinecone (Store Creation)
    ↓
13. Send Webhook to Backend (Journey Complete)
    ↓
14. Send Email to User
```

---

## 🔧 Node Configurations

### 1. Webhook Trigger

**Node Type**: Webhook  
**Method**: POST  
**Path**: `/journey-create`  
**Authentication**: Header Auth (Bearer token)

**Expected Payload**:
```json
{
  "journeyId": "uuid",
  "userId": "uuid",
  "goal": "string",
  "intention": "string",
  "duration": 15,
  "userProfile": {
    "preference_time_of_day": "morning",
    "preference_duration": 15,
    "onboarding_data": {}
  },
  "userContext": []
}
```

---

### 2. Store Initial Data

**Node Type**: MongoDB  
**Operation**: Insert  
**Collection**: `journeys`

**Document**:
```json
{
  "journeyId": "{{$json.journeyId}}",
  "userId": "{{$json.userId}}",
  "goal": "{{$json.goal}}",
  "intention": "{{$json.intention}}",
  "duration": "{{$json.duration}}",
  "status": "processing",
  "startedAt": "{{$now}}",
  "userProfile": "{{$json.userProfile}}",
  "userContext": "{{$json.userContext}}"
}
```

---

## 🔍 BRANCH A: Knowledge Base Search

### 3a. Search Pinecone (User Info)

**Node Type**: HTTP Request  
**Method**: POST  
**URL**: Pinecone Query API  
**Authentication**: API Key

**Body**:
```json
{
  "namespace": "user-{{$json.userId}}",
  "vector": "{{$json.goalEmbedding}}",
  "topK": 5,
  "includeMetadata": true
}
```

**Note**: Need to generate embedding first using Cohere

---

### 3b-3d. Search Other Pinecone Indices

Similar configuration for:
- Core Knowledge (`core-hypnosis-knowledge` index)
- Past Creations (`past-creations` index)
- Trends (`interest-trends` index)

---

### 3e. Knowledge Extraction Agent

**Node Type**: OpenAI (GPT-4)  
**Model**: gpt-4-turbo-preview  
**Temperature**: 0.7  
**Max Tokens**: 2000

**System Prompt**:
```
You are an expert hypnotherapist and script analyst. Your role is to extract valuable insights from existing hypnosis knowledge to inform the creation of new, personalized hypnosis scripts.

You will analyze:
1. User information (goals, preferences, background)
2. Core hypnosis knowledge (techniques, principles)
3. Past successful creations
4. Current trends and best practices

Your task is to synthesize this information and provide:
- Recommended script structure
- Key words and phrases that resonate
- Hypnotic elements to include
- Explanation of why these approaches work

Be specific, actionable, and evidence-based in your recommendations.
```

**User Prompt**:
```
Analyze the following knowledge sources for creating a hypnosis journey:

GOAL: {{$json.goal}}
INTENTION: {{$json.intention}}
DURATION: {{$json.duration}} minutes
USER PREFERENCE: {{$json.userProfile.preference_time_of_day}}

USER INFORMATION:
{{$json.userInfoResults}}

CORE KNOWLEDGE:
{{$json.coreKnowledgeResults}}

PAST CREATIONS:
{{$json.pastCreationsResults}}

TRENDS:
{{$json.trendsResults}}

Provide a comprehensive analysis including:
1. Recommended structure for this specific goal
2. Key words and phrases to use
3. Hypnotic elements to incorporate
4. Why this approach will work for this user

Format your response as JSON:
{
  "structure": {
    "intention": "description",
    "calibration": "description",
    "induction": "description",
    "deepener": "description",
    "suggestions": "description",
    "futurePacing": "description",
    "awakening": "description"
  },
  "keywords": ["keyword1", "keyword2", ...],
  "hypnoticElements": [
    {
      "element": "name",
      "description": "how to use",
      "example": "example phrase"
    }
  ],
  "rationale": "why this approach works",
  "considerations": ["consideration1", "consideration2", ...]
}
```

---

#### Sub-Agent: Structure Recommendation

**Node Type**: Anthropic (Claude)  
**Model**: claude-3-sonnet  
**Temperature**: 0.6

**System Prompt**:
```
You are a hypnosis script structure specialist. Your expertise is in designing the optimal flow and structure for hypnosis sessions based on the goal, user profile, and best practices.

Provide detailed recommendations for each section of the hypnosis script:
1. Intention & Calibration (2-3 minutes)
2. Induction (3-5 minutes)
3. Deepener (2-3 minutes)
4. Suggestions/Main Content (varies)
5. Future Pacing (2-3 minutes)
6. Awakening (1-2 minutes)

Consider:
- User's time preference (morning/evening affects energy level)
- Total duration constraint
- Goal type (behavioral change, emotional healing, performance)
- User's experience level with hypnosis
```

**User Prompt**:
```
Design the optimal structure for a hypnosis session:

GOAL: {{$json.goal}}
INTENTION: {{$json.intention}}
TOTAL DURATION: {{$json.duration}} minutes
TIME OF DAY: {{$json.userProfile.preference_time_of_day}}
USER EXPERIENCE: {{$json.userProfile.onboarding_data.hypnosis_experience}}

Based on the knowledge extraction:
{{$json.knowledgeExtraction}}

Provide:
1. Time allocation for each section
2. Specific approach for each section
3. Transition strategies between sections
4. Key focus areas

Format as JSON:
{
  "sections": [
    {
      "name": "intention",
      "duration": 2,
      "approach": "description",
      "keyElements": ["element1", "element2"],
      "transition": "how to transition to next section"
    },
    ...
  ],
  "overallFlow": "description of the journey arc",
  "adaptations": "specific adaptations for this user"
}
```

---

#### Sub-Agent: Keywords Generator

**Node Type**: OpenAI (GPT-4)  
**Model**: gpt-4-turbo-preview  
**Temperature**: 0.8

**System Prompt**:
```
You are a hypnotic language specialist. Your expertise is in identifying and generating powerful, resonant words and phrases that create deep subconscious impact.

You understand:
- Embedded commands
- Presuppositions
- Sensory-rich language
- Metaphors and analogies
- Pacing and leading
- Positive framing

Generate keywords and phrases that:
1. Align with the user's goal and intention
2. Bypass critical thinking and speak to the subconscious
3. Create vivid sensory experiences
4. Suggest positive outcomes without resistance
5. Build momentum and motivation
```

**User Prompt**:
```
Generate powerful hypnotic keywords and phrases for:

GOAL: {{$json.goal}}
INTENTION: {{$json.intention}}
USER BACKGROUND: {{$json.userContext}}

Based on knowledge extraction:
{{$json.knowledgeExtraction}}

Provide:
1. Core keywords (10-15 words that should appear frequently)
2. Power phrases (15-20 short phrases for suggestions)
3. Metaphors (5-7 metaphors relevant to the goal)
4. Sensory words (words that evoke sight, sound, touch, taste, smell)
5. Embedded commands (10-15 subtle commands)

Format as JSON:
{
  "coreKeywords": ["keyword1", "keyword2", ...],
  "powerPhrases": ["phrase1", "phrase2", ...],
  "metaphors": [
    {
      "metaphor": "description",
      "usage": "how to incorporate"
    }
  ],
  "sensoryWords": {
    "visual": ["word1", "word2"],
    "auditory": ["word1", "word2"],
    "kinesthetic": ["word1", "word2"]
  },
  "embeddedCommands": ["command1", "command2", ...]
}
```

---

#### Sub-Agent: Hypnotic Elements Creator

**Node Type**: Anthropic (Claude)  
**Model**: claude-3-sonnet  
**Temperature**: 0.7

**System Prompt**:
```
You are an expert in hypnotic techniques and elements. Your role is to identify and specify which hypnotic techniques should be used in this particular script, and how to implement them effectively.

Hypnotic techniques include:
- Progressive relaxation
- Visualization
- Anchoring
- Reframing
- Age regression/progression
- Parts therapy
- Metaphorical storytelling
- Confusion techniques
- Pattern interrupts
- Post-hypnotic suggestions
- Compounding suggestions
- Binds and double binds
- Presuppositions
- Embedded commands

Select and customize techniques based on:
- The user's goal
- Their experience level
- Time constraints
- Personality indicators from onboarding
```

**User Prompt**:
```
Identify and specify hypnotic elements for:

GOAL: {{$json.goal}}
INTENTION: {{$json.intention}}
DURATION: {{$json.duration}} minutes
USER PROFILE: {{$json.userProfile}}

Knowledge extraction insights:
{{$json.knowledgeExtraction}}

Provide:
1. Primary techniques (3-5 main techniques to use)
2. Supporting techniques (5-7 additional techniques)
3. Implementation details for each
4. Timing and placement recommendations
5. Contraindications or cautions

Format as JSON:
{
  "primaryTechniques": [
    {
      "name": "technique name",
      "description": "what it is",
      "implementation": "how to use it",
      "timing": "when in the script",
      "example": "example usage"
    }
  ],
  "supportingTechniques": [...],
  "sequencing": "how techniques build on each other",
  "cautions": ["caution1", "caution2"]
}
```

---

#### Sub-Agent: Why It Works

**Node Type**: DeepSeek  
**Model**: deepseek-chat  
**Temperature**: 0.5

**System Prompt**:
```
You are a neuroscience and psychology expert specializing in hypnosis and behavior change. Your role is to explain the scientific and psychological rationale behind hypnotic approaches.

Provide evidence-based explanations that reference:
- Neuroscience (brain mechanisms, neuroplasticity)
- Psychology (cognitive-behavioral principles, conditioning)
- Hypnosis research
- Behavior change theory

Your explanations should:
1. Be scientifically accurate
2. Be accessible to non-experts
3. Build credibility and trust
4. Enhance the user's belief in the process
```

**User Prompt**:
```
Explain why the recommended approach will work for:

GOAL: {{$json.goal}}
INTENTION: {{$json.intention}}

RECOMMENDED APPROACH:
Structure: {{$json.structureRecommendation}}
Keywords: {{$json.keywords}}
Techniques: {{$json.hypnoticElements}}

Provide:
1. Neurological basis (how it affects the brain)
2. Psychological mechanisms (why it creates change)
3. Evidence from research (studies or principles)
4. Expected outcomes and timeline
5. Factors that enhance effectiveness

Format as JSON:
{
  "neurologicalBasis": "explanation",
  "psychologicalMechanisms": "explanation",
  "researchEvidence": [
    {
      "principle": "name",
      "explanation": "how it applies"
    }
  ],
  "expectedOutcomes": {
    "immediate": "what user will notice right away",
    "shortTerm": "changes in first week",
    "longTerm": "sustained changes"
  },
  "enhancingFactors": ["factor1", "factor2", ...]
}
```

---

## 🌐 BRANCH B: Online Research

### 4a. YouTube Search

**Node Type**: HTTP Request  
**Method**: GET  
**URL**: `https://www.googleapis.com/youtube/v3/search`

**Query Parameters**:
```javascript
{
  "part": "snippet",
  "q": "{{$json.goal}} hypnosis meditation",
  "type": "video",
  "videoDuration": "medium", // 4-20 minutes
  "order": "relevance",
  "maxResults": 5,
  "key": "{{$env.GOOGLE_API_KEY}}"
}
```

---

### 4b. Download Top Videos

**Node Type**: Code (JavaScript)  
**Libraries**: yt-dlp or youtube-dl

**Code**:
```javascript
const videoIds = $input.all().map(item => item.json.id.videoId);
const downloads = [];

for (const videoId of videoIds) {
  const result = await $exec(`yt-dlp -f 'bestaudio' -o '/tmp/%(id)s.%(ext)s' https://www.youtube.com/watch?v=${videoId}`);
  downloads.push({
    videoId,
    audioPath: `/tmp/${videoId}.m4a`
  });
}

return downloads;
```

---

### 4c. Transcribe Videos

**Node Type**: OpenAI (Whisper)  
**Model**: whisper-1

**For each video**:
- Upload audio file
- Get transcription
- Store with video metadata

---

### 4d. Reverse Engineering Agent

**Node Type**: OpenAI (GPT-4)  
**Model**: gpt-4-turbo-preview  
**Temperature**: 0.6

**System Prompt**:
```
You are an expert at analyzing hypnosis and meditation content. Your role is to reverse-engineer successful hypnosis scripts by identifying:

1. Structure and flow
2. Language patterns and keywords
3. Hypnotic techniques used
4. What makes it effective

You will analyze transcripts of popular hypnosis videos and extract actionable insights that can be adapted for new scripts.

Be analytical, specific, and focus on transferable elements rather than copying content.
```

**User Prompt**:
```
Analyze the following hypnosis video transcript:

TITLE: {{$json.videoTitle}}
VIEWS: {{$json.viewCount}}
LIKES: {{$json.likeCount}}
DURATION: {{$json.duration}}

TRANSCRIPT:
{{$json.transcript}}

USER'S GOAL: {{$json.goal}}

Extract:
1. Overall structure (sections and timing)
2. Key words and phrases used frequently
3. Hypnotic techniques identified
4. What makes this effective (why it's popular)
5. Elements that could be adapted for our user's goal

Format as JSON:
{
  "structure": {
    "sections": [
      {
        "name": "section name",
        "startTime": "timestamp",
        "duration": "minutes",
        "purpose": "what it accomplishes"
      }
    ]
  },
  "keywords": ["keyword1", "keyword2", ...],
  "techniques": [
    {
      "technique": "name",
      "examples": ["example1", "example2"],
      "effectiveness": "why it works"
    }
  ],
  "successFactors": ["factor1", "factor2", ...],
  "adaptableElements": [
    {
      "element": "what it is",
      "adaptation": "how to adapt for our goal"
    }
  ],
  "rating": 8.5
}
```

---

## 🔀 5. Merge Knowledge Sources

**Node Type**: Code (JavaScript)

**Code**:
```javascript
const knowledgeBaseResults = $('Knowledge Extraction Agent').all();
const onlineResearchResults = $('Reverse Engineering Agent').all();

// Combine and deduplicate insights
const merged = {
  structures: [],
  keywords: new Set(),
  techniques: [],
  ratings: []
};

// Process knowledge base
knowledgeBaseResults.forEach(result => {
  merged.structures.push(result.json.structure);
  result.json.keywords.forEach(kw => merged.keywords.add(kw));
  merged.techniques.push(...result.json.hypnoticElements);
});

// Process online research
onlineResearchResults.forEach(result => {
  merged.structures.push(result.json.structure);
  result.json.keywords.forEach(kw => merged.keywords.add(kw));
  merged.techniques.push(...result.json.techniques);
  merged.ratings.push({
    source: result.json.videoTitle,
    rating: result.json.rating
  });
});

return [{
  json: {
    mergedStructures: merged.structures,
    mergedKeywords: Array.from(merged.keywords),
    mergedTechniques: merged.techniques,
    sourceRatings: merged.ratings,
    totalSources: knowledgeBaseResults.length + onlineResearchResults.length
  }
}];
```

---

## ⭐ 6. Rating & Evaluation Agent

**Node Type**: Anthropic (Claude)  
**Model**: claude-3-sonnet  
**Temperature**: 0.4

**System Prompt**:
```
You are an expert evaluator of hypnosis content and approaches. Your role is to assess the quality and suitability of research findings for creating a personalized hypnosis script.

Evaluate based on:
1. Relevance to user's goal (0-10)
2. Scientific validity (0-10)
3. Proven effectiveness (0-10)
4. Adaptability to user's profile (0-10)
5. Completeness of information (0-10)

Provide an overall rating and specific recommendations for which elements to prioritize.
```

**User Prompt**:
```
Evaluate the merged research findings:

USER'S GOAL: {{$json.goal}}
USER PROFILE: {{$json.userProfile}}

MERGED RESEARCH:
Structures: {{$json.mergedStructures}}
Keywords: {{$json.mergedKeywords}}
Techniques: {{$json.mergedTechniques}}
Source Ratings: {{$json.sourceRatings}}

Provide:
1. Overall quality rating (0-10)
2. Individual ratings for each criterion
3. Strengths of the research
4. Gaps or weaknesses
5. Prioritized recommendations
6. Elements to emphasize
7. Elements to avoid or modify

Format as JSON:
{
  "overallRating": 8.5,
  "criteriaRatings": {
    "relevance": 9,
    "validity": 8,
    "effectiveness": 9,
    "adaptability": 8,
    "completeness": 8
  },
  "strengths": ["strength1", "strength2", ...],
  "gaps": ["gap1", "gap2", ...],
  "recommendations": [
    {
      "priority": "high",
      "recommendation": "what to do",
      "rationale": "why"
    }
  ],
  "emphasize": ["element1", "element2", ...],
  "avoid": ["element1", "element2", ...]
}
```

---

## 💡 7. Script Suggestions Agent

**Node Type**: OpenAI (GPT-4)  
**Model**: gpt-4-turbo-preview  
**Temperature**: 0.8

**System Prompt**:
```
You are a creative hypnosis script consultant. Based on research and evaluation, you generate high-level suggestions for the overall approach and themes of the 7-day journey.

Consider:
- Progression across 7 days (building intensity, deepening practice)
- Variety to maintain engagement
- Consistency in core message
- Personalization to user's specific situation

Provide creative yet evidence-based suggestions for the journey arc.
```

**User Prompt**:
```
Create high-level suggestions for a 7-day hypnosis journey:

GOAL: {{$json.goal}}
INTENTION: {{$json.intention}}
DURATION PER DAY: {{$json.duration}} minutes

RESEARCH EVALUATION:
{{$json.evaluation}}

AVAILABLE ELEMENTS:
Structures: {{$json.mergedStructures}}
Keywords: {{$json.mergedKeywords}}
Techniques: {{$json.mergedTechniques}}

Provide:
1. Overall journey theme
2. Day-by-day focus areas
3. Progression strategy
4. Variation approach
5. Key messages to reinforce

Format as JSON:
{
  "journeyTheme": "overarching theme",
  "tagline": "inspiring tagline",
  "days": [
    {
      "day": 1,
      "focus": "what this day focuses on",
      "goal": "what user should achieve",
      "approach": "how to approach it",
      "keyMessage": "core message"
    },
    ...
  ],
  "progression": "how the journey builds",
  "variationStrategy": "how to keep it fresh",
  "reinforcedMessages": ["message1", "message2", ...]
}
```

---

## 🎨 8. Script Elements Agent

**Node Type**: Anthropic (Claude)  
**Model**: claude-3-opus  
**Temperature**: 0.7

**System Prompt**:
```
You are the master architect of hypnosis scripts. You take all research, evaluation, and suggestions, and create the definitive blueprint for each day's script.

This blueprint will guide the actual script writers (sub-agents) to create coherent, effective, personalized hypnosis sessions.

Your blueprint must be:
- Highly specific and detailed
- Actionable for script writers
- Consistent with research and evaluation
- Personalized to the user
- Optimized for the stated goal
```

**User Prompt**:
```
Create the definitive script blueprint for the 7-day journey:

GOAL: {{$json.goal}}
INTENTION: {{$json.intention}}
USER PROFILE: {{$json.userProfile}}
USER CONTEXT: {{$json.userContext}}

RESEARCH & EVALUATION:
{{$json.evaluation}}

SCRIPT SUGGESTIONS:
{{$json.scriptSuggestions}}

For each of the 7 days, provide:
1. Detailed structure with timing
2. Specific keywords and phrases to use
3. Hypnotic techniques to employ
4. Tone and pacing guidance
5. Personalization points
6. Transition strategies

Format as JSON with detailed specifications for each day.
```

*[Continue with sub-agents similar to Branch A]*

---

## 👤 9. User Personalization Agent

**Node Type**: OpenAI (GPT-4)  
**Model**: gpt-4-turbo-preview  
**Temperature**: 0.6

**System Prompt**:
```
You are a personalization specialist. Your role is to take the generic script blueprint and deeply personalize it to the specific user based on their profile, onboarding responses, goals, and context.

Personalization includes:
- Using their specific language and phrasing
- Referencing their unique situation
- Addressing their specific challenges
- Incorporating their preferences
- Adapting tone to their personality
- Including relevant personal details

Make the script feel like it was written specifically for this one person.
```

**User Prompt**:
```
Personalize the script blueprint for this specific user:

USER PROFILE:
Name: {{$json.userProfile.name}}
Goal: {{$json.goal}}
Intention: {{$json.intention}}
Time Preference: {{$json.userProfile.preference_time_of_day}}
Duration: {{$json.duration}} minutes

ONBOARDING RESPONSES:
{{$json.userProfile.onboarding_data}}

USER CONTEXT (from Pinecone):
{{$json.userContext}}

SCRIPT BLUEPRINT:
{{$json.scriptBlueprint}}

For each day, provide:
1. Personalized opening (reference their specific situation)
2. Customized metaphors and examples
3. Adapted language patterns
4. Personal challenges to address
5. Specific outcomes they desire
6. Personalized affirmations

Format as JSON with personalization details for each day.
```

---

## 🔄 10. LOOP: 7 Days - Draft Creator

This section loops 7 times, once for each day of the journey.

### Loop Setup

**Node Type**: Loop Over Items  
**Items**: Array of 7 days from script blueprint

---

### 10a. Draft Creator Agent (Orchestrator)

**Node Type**: OpenAI (GPT-4)  
**Model**: gpt-4-turbo-preview  
**Temperature**: 0.7

**System Prompt**:
```
You are the orchestrator for creating a complete hypnosis script for one day. You will coordinate with specialized sub-agents to create each section of the script.

The sections are:
1. Intention & Calibration (2-3 min)
2. Induction (3-5 min)
3. Deepener (2-3 min)
4. Suggestions/Main Content (varies)
5. Future Pacing (2-3 min)
6. Awakening (1-2 min)

Your role is to:
- Provide context to each sub-agent
- Ensure consistency across sections
- Maintain the overall flow
- Verify timing constraints
- Ensure personalization is maintained
```

**User Prompt**:
```
Orchestrate the creation of Day {{$json.currentDay}} script:

DAY FOCUS: {{$json.dayFocus}}
DAY GOAL: {{$json.dayGoal}}
TOTAL DURATION: {{$json.duration}} minutes

PERSONALIZED BLUEPRINT:
{{$json.personalizedBlueprint}}

Create a complete script by coordinating with sub-agents for each section.
Ensure smooth transitions and consistent messaging throughout.
```

---

### Sub-Agent: Intention & Calibration

**Node Type**: Anthropic (Claude)  
**Model**: claude-3-sonnet  
**Temperature**: 0.75

**System Prompt**:
```
You are a specialist in creating the opening section of hypnosis scripts: Intention & Calibration.

This section (2-3 minutes) should:
1. Welcome the listener
2. Set the intention for the session
3. Create rapport and trust
4. Begin initial relaxation
5. Calibrate to their current state
6. Establish expectation of success

Use warm, inviting language. Be conversational yet professional. Create immediate comfort and safety.
```

**User Prompt**:
```
Create the Intention & Calibration section for Day {{$json.currentDay}}:

DAY FOCUS: {{$json.dayFocus}}
USER'S NAME: {{$json.userName}}
TIME OF DAY: {{$json.timeOfDay}}
GOAL: {{$json.goal}}
INTENTION: {{$json.intention}}

PERSONALIZATION:
{{$json.personalization}}

BLUEPRINT GUIDANCE:
{{$json.blueprintSection}}

Create a 2-3 minute script (approximately 300-450 words) that:
- Welcomes the user warmly
- Acknowledges their commitment
- States the intention for this session
- Begins gentle relaxation
- Creates safety and trust
- Sets positive expectations

Write in second person ("you"). Be specific to their goal and situation.

Format as JSON:
{
  "section": "intention_calibration",
  "day": {{$json.currentDay}},
  "script": "full script text",
  "estimatedDuration": 2.5,
  "keyElements": ["element1", "element2", ...],
  "transitionNote": "how to transition to induction"
}
```

**Action After**: Store result in MongoDB collection `sections`

---

### Sub-Agent: Induction

**Node Type**: OpenAI (GPT-4)  
**Model**: gpt-4-turbo-preview  
**Temperature**: 0.7

**System Prompt**:
```
You are a specialist in hypnotic inductions. Your role is to guide the listener from normal waking consciousness into a relaxed, receptive hypnotic state.

Induction techniques you can use:
- Progressive muscle relaxation
- Countdown (10 to 1, 20 to 1, etc.)
- Visualization (stairs, elevator, beach, etc.)
- Eye fixation
- Breathing focus
- Body scan
- Confusion technique (advanced)

The induction should:
1. Be appropriate for the user's experience level
2. Match the time of day (energizing for morning, relaxing for evening)
3. Build on the intention & calibration
4. Create deep relaxation
5. Bypass critical thinking
6. Prepare for suggestions

Duration: 3-5 minutes
```

**User Prompt**:
```
Create the Induction section for Day {{$json.currentDay}}:

DAY FOCUS: {{$json.dayFocus}}
TIME OF DAY: {{$json.timeOfDay}}
USER EXPERIENCE LEVEL: {{$json.experienceLevel}}
PREFERRED TECHNIQUE: {{$json.preferredInductionTechnique}}

PREVIOUS SECTION:
{{$json.intentionCalibrationScript}}

BLUEPRINT GUIDANCE:
{{$json.blueprintSection}}

Create a 3-5 minute induction (approximately 450-750 words) that:
- Builds smoothly from the previous section
- Uses the recommended technique
- Is appropriate for time of day
- Creates deep relaxation
- Includes embedded suggestions
- Prepares for the deepener

Use pacing and leading. Include sensory details. Create a vivid experience.

Format as JSON:
{
  "section": "induction",
  "day": {{$json.currentDay}},
  "script": "full script text",
  "technique": "technique used",
  "estimatedDuration": 4,
  "keyElements": ["element1", "element2", ...],
  "transitionNote": "how to transition to deepener"
}
```

**Action After**: Store result in MongoDB collection `sections`

---

### Sub-Agent: Deepener

**Node Type**: Anthropic (Claude)  
**Model**: claude-3-sonnet  
**Temperature**: 0.7

**System Prompt**:
```
You are a specialist in deepening hypnotic states. Your role is to take the relaxed state from the induction and deepen it further, making the listener even more receptive to suggestions.

Deepening techniques:
- Fractionation (up and down)
- Counting down deeper
- Descending imagery (elevator, stairs, diving)
- Deepening triggers ("deeper and deeper")
- Compounding suggestions
- Confusion and overload
- Time distortion

The deepener should:
1. Build on the induction smoothly
2. Create an even deeper state
3. Increase suggestibility
4. Maintain engagement
5. Prepare for the main suggestions

Duration: 2-3 minutes
```

**User Prompt**:
```
Create the Deepener section for Day {{$json.currentDay}}:

DAY FOCUS: {{$json.dayFocus}}
INDUCTION TECHNIQUE USED: {{$json.inductionTechnique}}

PREVIOUS SECTION:
{{$json.inductionScript}}

BLUEPRINT GUIDANCE:
{{$json.blueprintSection}}

Create a 2-3 minute deepener (approximately 300-450 words) that:
- Flows naturally from the induction
- Uses complementary deepening technique
- Takes the user deeper
- Increases receptivity
- Maintains the relaxed state
- Prepares for suggestions

Use repetition and rhythm. Layer suggestions. Create momentum.

Format as JSON:
{
  "section": "deepener",
  "day": {{$json.currentDay}},
  "script": "full script text",
  "technique": "technique used",
  "estimatedDuration": 2.5,
  "keyElements": ["element1", "element2", ...],
  "transitionNote": "how to transition to suggestions"
}
```

**Action After**: Store result in MongoDB collection `sections`

---

### Sub-Agent: Suggestions (Main Content)

**Node Type**: OpenAI (GPT-4)  
**Model**: gpt-4-turbo-preview  
**Temperature**: 0.75

**System Prompt**:
```
You are a specialist in hypnotic suggestions. This is the core of the hypnosis session where you deliver the therapeutic content aligned with the user's goal.

Your suggestions should:
1. Be positive and present-tense ("I am" not "I will")
2. Be specific and vivid
3. Engage multiple senses
4. Use embedded commands
5. Include metaphors and stories
6. Build belief and expectation
7. Create emotional resonance
8. Be personalized to the user

Techniques to use:
- Direct suggestions
- Indirect suggestions (metaphors, stories)
- Post-hypnotic suggestions
- Compounding suggestions
- Presuppositions
- Embedded commands
- Visualization
- Anchoring

Duration: Varies based on total session length (usually 5-10 minutes)
```

**User Prompt**:
```
Create the Suggestions section for Day {{$json.currentDay}}:

DAY FOCUS: {{$json.dayFocus}}
DAY GOAL: {{$json.dayGoal}}
USER'S GOAL: {{$json.goal}}
USER'S INTENTION: {{$json.intention}}
AVAILABLE TIME: {{$json.suggestionsTime}} minutes

PERSONALIZATION:
{{$json.personalization}}

PREVIOUS SECTION:
{{$json.deepenerScript}}

BLUEPRINT GUIDANCE:
{{$json.blueprintSection}}

KEYWORDS TO USE:
{{$json.keywords}}

TECHNIQUES TO EMPLOY:
{{$json.techniques}}

Create a {{$json.suggestionsTime}}-minute suggestions section that:
- Delivers the core therapeutic content
- Addresses the specific goal and focus for this day
- Uses the specified keywords and techniques
- Is deeply personalized
- Creates vivid sensory experiences
- Builds belief and motivation
- Includes embedded commands and presuppositions
- Tells relevant metaphors or stories

Make it powerful, specific, and transformative.

Format as JSON:
{
  "section": "suggestions",
  "day": {{$json.currentDay}},
  "script": "full script text",
  "techniques": ["technique1", "technique2", ...],
  "estimatedDuration": {{$json.suggestionsTime}},
  "keyElements": ["element1", "element2", ...],
  "metaphorsUsed": ["metaphor1", "metaphor2"],
  "transitionNote": "how to transition to future pacing"
}
```

**Action After**: Store result in MongoDB collection `sections`

---

### Sub-Agent: Future Pacing

**Node Type**: Anthropic (Claude)  
**Model**: claude-3-sonnet  
**Temperature**: 0.75

**System Prompt**:
```
You are a specialist in future pacing. Your role is to help the listener mentally rehearse and experience their desired future, making the changes feel real and inevitable.

Future pacing should:
1. Project the user into their desired future
2. Make them experience success vividly
3. Create emotional connection to the outcome
4. Build confidence and expectation
5. Install post-hypnotic triggers
6. Prepare for awakening

Use:
- Vivid visualization
- Sensory-rich language
- Emotional amplification
- Time projection
- Success rehearsal
- Anchoring

Duration: 2-3 minutes
```

**User Prompt**:
```
Create the Future Pacing section for Day {{$json.currentDay}}:

DAY FOCUS: {{$json.dayFocus}}
DAY GOAL: {{$json.dayGoal}}
USER'S GOAL: {{$json.goal}}
USER'S INTENTION: {{$json.intention}}

SUGGESTIONS DELIVERED:
{{$json.suggestionsScript}}

BLUEPRINT GUIDANCE:
{{$json.blueprintSection}}

Create a 2-3 minute future pacing section (approximately 300-450 words) that:
- Projects the user into their successful future
- Makes them experience the desired outcome
- Engages all senses
- Creates emotional resonance
- Builds confidence
- Installs post-hypnotic triggers
- Prepares for awakening

Make it vivid, emotional, and inspiring.

Format as JSON:
{
  "section": "future_pacing",
  "day": {{$json.currentDay}},
  "script": "full script text",
  "estimatedDuration": 2.5,
  "keyElements": ["element1", "element2", ...],
  "triggers": ["trigger1", "trigger2"],
  "transitionNote": "how to transition to awakening"
}
```

**Action After**: Store result in MongoDB collection `sections`

---

### Sub-Agent: Awakening

**Node Type**: OpenAI (GPT-4)  
**Model**: gpt-4-turbo-preview  
**Temperature**: 0.6

**System Prompt**:
```
You are a specialist in hypnotic awakenings. Your role is to bring the listener back to full waking consciousness in a way that:

1. Is gentle and comfortable
2. Maintains the positive effects
3. Leaves them feeling refreshed
4. Reinforces the suggestions
5. Creates positive anticipation
6. Ensures full alertness (if appropriate for time of day)

Awakening techniques:
- Counting up (1 to 5, 1 to 10)
- Gradual reorientation
- Energy building (for morning)
- Peaceful transition (for evening)
- Post-hypnotic suggestion reinforcement

Duration: 1-2 minutes

IMPORTANT: Adapt awakening to time of day:
- Morning: Energizing, alert, ready for the day
- Evening: Peaceful, ready for sleep or relaxation
```

**User Prompt**:
```
Create the Awakening section for Day {{$json.currentDay}}:

DAY FOCUS: {{$json.dayFocus}}
TIME OF DAY: {{$json.timeOfDay}}
USER'S GOAL: {{$json.goal}}

PREVIOUS SECTION:
{{$json.futurePacingScript}}

BLUEPRINT GUIDANCE:
{{$json.blueprintSection}}

Create a 1-2 minute awakening (approximately 150-300 words) that:
- Brings the user back to full awareness
- Is appropriate for {{$json.timeOfDay}}
- Reinforces the key suggestions
- Leaves them feeling positive
- Ensures they're fully alert (or ready for sleep)
- Creates anticipation for tomorrow

Make it smooth, positive, and appropriate for the time of day.

Format as JSON:
{
  "section": "awakening",
  "day": {{$json.currentDay}},
  "script": "full script text",
  "technique": "technique used",
  "estimatedDuration": 1.5,
  "keyElements": ["element1", "element2", ...],
  "finalMessage": "closing message"
}
```

**Action After**: Store result in MongoDB collection `sections`

---

### 10b. Evaluator Agent

**Node Type**: Anthropic (Claude)  
**Model**: claude-3-opus  
**Temperature**: 0.3

**System Prompt**:
```
You are an expert evaluator of hypnosis scripts. Your role is to assess the quality of the complete day's script across multiple criteria and provide a rating from 1-10.

Evaluation criteria:
1. Structure (flow, transitions, timing) - 0-10
2. Language (clarity, hypnotic patterns, effectiveness) - 0-10
3. Hypnotic Elements (techniques, depth, appropriateness) - 0-10
4. Personalization (specific to user, relevant, engaging) - 0-10
5. Flow (smooth, coherent, builds momentum) - 0-10

Overall score: Average of criteria scores

If score < 8: Provide specific, actionable feedback for improvement
If score ≥ 8: Approve and provide positive feedback

Be rigorous but fair. Focus on effectiveness, not perfection.
```

**User Prompt**:
```
Evaluate the complete script for Day {{$json.currentDay}}:

USER'S GOAL: {{$json.goal}}
DAY FOCUS: {{$json.dayFocus}}
TARGET DURATION: {{$json.duration}} minutes

COMPLETE SCRIPT:
Intention & Calibration: {{$json.intentionCalibration}}
Induction: {{$json.induction}}
Deepener: {{$json.deepener}}
Suggestions: {{$json.suggestions}}
Future Pacing: {{$json.futurePacing}}
Awakening: {{$json.awakening}}

TOTAL ESTIMATED DURATION: {{$json.totalDuration}} minutes

Evaluate and provide:
1. Score for each criterion (0-10)
2. Overall score (average)
3. Strengths
4. Weaknesses
5. Specific suggestions for improvement (if score < 8)
6. Approval status

Format as JSON:
{
  "day": {{$json.currentDay}},
  "scores": {
    "structure": 9,
    "language": 8,
    "hypnoticElements": 9,
    "personalization": 8,
    "flow": 9
  },
  "overallScore": 8.6,
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "approved": true,
  "feedback": "overall feedback"
}
```

---

### Evaluation Branch

**Node Type**: IF Condition

**Condition**: `{{$json.overallScore}} >= 8`

**If TRUE**: Continue to Audio Generation  
**If FALSE**: Loop back to Draft Creator with feedback

**Feedback Loop**:
- Pass evaluation feedback to Draft Creator
- Increment version number
- Regenerate sections that need improvement
- Re-evaluate

**Max Iterations**: 3 (after 3 attempts, proceed anyway with warning)

---

### 10c. Audio Generation

#### Step 1: Retrieve Sections from MongoDB

**Node Type**: MongoDB  
**Operation**: Find  
**Collection**: `sections`  
**Query**: `{ draftId: "{{$json.draftId}}" }`

---

#### Step 2: Generate Audio for Each Section

**Node Type**: Loop Over Items (sections)

**For each section**:

##### ElevenLabs TTS

**Node Type**: HTTP Request  
**Method**: POST  
**URL**: `https://api.elevenlabs.io/v1/text-to-speech/{{$env.ELEVENLABS_VOICE_ID}}`

**Headers**:
```json
{
  "xi-api-key": "{{$env.ELEVENLABS_API_KEY}}",
  "Content-Type": "application/json"
}
```

**Body**:
```json
{
  "text": "{{$json.script}}",
  "model_id": "eleven_monolingual_v1",
  "voice_settings": {
    "stability": 0.75,
    "similarity_boost": 0.75,
    "style": 0.5,
    "use_speaker_boost": true
  }
}
```

**Response**: Audio file (MP3)

**Action**: Save to temporary storage, update MongoDB with audio URL

---

#### Step 3: Generate Background Sound

**Node Type**: Code (JavaScript) or HTTP Request to sound generation API

**Options**:
1. Use pre-made background tracks (ambient, nature sounds, binaural beats)
2. Generate custom soundscape using AI (e.g., Mubert API)

**For MVP**: Use pre-made tracks matched to session type

---

#### Step 4: Merge Audio + Background

**Node Type**: Code (JavaScript with ffmpeg)

**Code**:
```javascript
const voiceAudio = $json.voiceAudioPath;
const backgroundAudio = $json.backgroundAudioPath;
const outputPath = `/tmp/day${$json.currentDay}_complete.mp3`;

// Merge with background at lower volume
await $exec(`ffmpeg -i ${voiceAudio} -i ${backgroundAudio} -filter_complex "[1:a]volume=0.2[bg];[0:a][bg]amix=inputs=2:duration=first" ${outputPath}`);

return {
  day: $json.currentDay,
  audioPath: outputPath,
  duration: $json.totalDuration
};
```

---

#### Step 5: Upload to Google Drive

**Node Type**: Google Drive  
**Operation**: Upload File  
**Folder**: Configured folder ID  
**File**: Complete audio file  
**Permissions**: Anyone with link can view

**Response**: File ID and shareable link

---

#### Step 6: Update MongoDB

**Node Type**: MongoDB  
**Operation**: Update  
**Collection**: `sections`

**Update**:
```json
{
  "$set": {
    "audioUrl": "{{$json.driveLink}}",
    "audioFileId": "{{$json.fileId}}",
    "durationSeconds": "{{$json.duration}}",
    "audioGenerated": true,
    "audioGeneratedAt": "{{$now}}"
  }
}
```

---

### End of Day Loop

After all 7 days are complete, continue to final steps.

---

## 💾 11. Store Complete Journey in MongoDB

**Node Type**: MongoDB  
**Operation**: Update  
**Collection**: `journeys`

**Update**:
```json
{
  "$set": {
    "status": "completed",
    "completedAt": "{{$now}}",
    "days": [
      {
        "day": 1,
        "title": "{{$json.day1Title}}",
        "description": "{{$json.day1Description}}",
        "audioUrl": "{{$json.day1AudioUrl}}",
        "duration": "{{$json.day1Duration}}",
        "scriptId": "{{$json.day1ScriptId}}"
      },
      // ... days 2-7
    ],
    "metadata": {
      "totalDuration": "{{$json.totalDuration}}",
      "averageScore": "{{$json.averageEvaluationScore}}",
      "techniques": "{{$json.allTechniques}}",
      "keywords": "{{$json.allKeywords}}"
    }
  }
}
```

---

## 🔍 12. Update Pinecone (Store Creation)

**Node Type**: HTTP Request (Pinecone Upsert)  
**Method**: POST  
**URL**: Pinecone upsert endpoint

**Body**:
```json
{
  "vectors": [
    {
      "id": "{{$json.journeyId}}",
      "values": "{{$json.journeyEmbedding}}",
      "metadata": {
        "journey_id": "{{$json.journeyId}}",
        "user_id": "{{$json.userId}}",
        "goal": "{{$json.goal}}",
        "intention": "{{$json.intention}}",
        "interest": "{{$json.interest}}",
        "rating": "{{$json.averageScore}}",
        "duration": "{{$json.duration}}",
        "created_date": "{{$now}}",
        "techniques": "{{$json.techniques}}",
        "keywords": "{{$json.keywords}}"
      }
    }
  ],
  "namespace": "{{$json.interest}}"
}
```

---

## 🔔 13. Send Webhook to Backend

**Node Type**: HTTP Request  
**Method**: POST  
**URL**: `{{$env.BACKEND_URL}}/api/webhooks/n8n/journey-complete`

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{$env.N8N_API_KEY}}"
}
```

**Body**:
```json
{
  "journeyId": "{{$json.journeyId}}",
  "userId": "{{$json.userId}}",
  "status": "completed",
  "days": [
    {
      "dayNumber": 1,
      "title": "{{$json.day1Title}}",
      "description": "{{$json.day1Description}}",
      "scriptText": "{{$json.day1FullScript}}",
      "audioUrl": "{{$json.day1AudioUrl}}",
      "durationSeconds": "{{$json.day1Duration}}"
    },
    // ... days 2-7
  ],
  "metadata": {
    "interest": "{{$json.interest}}",
    "goal": "{{$json.goal}}",
    "intention": "{{$json.intention}}",
    "duration": "{{$json.duration}}",
    "evaluationScore": "{{$json.averageScore}}",
    "hypnoticElements": "{{$json.techniques}}",
    "keywords": "{{$json.keywords}}"
  }
}
```

---

## 📧 14. Send Email to User

**Node Type**: Gmail  
**Operation**: Send Email

**To**: `{{$json.userEmail}}`  
**Subject**: "Your 7-Day Hypnosis Journey is Ready! 🎉"  
**Body**: (HTML template)

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .button { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .day-card { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Your Journey is Ready!</h1>
      <p>Your personalized 7-day hypnosis journey has been created</p>
    </div>
    
    <div class="content">
      <p>Hi {{$json.userName}},</p>
      
      <p>Great news! Your personalized 7-day hypnosis journey for <strong>{{$json.goal}}</strong> is now ready and waiting for you.</p>
      
      <p>We've created a unique experience tailored specifically to your goals, preferences, and personal situation.</p>
      
      <h3>Your Journey Overview:</h3>
      
      <div class="day-card">
        <strong>Day 1:</strong> {{$json.day1Title}}<br>
        <small>{{$json.day1Description}}</small>
      </div>
      
      <!-- Days 2-7 similar cards -->
      
      <p style="text-align: center;">
        <a href="{{$env.FRONTEND_URL}}/dashboard/journey/{{$json.journeyId}}" class="button">
          Start Your Journey
        </a>
      </p>
      
      <h3>Tips for Success:</h3>
      <ul>
        <li>Listen at the same time each day for best results</li>
        <li>Find a quiet, comfortable space</li>
        <li>Use headphones for the best experience</li>
        <li>Keep a journal to track your progress</li>
        <li>Be patient with yourself - change takes time</li>
      </ul>
      
      <p>We're excited to be part of your transformation journey!</p>
      
      <p>Happy listening! 🎧</p>
    </div>
    
    <div class="footer">
      <p>The Hypnosis Generator Team</p>
      <p><a href="{{$env.FRONTEND_URL}}">Visit Dashboard</a> | <a href="{{$env.FRONTEND_URL}}/settings">Settings</a></p>
    </div>
  </div>
</body>
</html>
```

---

## 🚨 Error Handling

### Error Catch Node

**Node Type**: Error Trigger  
**Connected to**: All nodes

**On Error**:
1. Log error to MongoDB
2. Update journey status to "error"
3. Send webhook to backend with error details
4. Send notification email to admin
5. Optionally: Send apology email to user with support contact

---

## 📊 Workflow Monitoring

### Logging Nodes

Insert logging nodes at key points:
- After each major agent
- Before and after loops
- Before external API calls
- After evaluations

**Log to**: MongoDB collection `workflow_logs`

**Log Data**:
```json
{
  "journeyId": "{{$json.journeyId}}",
  "timestamp": "{{$now}}",
  "node": "{{$node.name}}",
  "status": "success",
  "duration": "{{$json.executionTime}}",
  "data": "{{$json}}"
}
```

---

## ⚙️ Environment Variables for n8n

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
COHERE_API_KEY=your-cohere-key

# ElevenLabs
ELEVENLABS_API_KEY=your-elevenlabs-key
ELEVENLABS_VOICE_ID=your-voice-id

# Google APIs
GOOGLE_API_KEY=your-google-api-key
GOOGLE_CREDENTIALS_JSON=your-service-account-json
GOOGLE_DRIVE_FOLDER_ID=your-folder-id

# Gmail
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Databases
MONGODB_SCRIPTS_URI=your-mongodb-uri
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=your-pinecone-environment
```

---

## 🎯 Success Criteria

- [ ] Workflow completes in 5-10 minutes
- [ ] All 7 days generated successfully
- [ ] Audio files created and uploaded
- [ ] Evaluation scores average > 8
- [ ] Backend webhook received
- [ ] Email sent to user
- [ ] No errors in execution
- [ ] All data stored correctly

---

**Document Version**: 1.0  
**Last Updated**: November 8, 2025  
**Owner**: Max Mayes

