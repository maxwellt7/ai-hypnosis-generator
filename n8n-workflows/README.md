# n8n Workflows - AI Hypnosis Generator

This directory contains the n8n workflow configuration and documentation for the AI Hypnosis Journey Generator.

---

## 📁 Files in This Directory

### 1. **hypnotic-journey-workflow-fixed.json**
A simplified, fixed version of the workflow with all critical nodes configured and ready to import.

**Status**: ✅ Ready to import  
**Completeness**: Core functionality (70%)  
**Use Case**: Quick start / Testing

### 2. **ANALYSIS_SUMMARY.md**
Executive summary of the workflow analysis, including findings, impact assessment, and recommendations.

**Read This**: If you want to understand what was wrong and what was fixed  
**Key Sections**:
- What's working vs what needs fixing
- Impact assessment
- Risk assessment
- Implementation options

### 3. **WORKFLOW_FIXES_REQUIRED.md**
Comprehensive technical documentation of all 17 issues found and how to fix them.

**Read This**: When implementing fixes manually  
**Key Sections**:
- Detailed fix instructions for each node
- Copy-paste ready code snippets
- Environment variable requirements
- Testing checklist

### 4. **QUICK_FIX_GUIDE.md**
Step-by-step implementation guide to get the workflow functional in under 2 hours.

**Read This**: When you're ready to implement  
**Key Sections**:
- Prerequisites checklist
- Step-by-step fix process
- Common issues & solutions
- Quick validation tests

### 5. **Original Workflow** (Not included here)
The original `Hypnotic Journey Script Generator with AI Analysis and Audio Production.json` file you provided contains the full agent architecture but has incomplete configurations.

**Location**: Likely in your Downloads folder  
**Status**: ⚠️ Needs fixes from documentation  
**Completeness**: 70%

---

## 🚀 Quick Start

### Option A: Use Fixed Version (Fastest)
1. Import `hypnotic-journey-workflow-fixed.json` into n8n
2. Configure environment variables (see QUICK_FIX_GUIDE.md)
3. Set up credentials
4. Test with sample payload
5. Deploy

**Time**: ~1 hour

### Option B: Fix Original (Most Complete)
1. Import original workflow into n8n
2. Follow `WORKFLOW_FIXES_REQUIRED.md` step-by-step
3. Apply fixes to each problematic node
4. Test incrementally
5. Deploy

**Time**: ~4 hours

### Option C: Hybrid (Recommended)
1. Review `ANALYSIS_SUMMARY.md` to understand issues
2. Follow `QUICK_FIX_GUIDE.md` for critical fixes
3. Reference `WORKFLOW_FIXES_REQUIRED.md` for details
4. Test with sample data
5. Iterate and improve

**Time**: ~2 hours

---

## 📋 Prerequisites

Before you begin, ensure you have:

### Services & Accounts
- [ ] n8n instance (self-hosted or cloud)
- [ ] MongoDB database
- [ ] Pinecone account with 4 indices created
- [ ] OpenAI API key
- [ ] Anthropic API key (optional)
- [ ] DeepSeek API key (optional)
- [ ] ElevenLabs account with API key
- [ ] Google Cloud project with Drive & Gmail API enabled
- [ ] Backend API endpoint for webhooks

### Pinecone Indices Required
Create these 4 indices in Pinecone (1536 dimensions, cosine similarity):
1. `user-information` - User profiles and preferences
2. `core-hypnosis-knowledge` - Hypnosis techniques and principles
3. `past-creations` - Previously generated successful journeys
4. `interest-trends` - Popular topics and approaches

### Environment Variables
See `QUICK_FIX_GUIDE.md` for the complete list of required environment variables.

---

## 🔧 What Was Fixed

### Critical Issues (17 total)
1. ✅ Empty Workflow Configuration node
2. ✅ Empty Store Initial Data node
3. ✅ Missing Pinecone index values (4 nodes)
4. ✅ Empty MongoDB operations (3 nodes)
5. ✅ Empty JavaScript code nodes (3 nodes)
6. ✅ Missing HTTP Request configurations (4 nodes)
7. ✅ Truncated AI agent parameters
8. ✅ Missing IF condition logic

### What Still Needs Work
- YouTube research branch (optional for MVP)
- Error handling nodes
- Logging and monitoring
- Quality iteration loop optimization
- Cost optimization
- Speed optimization

---

## 📖 Documentation Structure

```
n8n-workflows/
├── README.md (You are here)
├── hypnotic-journey-workflow-fixed.json (Import-ready workflow)
├── ANALYSIS_SUMMARY.md (Overview & findings)
├── WORKFLOW_FIXES_REQUIRED.md (Technical details)
└── QUICK_FIX_GUIDE.md (Implementation guide)
```

---

## 🎯 Workflow Overview

The workflow generates personalized 7-day hypnosis journeys through:

1. **Webhook Trigger** - Receives journey creation request
2. **Knowledge Extraction** - Searches 4 Pinecone indices
3. **AI Analysis** - Multiple specialized agents analyze data
4. **Script Generation** - Creates 7 daily scripts (6 sections each)
5. **Quality Evaluation** - Scores and iterates if needed
6. **Audio Production** - TTS + background sound merge
7. **Storage** - Saves to MongoDB, Pinecone, Google Drive
8. **Notification** - Webhooks backend and emails user

