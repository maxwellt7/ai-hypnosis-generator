# Complete Pinecone Setup Guide

## Overview

This guide will help you set up all 4 Pinecone indices needed for the hypnosis journey generator.

**What You Need:**
- Pinecone account (free tier works fine)
- API Key: `pcsk_2R6V3W_U7BaEjBzNoPCmaBgMsmFmBH3ApA9GyqJxeMwugnCR63QeQwGpDhiorJr8msh3Qe`
- Environment: `us-east-1`

---

## Step 1: Create Pinecone Account

1. Go to https://www.pinecone.io/
2. Click "Sign Up" or "Start Free"
3. Complete registration
4. Verify your email

---

## Step 2: Access Your API Key

1. Log in to Pinecone console: https://app.pinecone.io
2. Click on "API Keys" in the left sidebar
3. You should see:
   - **API Key**: `pcsk_2R6V3W_U7BaEjBzNoPCmaBgMsmFmBH3ApA9GyqJxeMwugnCR63QeQwGpDhiorJr8msh3Qe`
   - **Environment**: `us-east-1`

**⚠️ Security Note**: After this setup, rotate your API key for security!

---

## Step 3: Create the 4 Required Indices

You need to create 4 indices. Here's how:

### Method A: Using Pinecone Console (Easiest)

#### Index 1: user-information
```
1. Click "Indexes" in left sidebar
2. Click "Create Index"
3. Fill in:
   - Name: user-information
   - Dimensions: 1536
   - Metric: cosine
   - Pod Type: Starter (or your plan)
   - Pods: 1
4. Click "Create Index"
5. Wait for status to become "Ready"
```

#### Index 2: core-hypnosis-knowledge
```
1. Click "Create Index" again
2. Fill in:
   - Name: core-hypnosis-knowledge
   - Dimensions: 1536
   - Metric: cosine
   - Pod Type: Starter
   - Pods: 1
3. Click "Create Index"
4. Wait for status to become "Ready"
```

#### Index 3: past-creations
```
1. Click "Create Index" again
2. Fill in:
   - Name: past-creations
   - Dimensions: 1536
   - Metric: cosine
   - Pod Type: Starter
   - Pods: 1
3. Click "Create Index"
4. Wait for status to become "Ready"
```

#### Index 4: interest-trends
```
1. Click "Create Index" again
2. Fill in:
   - Name: interest-trends
   - Dimensions: 1536
   - Metric: cosine
   - Pod Type: Starter
   - Pods: 1
3. Click "Create Index"
4. Wait for status to become "Ready"
```

---

### Method B: Using Pinecone CLI (Advanced)

If you prefer command line:

```bash
# Install Pinecone CLI
pip install pinecone-client

# Set your API key
export PINECONE_API_KEY="pcsk_2R6V3W_U7BaEjBzNoPCmaBgMsmFmBH3ApA9GyqJxeMwugnCR63QeQwGpDhiorJr8msh3Qe"

# Create indices
pinecone create-index user-information --dimension 1536 --metric cosine
pinecone create-index core-hypnosis-knowledge --dimension 1536 --metric cosine
pinecone create-index past-creations --dimension 1536 --metric cosine
pinecone create-index interest-trends --dimension 1536 --metric cosine

# Verify indices
pinecone list-indexes
```

---

### Method C: Using Python Script (Automated)

Save this as `setup_pinecone.py`:

```python
import pinecone
import os

# Configuration
API_KEY = "pcsk_2R6V3W_U7BaEjBzNoPCmaBgMsmFmBH3ApA9GyqJxeMwugnCR63QeQwGpDhiorJr8msh3Qe"
ENVIRONMENT = "us-east-1"

# Initialize Pinecone
pinecone.init(api_key=API_KEY, environment=ENVIRONMENT)

# Indices to create
indices = [
    "user-information",
    "core-hypnosis-knowledge", 
    "past-creations",
    "interest-trends"
]

print("Creating Pinecone indices...")

for index_name in indices:
    try:
        # Check if index already exists
        existing = pinecone.list_indexes()
        
        if index_name in existing:
            print(f"✓ Index '{index_name}' already exists")
        else:
            # Create index
            pinecone.create_index(
                name=index_name,
                dimension=1536,  # OpenAI embedding size
                metric='cosine',
                pods=1,
                pod_type='starter'
            )
            print(f"✓ Created index '{index_name}'")
    
    except Exception as e:
        print(f"✗ Error creating '{index_name}': {e}")

print("\nSetup complete!")
print("\nIndex details:")
for index_name in indices:
    try:
        index = pinecone.Index(index_name)
        stats = index.describe_index_stats()
        print(f"- {index_name}: {stats.get('total_vector_count', 0)} vectors")
    except Exception as e:
        print(f"- {index_name}: Unable to get stats ({e})")
```

Run it:
```bash
pip install pinecone-client
python setup_pinecone.py
```

---

## Step 4: Verify Indices Are Created

### Via Console:
1. Go to https://app.pinecone.io
2. Click "Indexes"
3. You should see all 4 indices with status "Ready"

### Via CLI:
```bash
pinecone list-indexes
```

Expected output:
```
user-information
core-hypnosis-knowledge
past-creations
interest-trends
```

### Via API:
```bash
curl -X GET "https://controller.us-east-1.pinecone.io/databases" \
  -H "Api-Key: pcsk_2R6V3W_U7BaEjBzNoPCmaBgMsmFmBH3ApA9GyqJxeMwugnCR63QeQwGpDhiorJr8msh3Qe"
```

