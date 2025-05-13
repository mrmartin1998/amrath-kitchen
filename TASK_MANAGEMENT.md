# Task Management System - Amrath Kitchen

## Overview
A role-based task management system to help kitchen staff organize and track their work efficiently. The system will be implemented in phases, starting with core functionality and gradually adding more complex features.

## Phase 1: Core Functionality
### User Management
#### User Registration & Authentication
- Simple registration with user's name
- Role assignment (admin/user)
- No password required for initial phase
- First admin will be registered manually (via MongoDB)
- Users can view all users' tasks

#### User Schema
```javascript
{
  name: String,          // User's name
  role: String,         // ['admin', 'user']
  createdAt: Date,      // Registration timestamp
  updatedAt: Date       // Last update timestamp
}
```

#### User Features
- Register with name
- View all users list
- View tasks assigned to any user
- Admin can assign roles

### Task Features
#### Status Management
- Three states: pending, in-progress, completed
- Status history tracking with user and timestamp
- Admin can override any status change
- Users can update status of assigned tasks

#### Comments System
- All comments visible to all users
- No editing/deletion in initial phase
- Chronological comment display
- Simple text-based comments

#### Task Priority & Sorting
- Priority levels: low, medium, high
- Only admins can modify priority
- Users can view priority levels
- Sorting options:
  - Due date (default)
  - Priority level
  - Status

#### Visual Indicators
- Color coding for:
  - Priority levels
    - High: Red
    - Medium: Yellow
    - Low: Green
  - Status
    - Pending: Gray
    - In Progress: Blue
    - Completed: Green
  - Overdue tasks: Red background

### User Interface
#### Admin Dashboard
- Create tasks (with or without immediate assignment)
- Manage task assignments separately
- View all tasks and their status
- User management interface
- Basic task statistics:
  - Total tasks
  - Tasks by status
  - Overdue tasks
  - Tasks by priority

#### User Dashboard
- View assigned and all tasks
- Update task status
- Add comments to tasks
- Sort tasks by:
  - Due date (default)
  - Priority
  - Status

### User Roles
- Admin
  - Create and assign tasks (can create unassigned tasks)
  - Manage users and roles
  - View all tasks
  - Assign admin role to other users
  - Access admin dashboard
  - Manage task assignments separately from creation
- User
  - View all tasks (including other users')
  - Update task status
  - Add basic comments
  - Access user dashboard

### Task Management
- Tasks sorted by due date by default
- Can be assigned to multiple users
- Can be created without immediate assignment
- Assignment can be managed separately from creation

### Basic Task Structure
```javascript
{
  title: String,          // Task title
  description: String,    // Task description
  status: String,        // ['pending', 'in-progress', 'completed']
  statusHistory: [{      // Track status changes
    status: String,
    updatedBy: ObjectId,
    updatedAt: Date
  }],
  assignedTo: [userId],  // Array of user IDs (can be empty)
  createdBy: userId,     // Admin who created the task
  priority: String,      // ['low', 'medium', 'high']
  dueDate: Date,        // When the task should be completed
  comments: [{          // Task comments
    text: String,
    createdBy: ObjectId,
    createdAt: Date
  }],
  createdAt: Date,      // Task creation timestamp
  updatedAt: Date       // Last update timestamp
}
```

### Initial Features
1. Task Management
   - Create basic tasks (with optional assignment)
   - Assign users to existing tasks
   - Set priority and due date
   - Update task status
   - Tasks sorted by due date by default

2. User Interface
   - Separate admin and user dashboards
   - Task list view (sorted by due date)
   - Basic task creation form
   - Task assignment interface
   - Task status updates
   - Priority indicators

## Phase 2: Enhanced Features
### Task Dependencies
- Add predecessor/successor relationships
- Visual task dependency indicators
- Dependency validation

### Predefined Task Categories
- Kitchen prep
- Cleaning
- Inventory
- Equipment maintenance
- General tasks

### Advanced Task Properties
```javascript
{
  // ... Phase 1 properties
  category: String,      // Predefined task category
  dependencies: [taskId],// Tasks that must be completed first
  estimatedTime: Number, // Estimated completion time
  actualTime: Number,    // Actual time taken
  notes: [              // Task notes/comments
    {
      text: String,
      user: userId,
      timestamp: Date
    }
  ]
}
```

## Phase 3: Future Enhancements
### Time Tracking
- Start/stop task timer
- Track actual vs. estimated time
- Time-based reports

### Task Templates
- Create templates for recurring tasks
- Batch task creation
- Template management

### Advanced Reporting
- Task completion metrics
- User performance tracking
- Time analysis
- Priority distribution

## Implementation Order
1. Phase 1 Core Features
   - [ ] Create User model and schema
   - [ ] Implement user registration
   - [ ] Set up role management
   - [ ] Create admin dashboard structure
   - [ ] Create user dashboard structure
   - [ ] Create basic task model
   - [ ] Implement task CRUD operations
   - [ ] Build task assignment interface
   - [ ] Implement status updates
   - [ ] Add task sorting by due date

2. Phase 2 Enhancements
   - [ ] Add task dependencies
   - [ ] Implement categories
   - [ ] Add notes/comments system
   - [ ] Enhance UI with more features

3. Phase 3 Advanced Features
   - [ ] Implement time tracking
   - [ ] Add task templates
   - [ ] Create reporting system
   - [ ] Build analytics dashboard

## Technical Considerations
### Security
- Role-based access control
- Task visibility rules
- Action audit logging

### Performance
- Efficient task querying
- Real-time updates
- Mobile optimization

### User Experience
- Clear status indicators
- Easy task updates
- Responsive design
- Intuitive navigation

## API Endpoints (Phase 1)
```javascript
// Users
POST   /api/users           // Register user
GET    /api/users           // List all users
PUT    /api/users/:id/role  // Update user role (admin only)

// Tasks
POST   /api/tasks           // Create task (admin only)
GET    /api/tasks           // List tasks (sorted by due date)
GET    /api/tasks/:id       // Get task details
PUT    /api/tasks/:id       // Update task
DELETE /api/tasks/:id       // Delete task (admin only)

// Task Assignment
POST   /api/tasks/:id/assign    // Assign users to task (admin only)
DELETE /api/tasks/:id/assign    // Remove assignment (admin only)

// Task Status
PUT    /api/tasks/:id/status    // Update status
```

## Database Schema (Phase 1)
```javascript
// User Model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Task Model
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    required: true
  },
  comments: [{
    text: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Add indexes for better query performance
userSchema.index({ name: 1 });
taskSchema.index({ status: 1, dueDate: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ 'statusHistory.updatedAt': 1 });
``` 