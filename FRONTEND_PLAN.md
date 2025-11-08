# Frontend Project Plan - AI Hypnosis Generator

## 🎨 Technology Stack

- **Framework**: React 18+
- **Build Tool**: Vite 5+
- **Language**: JavaScript (can upgrade to TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Audio Player**: Howler.js or react-h5-audio-player
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Vercel

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── audio/
│       └── sample-meditation.mp3
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── hero-bg.jpg
│   │   │   ├── logo.svg
│   │   │   └── meditation-icons/
│   │   └── sounds/
│   │       └── notification.mp3
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui base components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── select.jsx
│   │   │   ├── textarea.jsx
│   │   │   ├── checkbox.jsx
│   │   │   ├── radio-group.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── toast.jsx
│   │   │   ├── progress.jsx
│   │   │   ├── skeleton.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── alert.jsx
│   │   │   ├── tabs.jsx
│   │   │   └── calendar.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── AuthLayout.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── onboarding/
│   │   │   ├── OnboardingWizard.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── ProgressIndicator.jsx
│   │   │   └── AIInsightBubble.jsx
│   │   │
│   │   ├── journey/
│   │   │   ├── JourneyCard.jsx
│   │   │   ├── JourneyCreationForm.jsx
│   │   │   ├── JourneyTimeline.jsx
│   │   │   ├── DayCard.jsx
│   │   │   ├── DayDetailModal.jsx
│   │   │   └── CreationLoadingScreen.jsx
│   │   │
│   │   ├── audio/
│   │   │   ├── AudioPlayer.jsx
│   │   │   ├── PlaybackControls.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── VolumeControl.jsx
│   │   │
│   │   ├── stats/
│   │   │   ├── StatsOverview.jsx
│   │   │   ├── StreakCalendar.jsx
│   │   │   ├── ListeningChart.jsx
│   │   │   ├── ImprovementsList.jsx
│   │   │   └── MilestoneCard.jsx
│   │   │
│   │   ├── journal/
│   │   │   ├── JournalEntryCard.jsx
│   │   │   ├── JournalEntryForm.jsx
│   │   │   ├── JournalList.jsx
│   │   │   ├── MoodSelector.jsx
│   │   │   └── InsightsDisplay.jsx
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── ProfileEditForm.jsx
│   │   │   ├── PreferencesForm.jsx
│   │   │   └── OnboardingResults.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── UserTable.jsx
│   │   │   ├── UserDetailModal.jsx
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── JourneyOverview.jsx
│   │   │   └── SystemHealthWidget.jsx
│   │   │
│   │   └── common/
│   │       ├── LoadingSpinner.jsx
│   │       ├── ErrorBoundary.jsx
│   │       ├── EmptyState.jsx
│   │       ├── ConfirmDialog.jsx
│   │       └── PageHeader.jsx
│   │
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Onboarding.jsx
│   │   ├── CreateJourney.jsx
│   │   ├── JourneyCreating.jsx
│   │   ├── Dashboard.jsx
│   │   ├── JourneyDetail.jsx
│   │   ├── Profile.jsx
│   │   ├── Stats.jsx
│   │   ├── Journal.jsx
│   │   ├── JournalEntry.jsx
│   │   ├── Settings.jsx
│   │   ├── Admin.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── AdminAnalytics.jsx
│   │   └── NotFound.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useProfile.js
│   │   ├── useJourneys.js
│   │   ├── useJournal.js
│   │   ├── useStats.js
│   │   ├── useAudioPlayer.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   └── useMediaQuery.js
│   │
│   ├── services/
│   │   ├── api.js              # Axios instance configuration
│   │   ├── auth.service.js
│   │   ├── profile.service.js
│   │   ├── journey.service.js
│   │   ├── journal.service.js
│   │   ├── stats.service.js
│   │   └── admin.service.js
│   │
│   ├── store/
│   │   ├── authStore.js
│   │   ├── profileStore.js
│   │   ├── journeyStore.js
│   │   ├── journalStore.js
│   │   ├── statsStore.js
│   │   └── uiStore.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── dateHelpers.js
│   │   ├── audioHelpers.js
│   │   └── errorHandler.js
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── animations.css
│   │
│   ├── lib/
│   │   └── utils.js            # shadcn/ui utility functions
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
│
├── .env.example
├── .env.local
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🎯 Page Specifications

### 1. Landing Page (`/`)

**Purpose**: Convert visitors into users

**Sections**:
- Hero section with compelling headline and CTA
- Features overview (3-4 key benefits)
- How it works (3-step process)
- Testimonials/social proof (optional for MVP)
- Pricing (if applicable)
- FAQ section
- Footer with links

**Key Components**:
- `HeroSection`
- `FeatureCard`
- `HowItWorksStep`
- `CTAButton`

**Design Notes**:
- Calming color palette (blues, purples, soft gradients)
- Smooth scroll animations
- Mobile-responsive
- Fast loading (<2s)

---

### 2. Login Page (`/login`)

**Features**:
- Email/password login
- "Remember me" checkbox
- "Forgot password?" link
- Social login (optional)
- Link to registration

**Validation**:
- Email format validation
- Required field checks
- Error message display

**Flow**:
1. User enters credentials
2. Submit → API call
3. On success → redirect to `/dashboard`
4. On error → show error message

---

### 3. Registration Page (`/register`)

**Fields**:
- Name
- Email
- Password
- Confirm password
- Terms & conditions checkbox

**Validation**:
- Email uniqueness (backend)
- Password strength (min 8 chars, 1 uppercase, 1 number)
- Password match
- Required fields

**Flow**:
1. User fills form
2. Submit → API call
3. On success → redirect to `/onboarding`
4. On error → show error message

---

### 4. Onboarding Page (`/onboarding`)

**Purpose**: Collect 20-question intake data

**Question Types**:
- Multiple choice (single select)
- Multiple choice (multi-select)
- Scale (1-10)
- Short text

**Sample Questions**:
1. What is your primary goal for using hypnosis?
   - Weight loss
   - Stress reduction
   - Confidence building
   - Sleep improvement
   - Other

2. How would you rate your current stress level? (1-10)

3. What time of day do you prefer to listen?
   - Morning (6am-10am)
   - Midday (10am-2pm)
   - Afternoon (2pm-6pm)
   - Evening (6pm-10pm)
   - Night (10pm-6am)

4. How long can you commit to daily practice?
   - 5-10 minutes
   - 10-15 minutes
   - 15-20 minutes
   - 20-30 minutes
   - 30+ minutes

5. Have you tried hypnosis before?
   - Yes, many times
   - Yes, a few times
   - Once or twice
   - Never

[... 15 more questions covering goals, preferences, background, challenges, motivations]

**Features**:
- Multi-step wizard (4-5 steps, 4-5 questions each)
- Progress bar
- Back/Next navigation
- AI-powered insights after each section
- Save progress (auto-save)
- Skip option (with warning)

**AI Integration**:
- After each section, show personalized insight
- Example: "Based on your responses, we recommend starting with morning sessions focused on confidence building."

**Flow**:
1. User answers questions
2. Progress saved after each step
3. AI generates insights
4. Complete → redirect to `/create-journey`

---

### 5. Create Journey Page (`/create-journey`)

**Fields**:
- Goal (textarea, 100-500 chars)
- Intention (textarea, 100-500 chars)
- Preferred duration (select: 5, 10, 15, 20, 30 minutes)
- Start date (date picker, default: today)

**Examples/Prompts**:
- Goal: "I want to lose 20 pounds and feel confident in my body"
- Intention: "I am creating healthy habits and loving my body"

**Features**:
- Character counter
- AI suggestions based on onboarding data
- Preview of journey structure
- Estimated completion time

**Flow**:
1. User fills form
2. Submit → API call → triggers n8n workflow
3. Redirect to `/journey/:id/creating`

---

### 6. Journey Creating Page (`/journey/:id/creating`)

**Purpose**: Loading screen while n8n generates journey

**Features**:
- Animated loading indicator
- Progress messages:
  - "Analyzing your profile..."
  - "Researching best practices..."
  - "Crafting your personalized script..."
  - "Generating audio tracks..."
  - "Finalizing your 7-day journey..."
- Estimated time remaining
- Calming background animation
- Soft background music (optional)

**Polling**:
- Poll API every 5 seconds for journey status
- On completion → redirect to `/dashboard`
- On error → show error message with retry option

**Average Time**: 5-10 minutes

---

### 7. Dashboard Page (`/dashboard`)

**Layout**: Sidebar + main content area

**Sidebar Items**:
- Dashboard (home)
- Current Journey
- Profile
- Stats
- Journal
- Settings
- Admin (if admin user)
- Logout

**Main Content**:

#### Section 1: Welcome Header
- "Welcome back, [Name]!"
- Current streak badge
- Quick stats (minutes listened today, current day)

#### Section 2: Current Journey
- Journey title
- Progress bar (X/7 days complete)
- Today's session card:
  - Day number
  - Title
  - Duration
  - Play button
  - Mark complete button
- Timeline of all 7 days (collapsed view)

#### Section 3: Quick Stats
- Current streak
- Total minutes listened
- Sessions completed
- Mini chart (last 7 days)

#### Section 4: Recent Journal Entries
- Last 2-3 entries (preview)
- "View all" link

#### Section 5: Insights & Improvements
- AI-generated insights from journal entries
- Progress indicators

**Responsive**:
- Mobile: Hamburger menu, stacked cards
- Tablet: Collapsible sidebar
- Desktop: Full sidebar + multi-column layout

---

### 8. Journey Detail Page (`/dashboard/journey/:id`)

**Content**:

#### Header
- Journey title
- Goal & intention
- Created date
- Progress (X/7 complete)

#### 7-Day Timeline
- Vertical timeline with day cards
- Each card shows:
  - Day number & title
  - Description
  - Duration
  - Status (locked, available, completed)
  - Play button (if available)
  - Checkmark (if completed)

#### Day Detail Modal (on click)
- Full description
- Audio player
- Transcript (expandable)
- Mark complete button
- Journal entry link
- Next day preview

**Features**:
- Days unlock sequentially (can't skip ahead)
- Completed days show completion date
- Download audio option
- Share journey option (future)

---

### 9. Profile Page (`/dashboard/profile`)

**Tabs**:

#### Tab 1: Basic Information
- Name (editable)
- Email (read-only)
- Phone (editable)
- Profile picture (upload)
- Save button

#### Tab 2: Preferences
- Time of day preference
- Duration preference
- Notification settings
- Save button

#### Tab 3: Onboarding Results
- Display 20-question responses
- AI-generated profile summary
- Edit button (re-take quiz)

#### Tab 4: Account
- Change password
- Delete account (with confirmation)

---

### 10. Stats Page (`/dashboard/stats`)

**Widgets**:

#### Streak Calendar
- Visual calendar showing listening days
- Current streak highlighted
- Longest streak displayed

#### Listening Time Chart
- Bar/line chart of minutes listened
- Filter: Last 7 days, 30 days, all time
- Total time displayed

#### Session Breakdown
- Pie chart: Time of day distribution
- Average session length
- Completion rate

#### Improvements
- List of AI-analyzed improvements from journal
- Mood trend chart
- Before/after comparisons

#### Milestones
- Badges/achievements
- Progress to next milestone

---

### 11. Journal Page (`/dashboard/journal`)

**Layout**:

#### Header
- "New Entry" button
- Filter/sort options (date, mood)
- Search bar

#### Entry List
- Card view of entries
- Each card shows:
  - Date
  - Mood emoji
  - Preview text (first 100 chars)
  - Associated journey/day
  - Edit/delete buttons

#### Empty State
- "No entries yet. Start journaling to track your progress!"
- "Create Entry" button

---

### 12. Journal Entry Page (`/dashboard/journal/:id` or `/new`)

**Form Fields**:
- Date (auto-filled, editable)
- Associated journey/day (select)
- Mood rating (1-10 scale with emojis)
- Entry text (rich text editor)
- Save/Cancel buttons

**Features**:
- Auto-save draft
- AI insights (after save):
  - "We noticed you're feeling more confident this week!"
  - "Your stress levels have decreased by 30%"
- Prompts:
  - "How did you feel during today's session?"
  - "What changes have you noticed?"
  - "What are you grateful for?"

---

### 13. Settings Page (`/dashboard/settings`)

**Sections**:

#### Notifications
- Email notifications (on/off)
- Daily reminder time
- Weekly progress summary

#### Audio Preferences
- Default playback speed
- Auto-play next day
- Download quality

#### Privacy
- Data sharing preferences
- Export data
- Delete account

#### Subscription (if applicable)
- Current plan
- Upgrade/downgrade
- Billing history

---

### 14. Admin Panel (`/admin`)

**Access**: Admin users only

**Dashboard**:
- Total users
- Active users (last 7 days)
- Total journeys created
- Total audio generated
- System health indicators

**Pages**:

#### Users (`/admin/users`)
- Searchable/filterable table
- Columns: Name, Email, Created, Last Login, Journeys, Status
- Actions: View, Edit, Suspend, Delete

#### User Detail Modal
- Full profile
- Journey history
- Journal entries
- Stats
- Activity log

#### Analytics (`/admin/analytics`)
- User growth chart
- Engagement metrics
- Popular goals/intentions
- Completion rates
- Audio generation stats
- Error logs

---

## 🎨 Design System

### Color Palette

```css
:root {
  /* Primary */
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;

  /* Secondary (Purple/Lavender) */
  --secondary-50: #faf5ff;
  --secondary-100: #f3e8ff;
  --secondary-500: #a855f7;
  --secondary-600: #9333ea;

  /* Neutral */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-900: #111827;

  /* Semantic */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;

  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
}
```

### Typography

```css
/* Headings */
.h1 { font-size: 3rem; font-weight: 700; line-height: 1.2; }
.h2 { font-size: 2.25rem; font-weight: 600; line-height: 1.3; }
.h3 { font-size: 1.875rem; font-weight: 600; line-height: 1.4; }
.h4 { font-size: 1.5rem; font-weight: 500; line-height: 1.5; }

/* Body */
.body-lg { font-size: 1.125rem; line-height: 1.75; }
.body { font-size: 1rem; line-height: 1.5; }
.body-sm { font-size: 0.875rem; line-height: 1.5; }

/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Spacing Scale

```javascript
const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
}
```

### Border Radius

```javascript
const borderRadius = {
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  full: '9999px',
}
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

---

## 🔧 Key Features Implementation

### 1. Authentication Flow

```javascript
// hooks/useAuth.js
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';

export const useAuth = () => {
  const { user, setUser, setToken, clearAuth } = useAuthStore();

  const login = async (credentials) => {
    const { user, token } = await authService.login(credentials);
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    clearAuth();
    localStorage.removeItem('token');
  };

  const register = async (userData) => {
    const { user, token } = await authService.register(userData);
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
  };

  return { user, login, logout, register };
};
```

### 2. Protected Routes

```javascript
// components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
```

### 3. Audio Player

```javascript
// components/audio/AudioPlayer.jsx
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export const AudioPlayer = ({ audioUrl, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onComplete?.();
  };

  const skip = (seconds) => {
    audioRef.current.currentTime += seconds;
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className="controls">
        <button onClick={() => skip(-10)}>
          <SkipBack />
        </button>
        <button onClick={togglePlay}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <button onClick={() => skip(10)}>
          <SkipForward />
        </button>
      </div>

      <div className="progress">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => {
            audioRef.current.currentTime = e.target.value;
          }}
        />
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};
```

### 4. Onboarding Wizard

```javascript
// components/onboarding/OnboardingWizard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionCard } from './QuestionCard';
import { ProgressIndicator } from './ProgressIndicator';
import { AIInsightBubble } from './AIInsightBubble';
import { questions } from '@/utils/onboardingQuestions';
import { profileService } from '@/services/profile.service';

export const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [aiInsight, setAIInsight] = useState(null);
  const navigate = useNavigate();

  const questionsPerStep = 4;
  const totalSteps = Math.ceil(questions.length / questionsPerStep);
  const currentQuestions = questions.slice(
    currentStep * questionsPerStep,
    (currentStep + 1) * questionsPerStep
  );

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = async () => {
    // Generate AI insight for this section
    const insight = await generateInsight(answers);
    setAIInsight(insight);

    if (currentStep < totalSteps - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAIInsight(null);
      }, 3000);
    } else {
      // Complete onboarding
      await profileService.completeOnboarding(answers);
      navigate('/create-journey');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="onboarding-wizard">
      <ProgressIndicator current={currentStep + 1} total={totalSteps} />

      {aiInsight && <AIInsightBubble insight={aiInsight} />}

      <div className="questions">
        {currentQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            answer={answers[question.id]}
            onAnswer={handleAnswer}
          />
        ))}
      </div>

      <div className="navigation">
        <button onClick={handleBack} disabled={currentStep === 0}>
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!currentQuestions.every((q) => answers[q.id])}
        >
          {currentStep === totalSteps - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};
```

---

## 📦 Package.json

```json
{
  "name": "hypnosis-generator-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx",
    "format": "prettier --write \"src/**/*.{js,jsx,css,md}\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.5",
    "recharts": "^2.10.3",
    "react-h5-audio-player": "^3.9.1",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-progress": "^1.0.3",
    "sonner": "^1.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.1.1",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

---

## 🚀 Replit Build Prompt

```
Create a Vite + React frontend application for an AI hypnosis generator with the following specifications:

SETUP:
- Initialize Vite project with React template
- Install dependencies: react-router-dom, zustand, axios, react-hook-form, zod, date-fns, lucide-react, framer-motion, recharts, react-h5-audio-player, tailwindcss, and radix-ui components
- Configure Tailwind CSS with custom color palette (blues, purples, calming gradients)
- Set up path aliases (@/ for src/)

PAGES TO CREATE:
1. Landing page with hero, features, how-it-works sections
2. Login/Register pages with form validation
3. Onboarding wizard (20-question intake form with multi-step progress)
4. Journey creation form
5. Journey creation loading screen with animated progress
6. Dashboard with sidebar navigation
7. Journey detail page with 7-day timeline
8. Profile page with tabs (info, preferences, onboarding results)
9. Stats page with charts and streak calendar
10. Journal list and entry pages
11. Settings page
12. Admin panel with user table and analytics

COMPONENTS TO BUILD:
- Layout: Navbar, Sidebar, Footer, DashboardLayout
- Auth: LoginForm, RegisterForm, ProtectedRoute
- Journey: JourneyCard, DayCard, JourneyTimeline, CreationLoadingScreen
- Audio: Custom AudioPlayer with play/pause, progress bar, skip controls
- Stats: StreakCalendar, ListeningChart, StatsOverview
- Journal: JournalEntryCard, JournalEntryForm, MoodSelector
- Common: LoadingSpinner, ErrorBoundary, EmptyState, ConfirmDialog

STATE MANAGEMENT:
- Create Zustand stores for: auth, profile, journeys, journal, stats, UI
- Implement persistent auth state with localStorage

API INTEGRATION:
- Set up Axios instance with interceptors
- Create service files for each domain (auth, profile, journey, journal, stats, admin)
- Handle authentication tokens
- Implement error handling and loading states

FEATURES:
- Protected routes (redirect to login if not authenticated)
- Admin-only routes
- Auto-save functionality for forms
- Real-time journey creation status polling
- Audio playback with progress tracking
- Streak tracking and visualization
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Toast notifications for user feedback

DESIGN:
- Use Tailwind CSS with custom design system
- Implement shadcn/ui component library
- Calming color palette (blues, purples, soft gradients)
- Modern, clean UI with good UX practices
- Accessibility considerations (ARIA labels, keyboard navigation)

ROUTING:
Set up React Router with these routes:
- / (Landing)
- /login, /register
- /onboarding
- /create-journey
- /journey/:id/creating
- /dashboard (protected)
- /dashboard/journey/:id (protected)
- /dashboard/profile (protected)
- /dashboard/stats (protected)
- /dashboard/journal (protected)
- /dashboard/journal/:id (protected)
- /dashboard/settings (protected)
- /admin (protected, admin-only)
- /admin/users (protected, admin-only)
- /admin/analytics (protected, admin-only)

ENVIRONMENT VARIABLES:
- VITE_API_URL
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Make the UI beautiful, modern, and calming. Use smooth animations and transitions. Ensure all forms have proper validation and error handling. The app should feel professional and trustworthy.
```

---

## ✅ Development Checklist

### Phase 1: Setup (Day 1)
- [ ] Initialize Vite project
- [ ] Install all dependencies
- [ ] Configure Tailwind CSS
- [ ] Set up path aliases
- [ ] Create folder structure
- [ ] Set up ESLint and Prettier
- [ ] Create .env.example

### Phase 2: Core Components (Days 2-3)
- [ ] Build UI component library (buttons, inputs, cards, etc.)
- [ ] Create layout components (Navbar, Sidebar, Footer)
- [ ] Set up routing structure
- [ ] Implement error boundary
- [ ] Create loading states

### Phase 3: Authentication (Days 4-5)
- [ ] Build login page
- [ ] Build registration page
- [ ] Implement auth store
- [ ] Create auth service
- [ ] Set up protected routes
- [ ] Add forgot/reset password

### Phase 4: Onboarding (Days 6-7)
- [ ] Create onboarding questions data
- [ ] Build wizard component
- [ ] Implement progress indicator
- [ ] Add AI insight bubbles
- [ ] Connect to backend API
- [ ] Add validation

### Phase 5: Journey Creation (Days 8-9)
- [ ] Build journey creation form
- [ ] Add validation and examples
- [ ] Create loading screen with animations
- [ ] Implement status polling
- [ ] Handle errors and retries

### Phase 6: Dashboard (Days 10-12)
- [ ] Build dashboard layout
- [ ] Create journey overview section
- [ ] Add quick stats widgets
- [ ] Build journey timeline
- [ ] Implement day cards
- [ ] Add recent journal preview

### Phase 7: Audio Player (Day 13)
- [ ] Build custom audio player
- [ ] Add playback controls
- [ ] Implement progress tracking
- [ ] Add volume control
- [ ] Handle audio events

### Phase 8: Profile & Stats (Days 14-15)
- [ ] Build profile page with tabs
- [ ] Create stats page
- [ ] Implement streak calendar
- [ ] Add listening charts
- [ ] Build improvements section

### Phase 9: Journal (Days 16-17)
- [ ] Create journal list page
- [ ] Build journal entry form
- [ ] Add mood selector
- [ ] Implement AI insights display
- [ ] Add search and filter

### Phase 10: Admin Panel (Days 18-19)
- [ ] Build admin dashboard
- [ ] Create user table
- [ ] Add user detail modal
- [ ] Implement analytics charts
- [ ] Add system health widgets

### Phase 11: Polish (Days 20-21)
- [ ] Add animations and transitions
- [ ] Implement toast notifications
- [ ] Add loading skeletons
- [ ] Optimize performance
- [ ] Test responsive design
- [ ] Fix accessibility issues
- [ ] Add error handling everywhere

### Phase 12: Testing & Deployment (Days 22-23)
- [ ] Test all user flows
- [ ] Fix bugs
- [ ] Optimize bundle size
- [ ] Set up Vercel deployment
- [ ] Configure environment variables
- [ ] Test production build
- [ ] Write documentation

---

## 📊 Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB (gzipped)
- **Lighthouse Score**: > 90
- **Mobile Performance**: > 85

---

## 🎯 Success Criteria

- [ ] All pages render correctly on mobile, tablet, desktop
- [ ] Authentication flow works end-to-end
- [ ] Onboarding saves progress and completes successfully
- [ ] Journey creation triggers backend workflow
- [ ] Audio player works across all browsers
- [ ] Stats update in real-time
- [ ] Journal entries save and display correctly
- [ ] Admin panel shows accurate data
- [ ] No console errors or warnings
- [ ] Passes accessibility audit
- [ ] Deploys successfully to Vercel

---

**Document Version**: 1.0  
**Last Updated**: November 8, 2025  
**Owner**: Max Mayes

