# Database Seeding Guide

## Quick Setup

To seed the database with dummy data, make a POST request to:

```
POST http://localhost:4000/api/user/seed
```

### Using curl:
```bash
curl -X POST http://localhost:4000/api/user/seed
```

### Using JavaScript/Fetch:
```javascript
fetch('http://localhost:4000/api/user/seed', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data))
```

### Expected Response:
```json
{
  "success": true,
  "message": "Database seeded successfully!",
  "data": {
    "users": 3,
    "posts": 5,
    "stories": 2,
    "messages": 2
  }
}
```

## What Gets Seeded

1. **3 Users**:
   - John Warren (user_2zdFoZib5lNr614LgkONdD8WG32)
   - Richard Hendricks (user_2)
   - Alexa James (user_3)

2. **5 Posts** - Mix of text, image, and text+image posts

3. **2 Stories** - Text and image stories

4. **2 Messages** - Sample conversations between users

## After Seeding

1. Sign in with your Clerk credentials
2. Your user profile will be created/updated
3. You'll see the seeded posts, stories, and messages in the feed
4. You can interact with them (like, comment, message)

**Note**: The infinite loading issue should be resolved as soon as you have users and posts in the database.
