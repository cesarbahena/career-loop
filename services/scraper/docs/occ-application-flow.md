# OCC Application Flow Analysis

This document describes the reverse-engineered API flow for applying to jobs on OCC.com.mx.

## Overview

The application process involves two main steps:
1. Fetching job skills data and opening application modal
2. Submitting application with skill level ratings

## Step 1: Get Job Skills Modal

### Request
- **Method**: POST
- **URL**: `https://www.occ.com.mx/ajax/GetDetailSkillsModal`
- **Content-Type**: `multipart/form-data`

### Key Form Data Fields
- `id`: Job tracking identifier (e.g., "745883378853043")
- `ev`: Event type ("SubscribedButtonClick")
- `dl`: Job URL (e.g., "https://www.occ.com.mx/empleo/oferta/20827852")

### Response
Returns job skills data in JSON format:
```json
[
  {
    "IdSkill": "6367209",
    "IdSkillEncrypted": "6367209", 
    "IdType": 0,
    "SkillName": "Dominio de Visual Studio y C# (.NET 6/8)",
    "SkillValid": true
  },
  {
    "IdSkill": "6367210",
    "SkillName": "Seguridad informática aplicada al desarrollo",
    "SkillValid": true
  }
]
```

## Step 2: Submit Application with Skill Ratings

### Request
- **Method**: POST  
- **URL**: `https://www.occ.com.mx/apply/loggedapply`
- **Content-Type**: `application/x-www-form-urlencoded`

### Required Form Parameters
- `jobid`: Job ID (e.g., "20827852")
- `fromSuggestion`: "false"
- `skillsanswers[N][skillid]`: Skill ID from step 1
- `skillsanswers[N][rating]`: Rating level (1-4 scale)

### Example Form Data
```
jobid=20827852
fromSuggestion=false
skillsanswers[0][skillid]=6367209
skillsanswers[0][rating]=2
skillsanswers[1][skillid]=6367210
skillsanswers[1][rating]=3
skillsanswers[2][skillid]=6367211
skillsanswers[2][rating]=3
skillsanswers[3][skillid]=6367212
skillsanswers[3][rating]=3
```

### Rating Scale
- 1: Basic knowledge
- 2: Intermediate knowledge  
- 3: Advanced knowledge
- 4: Expert level

## Required Authentication
- Must be logged in with valid session cookies
- Key cookies: `usrid`, `occidv12`, `_sc`, `csrf_token_*`

## Implementation Notes
- User must select skill levels in modal before submitting
- All job skills must be rated before application can proceed
- Job ID can be extracted from job URL (last segment)
- Session management required for authenticated requests