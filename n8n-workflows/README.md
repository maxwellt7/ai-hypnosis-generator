# n8n Workflows

## Overview

This directory contains n8n workflow configurations for the AI Hypnosis Generator.

## Main Workflow

The main workflow (`main-workflow-template.json`) orchestrates:

1. **Knowledge Base Search** - Searches Pinecone for relevant information
2. **Online Research** - YouTube search, download, and transcription
3. **AI Agent Processing** - 15+ specialized AI agents
4. **Script Generation** - Creates 7-day journey scripts
5. **Quality Evaluation** - Scores and improves scripts
6. **Audio Generation** - ElevenLabs TTS with background sounds
7. **Storage & Delivery** - Google Drive upload and email notification

## Setup

1. Deploy n8n instance (Railway or n8n Cloud)
2. Import `main-workflow-template.json`
3. Configure credentials for:
   - OpenAI
   - Anthropic
   - Cohere
   - ElevenLabs
   - MongoDB
   - Pinecone
   - Google Drive
   - Gmail
4. Update webhook URLs
5. Activate workflow

## Agent Prompts

All AI agent prompts are documented in `/docs/N8N_WORKFLOW_PLAN.md`

## Testing

Test the workflow with sample data before production use.

## Notes

- The workflow takes 5-10 minutes to complete
- Ensure all API keys have sufficient credits
- Monitor execution logs for errors
- Set up error notifications