---

## Step 5: Configure n8n

Now update your n8n workflow:

### Update Pinecone Nodes:

1. **Search Pinecone - User Info** (line 37 in JSON)
   ```json
   "value": "user-information"
   ```
   Also change `"disabled": true` to `"disabled": false`

2. **Search Pinecone - Core Knowledge** (line 62)
   ```json
   "value": "core-hypnosis-knowledge"
   ```
   Also change `"disabled": true` to `"disabled": false`

3. **Search Pinecone - Past Creations** (line 87)
   ```json
   "value": "past-creations"
   ```
   Also change `"disabled": true` to `"disabled": false`

4. **Search Pinecone - Trends** (line 112)
   ```json
   "value": "interest-trends"
   ```
   Also change `"disabled": true` to `"disabled": false`

5. **Update Pinecone - Store Creation** (line 623)
   ```json
   "value": "past-creations"
   ```

---

## Step 6: Test Connection in n8n

1. Open any Pinecone node in n8n
2. Click "Test Connection" or "Execute Node"
3. You should see success (even if no results yet)

---

## Step 7: Seed Initial Data (Optional)

For better results, seed some initial knowledge:

### Seed Script Example:

```python
import pinecone
from openai import OpenAI

# Initialize
pinecone.init(
    api_key="pcsk_2R6V3W_U7BaEjBzNoPCmaBgMsmFmBH3ApA9GyqJxeMwugnCR63QeQwGpDhiorJr8msh3Qe",
    environment="us-east-1"
)
openai = OpenAI(api_key="your-openai-key")

# Get index
index = pinecone.Index("core-hypnosis-knowledge")

# Sample knowledge to seed
knowledge_items = [
    "Progressive relaxation is a foundational hypnosis technique that involves systematically relaxing each muscle group",
    "Visualization uses the power of imagination to create vivid mental imagery that influences the subconscious mind",
    "Embedded commands are suggestions hidden within normal conversation that bypass conscious resistance",
    "Future pacing helps clients mentally rehearse desired outcomes to increase the likelihood of success"
]

# Generate embeddings and upsert
for i, text in enumerate(knowledge_items):
    # Generate embedding
    response = openai.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    embedding = response.data[0].embedding
    
    # Upsert to Pinecone
    index.upsert(vectors=[(
        f"knowledge-{i}",
        embedding,
        {"text": text, "type": "technique", "category": "hypnosis"}
    )])
    print(f"✓ Seeded: {text[:50]}...")

print("\nSeeding complete!")
```

---

## Troubleshooting

### Issue: "Index not found"
**Solution**: 
- Verify index names match exactly (case-sensitive)
- Check index is in "Ready" status
- Wait a few minutes after creation

### Issue: "Dimension mismatch"
**Solution**: 
- All indices must use 1536 dimensions
- This matches OpenAI's text-embedding-ada-002 model
- Delete and recreate index if wrong

### Issue: "Quota exceeded" (Free Tier)
**Solution**:
- Free tier allows 1 pod per project
- Use serverless indices instead
- Or upgrade to paid plan

### Issue: "Authentication failed"
**Solution**:
- Double-check API key is correct
- No extra spaces in API key
- Rotate key if compromised

---

## Free Tier Limitations

Pinecone free tier includes:
- ✅ 1 project
- ✅ 1 pod (can have multiple indexes sharing resources)
- ✅ 100,000 vectors per index
- ✅ 5 GB storage
- ✅ Unlimited queries

**For Multiple Indices on Free Tier:**
- Use serverless option
- Or use 1 index with namespaces
- Or upgrade to paid plan ($70/month)

---

## Alternative: Serverless Indices

If you hit free tier limits, use serverless:

```python
pinecone.create_index(
    name="user-information",
    dimension=1536,
    metric='cosine',
    spec={
        'serverless': {
            'cloud': 'aws',
            'region': 'us-east-1'
        }
    }
)
```

---

## Security Best Practices

### 1. Rotate Your API Key
After setup, rotate for security:
1. Go to Pinecone console
2. API Keys → Create New Key
3. Update all services with new key
4. Delete old key

### 2. Use Environment Variables
Never hardcode API keys:
```bash
# .env
PINECONE_API_KEY=your-new-key
PINECONE_ENVIRONMENT=us-east-1
```

### 3. Restrict API Key Permissions
- Use read-only keys for query-only operations
- Use write keys only where needed

---

## Next Steps

After Pinecone is set up:

1. ✅ Update n8n workflow with index names
2. ✅ Test Pinecone nodes in n8n
3. ✅ (Optional) Seed initial knowledge
4. ✅ Enable Pinecone nodes (set disabled: false)
5. ✅ Test full workflow

---

## Quick Reference

**API Key**: `pcsk_2R6V3W_U7BaEjBzNoPCmaBgMsmFmBH3ApA9GyqJxeMwugnCR63QeQwGpDhiorJr8msh3Qe`  
**Environment**: `us-east-1`  
**Dimensions**: `1536`  
**Metric**: `cosine`

**Index Names:**
1. `user-information`
2. `core-hypnosis-knowledge`
3. `past-creations`
4. `interest-trends`

---

## Support

- **Pinecone Docs**: https://docs.pinecone.io
- **Pinecone Support**: support@pinecone.io
- **Status Page**: https://status.pinecone.io

---

**Setup Time**: 10-15 minutes  
**Status**: Ready to use  
**Last Updated**: November 8, 2025

