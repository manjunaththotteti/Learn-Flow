# LearnFlow — Dynamic Learning Recommendation System

> **An intelligent learning assistant that tracks study behavior, estimates learner fatigue, evaluates topic mastery, and dynamically recommends what to learn next.**

## 📌 Overview

**LearnFlow** is a personalized learning recommendation system designed to overcome the limitations of static learning paths.

Traditional learning platforms generally provide the same sequence of topics to every learner. However, learners differ in their **learning speed, performance, attention span, and topic mastery**.

LearnFlow continuously analyzes a learner's study activity and dynamically determines the next suitable topic based on:

* Topics already completed
* Time spent learning
* Quiz performance
* Errors and retries
* Estimated fatigue
* Topic mastery
* Learning history

The system then generates a personalized learning path and displays it through an interactive **Learning Flow UI**.

---

## 🎯 Problem Statement

Learners often follow fixed learning paths that do not consider their individual learning behavior.

This can result in:

* Spending too much time on topics already mastered
* Ignoring weak topics
* Continuing difficult topics when fatigued
* Information overload
* Poorly personalized learning experiences

### Proposed Solution

LearnFlow creates a **dynamic learning path** by monitoring learner activity and continuously adapting topic recommendations.

```text
Learner Activity
       ↓
Learning Logger
       ↓
Fatigue + Performance Analysis
       ↓
Mastery Evaluation
       ↓
Topic Ranking
       ↓
Next Topic Recommendation
       ↓
Learning Flow UI
```

---

# 🎯 Objectives

1. Monitor topics covered and time spent on each topic.
2. Track learner learning sessions.
3. Estimate learner fatigue.
4. Calculate topic mastery.
5. Identify weak and strong topics.
6. Dynamically recommend the next topic.
7. Reorder topics according to learner performance.
8. Display the personalized learning path visually.

---

# 🏗️ System Architecture

```text
                  ┌──────────────────────┐
                  │       Learner        │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Learning Logger    │
                  │ Time + Topic + Quiz  │
                  └──────────┬───────────┘
                             │
                 ┌───────────┴───────────┐
                 ▼                       ▼
       ┌──────────────────┐    ┌──────────────────┐
       │ Fatigue Estimator│    │  Mastery Sorter  │
       └────────┬─────────┘    └────────┬─────────┘
                │                       │
                └───────────┬───────────┘
                            ▼
                ┌────────────────────────┐
                │ Next Topic Recommender │
                └────────────┬───────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │       Flow UI           │
                │ Personalized Roadmap   │
                └────────────┬───────────┘
```

---

# 🧩 Modules

## 1. Learning Logger

The Learning Logger is responsible for recording the learner's activity.

### Data collected

* User ID
* Topic name
* Session start time
* Session end time
* Duration
* Quiz score
* Number of questions
* Number of incorrect answers
* Number of attempts

### Example

```text
Topic: Machine Learning
Start: 10:00 AM
End: 10:45 AM
Duration: 45 minutes
Quiz Score: 80%
Attempts: 1
```

This information becomes the input for the other modules.

---

## 2. Fatigue Estimator

The Fatigue Estimator estimates whether the learner is becoming tired or losing focus.

Instead of relying only on study duration, LearnFlow can consider multiple behavioral indicators.

### Possible features

* Continuous study duration
* Time since last break
* Quiz response time
* Quiz accuracy
* Number of mistakes
* Number of topic switches
* Recent learning performance

### Example

```text
Study Duration       → 75 min
Recent Quiz Accuracy → 55%
Response Time        → Increasing
Break Taken          → No

              ↓

        High Fatigue
```

The system can generate a normalized fatigue score between **0 and 1**.

```text
0.0 – 0.3 → Low Fatigue
0.3 – 0.6 → Moderate Fatigue
0.6 – 1.0 → High Fatigue
```

> In the initial version, fatigue can be implemented using a transparent scoring/rule-based model. Later, machine learning can be introduced using historical learner-session data.

---

## 3. Mastery Sorter

The Mastery Sorter determines how well the learner understands each topic.

### Possible inputs

* Quiz score
* Number of attempts
* Errors
* Time spent
* Recent performance

Each topic receives a mastery score.

```text
Topic             Mastery

Python            0.91
Pandas            0.76
NumPy             0.63
Machine Learning  0.48
Deep Learning     0.31
```

Lower mastery means the topic requires greater attention.

### Topic categories

```text
0.00 – 0.40 → Weak
0.40 – 0.70 → Developing
0.70 – 0.85 → Good
0.85 – 1.00 → Mastered
```

The sorter prioritizes weak topics when the learner is ready for challenging content.

---

# 4. Next Topic Recommender

