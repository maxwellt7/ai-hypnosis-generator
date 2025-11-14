# Pinecone Setup for n8n Workflow

## Error You're Seeing

```
Request failed to reach Pinecone while calling 
https://controller.us-east-1.pinecone.io/actions/whoami
```

This means n8n can't authenticate with Pinecone. Here's how to fix it:

---

## Step-by-Step Fix

### 1. Get Your Pinecone Credentials (5 min)

1. Go to https://app.pinecone.io
2. Log in to your account
3. Click on "API Keys" in the left sidebar
4. You'll see:
   - **API Key**: Looks like `pcsk_...` or similar
   - **Environment**: Something like `us-east-1-aws`, `gcp-starter`, etc.

**Note these down - you'll need them!**

---

### 2. Configure Pinecone Credentials in n8n (3 min)

#### Option A: Using n8n Cloud or Recent Version

1. In n8n, go to **Settings** → **Credentials**
2. Click **"+ Add Credential"**
3. Search for **"Pinecone"** or **"Pinecone API"**
4. Enter:
   - **Name**: `AI Agents` (or match what's in the workflow)
   - **API Key**: Your Pinecone API key (`pcsk_...`)
   - **Environment**: Your Pinecone environment (e.g., `us-east-1-aws`)
5. Click **"Save"**
6. Click **"Test"** to verify connection

#### Option B: Manual Configuration (if Pinecone credential type not available)

If you don't see Pinecone as an option:

1. Use **"Header Auth"** credential instead
2. Configure:
   - **Name**: `Pinecone API`
   - **Header Name**: `Api-Key`
   - **Value**: Your Pinecone API key

---

### 3. Create Required Pinecone Indices (10 min)

Your workflow needs 4 indices. Let's create them:

#### Using Pinecone Console (Easiest)

1. Go to https://app.pinecone.io
2. Click **"Indexes"** in left sidebar
3. Click **"Create Index"**

Create these 4 indices (one at a time):

**Index 1: user-information**
```
Name: user-information
Dimensions: 1536 (for OpenAI embeddings)
Metric: cosine
Pod Type: Starter (or your preferred tier)
```

**Index 2: core-hypnosis-knowledge**
```
Name: core-hypnosis-knowledge
Dimensions: 1536
Metric: cosine
Pod Type: Starter
```

**Index 3: past-creations**
```
Name: past-creations
Dimensions: 1536
Metric: cosine
Pod Type: Starter
```

**Index 4: interest-trends**
```
Name: interest-trends
Dimensions: 1536
Metric: cosine
Pod Type: Starter
```

#### Using Pinecone CLI (Alternative)

```bash
# Install Pinecone CLI
pip install pinecone-client

# Create indices
pinecone create-index user-information --dimension 1536 --metric cosine
pinecone create-index core-hypnosis-knowledge --dimension 1536 --metric cosine
pinecone create-index past-creations --dimension 1536 --metric cosine
pinecone create-index interest-trends --dimension 1536 --metric cosine
```

---

### 4. Update n8n Workflow Nodes (5 min)

Now update each Pinecone node in the workflow:

#### For "Search Pinecone - User Info" node:
1. Click on the node
2. Under **Credentials**, select `AI Agents` (the one you just created)
3. Under **Index**, select or type: `user-information`
4. Mode: `retrieve` or `load`
5. Top K: `5`
6. Save

#### For "Search Pinecone - Core Knowledge" node:
- Credentials: `AI Agents`
- Index: `core-hypnosis-knowledge`
- Top K: `10`

#### For "Search Pinecone - Past Creations" node:
- Credentials: `AI Agents`
- Index: `past-creations`
- Top K: `5`

#### For "Search Pinecone - Trends" node:
- Credentials: `AI Agents`
- Index: `interest-trends`
- Top K: `5`

#### For "Update Pinecone - Store Creation" node:
- Credentials: `AI Agents`
- Index: `past-creations`
- Mode: `insert`

---

### 5. Verify Configuration (2 min)

Test each Pinecone node:

1. Click on any Pinecone node
2. Click **"Test step"** or **"Execute Node"**
3. You should see a success message (even if no results found yet)
4. If you still get errors, check below

---

## Troubleshooting

### Error: "Invalid API key"
**Solution**: 
- Double-check you copied the API key correctly
- Make sure there are no extra spaces
- Regenerate API key in Pinecone console if needed

### Error: "Environment not found"
**Solution**:
- Verify your environment name in Pinecone console
- Common environments:
  - `us-east-1-aws`
  - `us-west-2-aws`
  - `gcp-starter`
  - `asia-southeast1-gcp`
- Must match exactly (case-sensitive)

### Error: "Index not found"
**Solution**:
- Check index names are spelled exactly as created
- Names are case-sensitive
- Go to Pinecone console to verify index names

### Error: "Dimension mismatch"
**Solution**:
- All indices must be created with 1536 dimensions
- This matches OpenAI's text-embedding-ada-002 model
- If wrong, delete and recreate index

### Still not working?
**Check**:
1. Is Pinecone service up? Visit: https://status.pinecone.io/
2. Is your API key active? Check in Pinecone console
3. Network issues? Try from different network
4. Firewall blocking? Check if `*.pinecone.io` is accessible

---

## For MVP: Skip Pinecone Initially

If you want to test the workflow without Pinecone:

1. **Disable Pinecone search nodes** (set them to "disabled" in n8n)
2. **Add a "Set" node** after "Store Initial Data"
3. **Add mock data**:
```javascript
{
  "userInfoResults": "Mock user info",
  "coreKnowledgeResults": "Mock knowledge",
  "pastCreationsResults": "Mock past creations",
  "trendsResults": "Mock trends"
}
```
4. Continue with rest of workflow
5. Add Pinecone back later once configured

---

## Environment Variable Alternative

If you prefer environment variables over credentials:

Add to n8n environment:
```bash
PINECONE_API_KEY=your-api-key-here
PINECONE_ENVIRONMENT=us-east-1-aws
```

Then in workflow nodes, reference:
```
{{ $env.PINECONE_API_KEY }}
{{ $env.PINECONE_ENVIRONMENT }}
```

---

## Free Tier Limitations

Pinecone free tier includes:
- ✅ 1 project
- ✅ 1 pod per project
- ✅ 100K vectors per index
- ✅ 5 GB storage
- ✅ Unlimited queries

**For multiple indices on free tier:**
You can create multiple indexes in a single project, but they share resources.

---

## Quick Verification Commands

Test Pinecone from command line:

```bash
# Test API connection
curl -X GET "https://controller.us-east-1-aws.pinecone.io/actions/whoami" \
  -H "Api-Key: YOUR_API_KEY"

# List indices
curl -X GET "https://controller.us-east-1-aws.pinecone.io/databases" \
  -H "Api-Key: YOUR_API_KEY"

# Check specific index stats
curl -X GET "https://user-information-xxxxx.svc.us-east-1-aws.pinecone.io/describe_index_stats" \
  -H "Api-Key: YOUR_API_KEY"
```

Replace `us-east-1-aws` with your actual environment.

---

## Success Checklist

You're ready when:
- [ ] Pinecone API key obtained
- [ ] Environment name confirmed
- [ ] Credentials created in n8n
- [ ] All 4 indices created in Pinecone
- [ ] All Pinecone nodes configured with correct credentials
- [ ] All Pinecone nodes have correct index names
- [ ] Test connection succeeds

---

## Next Steps After Fixing

Once Pinecone is configured:
1. Continue with remaining fixes in QUICK_FIX_GUIDE.md
2. Test the workflow end-to-end
3. Seed indices with initial data (optional)
4. Monitor usage in Pinecone dashboard

---

**Need Help?**
- Pinecone Docs: https://docs.pinecone.io
- Pinecone Support: support@pinecone.io
- n8n Pinecone Integration: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.vectorstorepinecone/

**Estimated Time to Fix**: 10-15 minutes

Good luck! 🚀