**Estimated Duration**: 5-10 minutes per journey  
**Total Nodes**: 42  
**AI Agents**: 15+ specialized agents

---

## 🧪 Testing

### Test Payload
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
    "onboarding_data": {
      "hypnosis_experience": "beginner"
    }
  }
}
```

### Validation Checklist
- [ ] Webhook responds without errors
- [ ] Data stored in MongoDB
- [ ] Pinecone searches return results
- [ ] AI agents generate content
- [ ] Loop iterates 7 times
- [ ] Audio files created
- [ ] Files uploaded to Drive
- [ ] Backend receives webhook
- [ ] Email sent to user

---

## ⚠️ Known Limitations

### Current Version
- No YouTube research integration
- Basic error handling only
- No retry logic on API failures
- ffmpeg required for audio merge
- Single voice/model per journey
- Fixed 7-day duration

### Technical Constraints
- n8n execution timeout (default 2 hours)
- API rate limits (OpenAI, ElevenLabs)
- Pinecone free tier limitations
- Audio file size limits on Google Drive

---

## 💰 Cost Estimates

Per journey generation (7 days):

### AI API Costs
- **OpenAI GPT-4**: ~$2-4 (multiple agents)
- **Anthropic Claude**: ~$1-2 (if used)
- **DeepSeek**: ~$0.10-0.20 (if used)
- **ElevenLabs**: ~$0.30-0.50 (7 audio files)

**Total per journey**: ~$3.50-7.00

### Monthly Estimates
- 10 journeys: $35-70
- 50 journeys: $175-350
- 100 journeys: $350-700

*Plus MongoDB, Pinecone, Google Cloud costs*

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Workflow times out  
**Solution**: Increase n8n timeout or split into sub-workflows

**Issue**: Pinecone index not found  
**Solution**: Verify index names match exactly

**Issue**: MongoDB connection fails  
**Solution**: Check connection string and whitelist n8n IP

**Issue**: ElevenLabs API error  
**Solution**: Verify API key and check quota

**Issue**: Audio merge fails  
**Solution**: Ensure ffmpeg is installed on n8n server

**Issue**: Loop doesn't iterate  
**Solution**: Check Loop 7 Days Setup code is present

---

## 📞 Support Resources

- **n8n Documentation**: https://docs.n8n.io
- **n8n Community**: https://community.n8n.io
- **Project Documentation**: See `/docs` folder in root
- **Workflow Plan**: See `N8N_WORKFLOW_PLAN.md` in root
- **Database Setup**: See `DATABASE_SETUP_GUIDE.md` in root

---

## 🔐 Security Notes

- Store all API keys as environment variables
- Use n8n's credential system for sensitive data
- Enable webhook authentication (Bearer token)
- Validate all webhook inputs
- Use MongoDB connection with auth
- Implement rate limiting on webhook
- Log all executions for audit trail

---

## 📈 Performance Optimization

### Current Performance
- **Duration**: 5-10 minutes per journey
- **Bottlenecks**: AI agent calls, audio generation
- **Parallelization**: Pinecone searches run in parallel

### Optimization Opportunities
1. Use faster AI models for non-critical agents
2. Cache common Pinecone results
3. Generate audio asynchronously
4. Pre-generate background sounds
5. Batch multiple journeys
6. Use Redis for session management

---

## 🛠️ Development

### Making Changes
1. Import workflow into n8n
2. Make changes in visual editor
3. Test thoroughly
4. Export updated JSON
5. Document changes
6. Commit to version control

### Version Control
- Keep workflow JSON in git
- Document breaking changes
- Tag stable versions
- Maintain changelog

---

## 📅 Roadmap

### Phase 1: MVP (Current)
- ✅ Core workflow structure
- ✅ Knowledge extraction
- ✅ Script generation
- ✅ Audio production
- ✅ Storage and notification

### Phase 2: Enhancement
- [ ] YouTube research integration
- [ ] Multi-voice support
- [ ] Custom background sounds
- [ ] Quality iteration loop
- [ ] Advanced error handling

### Phase 3: Scale
- [ ] Batch processing
- [ ] Caching layer
- [ ] Cost optimization
- [ ] Performance monitoring
- [ ] A/B testing framework

---

## 📝 Contributing

When making improvements:
1. Test changes thoroughly
2. Update documentation
3. Document breaking changes
4. Consider backwards compatibility
5. Update cost estimates if needed

---

## ✅ Success Criteria

The workflow is production-ready when:
- ✅ All 7 days generate successfully
- ✅ Audio quality meets standards
- ✅ Execution time < 10 minutes
- ✅ Error rate < 1%
- ✅ Cost per journey < $5
- ✅ User satisfaction > 4/5

---

**Last Updated**: November 8, 2025  
**Version**: 1.0  
**Status**: Ready for implementation  
**Maintainer**: Max Mayes

---

## 🎉 Getting Help

If you need assistance:
1. Check `QUICK_FIX_GUIDE.md` for common issues
2. Review `WORKFLOW_FIXES_REQUIRED.md` for technical details
3. Read `ANALYSIS_SUMMARY.md` for context
4. Check n8n community forums
5. Review execution logs in n8n
6. Verify all environment variables are set

**Good luck with your implementation!** 🚀