This is the core decision-making component of LearnFlow.

It combines information from:

* Fatigue Estimator
* Mastery Sorter
* Learning Logger
* Topic prerequisites
* Learning history

### Example

Suppose the learner has:

```text
Python             → 90% mastery
NumPy               → 80% mastery
Pandas              → 65% mastery
Machine Learning    → 40% mastery

Fatigue = High
```

The system may avoid immediately recommending a difficult Machine Learning topic and instead recommend a shorter revision activity.

If fatigue is low:

```text
Recommended Topic → Machine Learning
Reason            → Lowest mastery + learner is ready
```

### Recommendation strategy

```text
                Current Learner State
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
       High Fatigue             Low Fatigue
             │                       │
             ▼                       ▼
       Light / Revision        Weak Topic
             │                       │
             └───────────┬───────────┘
                         ▼
                  Recommended Topic
```

---

# 5. Flow UI

The Flow UI presents the learner's personalized learning journey.

### It can display

* Completed topics
* Current topic
* Recommended topic
* Weak topics
* Mastered topics
* Pending topics
* Topic dependencies
* Overall progress

### Example

```text
Python
  │
  ▼
NumPy
  │
  ▼
Pandas
  │
  ├───────────────┐
  ▼               │
Machine Learning  │
  │               │
  ▼               │
Deep Learning ◄───┘
```

The UI makes the recommendation system easy for the learner to understand.

---

# 🔄 Complete Working Process

### Step 1 — Learner starts a topic

The system records the start time.

### Step 2 — Learning session is tracked

The logger records the duration and topic.

### Step 3 — Learner completes a quiz

The system records:

```text
Score
Errors
Attempts
Response time
```

### Step 4 — Fatigue is estimated

The system analyzes recent learning behavior.

### Step 5 — Topic mastery is calculated

Each topic receives an updated mastery score.

### Step 6 — Topics are ranked

Weak topics receive higher priority.

### Step 7 — Recommendation engine runs

The engine considers:

```text
Mastery
+ Fatigue
+ Learning History
+ Topic Difficulty
+ Prerequisites
```

### Step 8 — Next topic is selected

The highest-ranked suitable topic becomes the recommendation.

### Step 9 — Flow UI updates

The learner sees the updated personalized learning path.

---

# 🧠 Recommendation Logic

A simple initial scoring approach can be:

```text
Recommendation Score =
    Weakness Score
    + Relevance Score
    + Readiness Score
    - Fatigue Penalty
```

For example:

```text
Topic A → Score = 0.82
Topic B → Score = 0.61
Topic C → Score = 0.74

                 ↓

Recommended Topic = Topic A
```

The initial system can use a **rule-based recommendation engine**.

After sufficient learner data is collected, the project can be upgraded to a machine-learning recommendation model.

---

# 🤖 Machine Learning Extension

LearnFlow can be made more advanced by training an ML model using historical learner-session data.

### Possible input features

```text
session_duration
quiz_score
error_rate
attempt_count
response_time
topic_mastery
fatigue_score
previous_topic
topic_difficulty
```

### Possible prediction

```text
Input:
Learner State

        ↓

ML Recommendation Model

        ↓

Probability of successful learning

        ↓

Best Next Topic
```

Possible algorithms include:

* Random Forest
* XGBoost
* Logistic Regression
* Gradient Boosting
* Collaborative Filtering
* Reinforcement Learning for advanced versions

---

# 🗄️ Database Design

A simple implementation can use SQLite.

### Users

```text
users
-----
id
name
email
created_at
```

### Topics

```text
topics
------
id
topic_name
difficulty
prerequisite
```

### Learning Sessions

```text
learning_sessions
-----------------
id
user_id
topic_id
start_time
end_time
duration
```

### Quiz Results

```text
quiz_results
------------
id
user_id
topic_id
score
total_questions
incorrect_answers
attempts
response_time
```

### Topic Mastery

```text
topic_mastery
-------------
user_id
topic_id
mastery_score
updated_at
```

---

# 🛠️ Technology Stack

| Component        | Technology                                  |
| ---------------- | ------------------------------------------- |
| Programming      | Python                                      |
| Data Processing  | Pandas, NumPy                               |
| Machine Learning | Scikit-learn                                |
| Backend          | Flask / FastAPI                             |
| Frontend         | HTML, CSS, JavaScript                       |
| Database         | SQLite / PostgreSQL                         |
| Visualization    | Plotly / Mermaid.js                         |
| Development      | VS Code / Google Colab                      |
| Version Control  | Git & GitHub                                |
| Deployment       | Streamlit Cloud / Render / Vercel + Backend |

---

