# Electric Scooter Support Portal - MVP PRD

## Executive Summary
A mobile-first customer support portal for electric scooter users with essential support features.

## MVP Core Features

### Customer Portal (Essential)
1. **Mobile OTP Authentication**
   - Phone number login only
   - Simple OTP verification
   - Customer will access only Customer Portal

2. **Basic FAQ System**
   - 10-15 predefined questions/answers
   - Simple search functionality
   - Categories: Battery, Charging, Maintenance, Troubleshooting

3. **Simple Chat Interface**
   - Text-based questions only (no file upload in MVP)
   - Basic responses from predefined answers
   - Save chat history

4. **Escalation System**
   - "Not Satisfied" button
   - Simple form to submit unresolved queries

### Admin Portal (Basic)
1. **Admin Login**
   - Simple email/password authentication
   - Admin will be able to access only Admin Portal
   
2. **FAQ Management**
   - Add/edit/delete FAQ items
   - Basic categorization

3. **Query Management**
   - View submitted unresolved queries
   - Mark as resolved

## Technical Stack (Simplified)
- **Frontend**: React + Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Deployment**: Lovable hosting

## Database Schema (Minimal)
```sql
-- Users
users (id, phone, created_at)

-- FAQ
faqs (id, question, answer, category, created_at)

-- Chat Sessions
chat_sessions (id, user_id, created_at)

-- Messages
messages (id, session_id, message, response, created_at)

-- Unresolved Queries
unresolved_queries (id, user_id, query, status, created_at)
```

## MVP Implementation Plan (3 Weeks)

### Week 1: Core Setup
- Setup Supabase integration
- Phone OTP authentication
- Basic UI components

### Week 2: FAQ & Chat
- FAQ display system
- Basic chat interface
- Admin FAQ management

### Week 3: Polish & Deploy
- Escalation system
- Admin query management
- Testing & deployment

## MVP Success Metrics
- User registration rate
- FAQ engagement rate
- Query resolution rate through FAQ
- Admin response time to unresolved queries

## What's NOT in MVP
- File upload functionality
- Order tracking system
- Advanced AI responses
- Push notifications
- Complex analytics
- Multi-language support
- Advanced admin features

## Post-MVP Roadmap
1. File upload capability
2. Order tracking integration
3. Enhanced chat with AI
4. Advanced analytics
5. Mobile app version

This MVP focuses on proving the core concept with essential features only.