# 📁 Suggested Project Structure

```text
LearnFlow/
│
├── app.py
├── requirements.txt
├── README.md
│
├── data/
│   ├── users.csv
│   ├── topics.csv
│   └── learning_sessions.csv
│
├── models/
│   └── recommender.pkl
│
├── modules/
│   ├── learning_logger.py
│   ├── fatigue_estimator.py
│   ├── mastery_sorter.py
│   └── recommender.py
│
├── database/
│   └── learnflow.db
│
├── ui/
│   ├── dashboard.py
│   └── flow_ui.py
│
└── notebooks/
    └── model_training.ipynb
```

---

# 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/LearnFlow.git
cd LearnFlow
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the application:

```bash
python app.py
```

If using Streamlit:

```bash
streamlit run app.py
```

---

# 📊 Example User Scenario

Consider a student learning **Machine Learning**.

### Session 1

```text
Topic: Linear Regression
Time: 40 minutes
Quiz: 90%
Mastery: High
```

LearnFlow identifies Linear Regression as well understood.

### Session 2

```text
Topic: Decision Trees
Time: 65 minutes
Quiz: 55%
Errors: High
Fatigue: Moderate
```

The system detects that Decision Trees require additional attention.

### Recommendation

```text
Recommended:
Decision Tree Revision
```

After improvement:

```text
Decision Tree Mastery: 82%
```

The system can then recommend the next appropriate topic.

This creates a **dynamic learning path instead of a fixed sequence**.

---

# 📈 Dashboard

The dashboard can display:

```text
┌─────────────────────────────────────────┐
│             LEARNFLOW                   │
├─────────────────────────────────────────┤
│ Overall Progress       68%               │
│ Current Topic          Pandas            │
│ Fatigue Level          Moderate          │
│ Recommended Topic      Machine Learning  │
├─────────────────────────────────────────┤
│ Topic Mastery                            │
│ Python              █████████ 90%        │
│ NumPy               ████████  80%        │
│ Pandas              ██████    65%        │
│ ML                  ████      40%        │
└─────────────────────────────────────────┘
```

---

# 🔐 Important Design Consideration

Fatigue estimation in this project should be presented as an **estimated learning-state indicator**, not as a medical or psychological diagnosis.

The system should primarily use learning behavior such as:

* Session duration
* Quiz performance
* Response time
* Break frequency
* Topic switching

---

# 🌟 Key Advantages

* Personalized learning path
* Real-time recommendations
* Identifies weak topics
* Prevents unnecessary repetition
* Considers learner fatigue
* Visual learning roadmap
* Data-driven decision making
* Can be extended with machine learning

---

# ⚠️ Limitations

The initial version may have limitations:

* Fatigue estimation is approximate.
* Recommendation quality depends on available learner data.
* New users have limited historical information.
* Quiz quality affects mastery estimation.
* Behavioral signals cannot perfectly measure human attention.

---

# 🔮 Future Scope

### 1. Advanced Machine Learning

Train personalized recommendation models using historical learner behavior.

### 2. Reinforcement Learning

Use learner feedback as a reward signal and continuously optimize the learning path.

### 3. Knowledge Graph

Represent relationships and prerequisites between topics.

```text
Python
  ↓
NumPy
  ↓
Pandas
  ↓
Machine Learning
  ↓
Deep Learning
```

### 4. AI Tutor

Integrate an LLM-based tutor that explains recommended topics.

### 5. Adaptive Quizzes

Automatically generate questions based on the learner's weak areas.

### 6. Multi-user Analytics

Allow teachers to monitor student progress and identify learners who need additional support.

### 7. LMS Integration

Integrate with existing learning-management platforms.

---

# 🎓 Project Outcome

LearnFlow transforms a **static learning sequence** into a **dynamic personalized learning experience**.

Instead of:

```text
Topic 1 → Topic 2 → Topic 3 → Topic 4
```

LearnFlow creates:

```text
Learner Behavior
       ↓
Performance Analysis
       ↓
Fatigue Estimation
       ↓
Mastery Evaluation
       ↓
Dynamic Recommendation
       ↓
Personalized Learning Path
```

---

# 📌 Why LearnFlow?

The main value of LearnFlow is not simply tracking study time.

The core contribution is the **adaptive decision-making layer** that uses learner behavior to decide:

> **"What should this learner study next, and why?"**

This makes LearnFlow suitable as an academic project demonstrating:

* Data collection
* Data analysis
* Machine learning
* Recommendation systems
* Personalization
* Visualization
* Real-time decision making

---

# 👨💻 Author

**Your Name**

B.Tech — Computer Science / Data Science

---

# 📜 License

This project is intended for educational and academic purposes.
