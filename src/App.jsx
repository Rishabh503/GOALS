import { useState, useEffect } from 'react'

// Initial template data if localStorage is empty
const INITIAL_DOMAINS = [
  {
    id: 'd-1',
    title: 'Product Launch',
    tasks: [
      { id: 't-1', title: 'Refine UI Design', description: 'Finalize dark-red glassmorphic interfaces.', deadline: '2026-07-25', completed: false },
      { id: 't-2', title: 'Write Documentation', description: 'Complete API reference guide for devs.', deadline: '2026-07-28', completed: false },
      { id: 't-3', title: 'Setup Stripe Integration', description: 'Configure billing webhooks and checkout flows.', deadline: '2026-08-01', completed: false },
      { id: 't-4', title: 'Beta Testing Group', description: 'Invite initial 50 testers to try the platform.', deadline: '2026-08-05', completed: false }
    ]
  },
  {
    id: 'd-2',
    title: 'Marketing Campaign',
    tasks: [
      { id: 't-5', title: 'Social Media Assets', description: 'Design header banners and templates.', deadline: '2026-07-22', completed: false },
      { id: 't-6', title: 'Newsletter Launch', description: 'Send launch email announcement to waitlist.', deadline: '2026-07-24', completed: false },
      { id: 't-7', title: 'PR Outreach', description: 'Reach out to tech journalists and newsletters.', deadline: '2026-07-30', completed: false }
    ]
  }
];

function App() {
  // Navigation Routing State
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('vibe_activeTab') || 'landing';
  });

  // Dashboard View Mode (board vs focus)
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('vibe_viewMode') || 'board';
  });

  // Domains State (Big Topics)
  const [domains, setDomains] = useState(() => {
    const saved = localStorage.getItem('vibe_domains');
    return saved ? JSON.parse(saved) : INITIAL_DOMAINS;
  });

  // Selected Active Domain ID (Used specifically for Focus View)
  const [activeDomainId, setActiveDomainId] = useState(() => {
    const saved = localStorage.getItem('vibe_activeDomainId');
    if (saved) return saved;
    const savedDomains = localStorage.getItem('vibe_domains');
    const parsed = savedDomains ? JSON.parse(savedDomains) : INITIAL_DOMAINS;
    return parsed.length > 0 ? parsed[0].id : '';
  });

  // Showcase Limits State per domain (default: 5)
  const [showcaseLimits, setShowcaseLimits] = useState(() => {
    const saved = localStorage.getItem('vibe_showcaseLimits');
    return saved ? JSON.parse(saved) : {};
  });

  // Temporary state for domain creation
  const [newDomainTitle, setNewDomainTitle] = useState('');

  // Drag and Drop State (within/across columns)
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedSourceDomainId, setDraggedSourceDomainId] = useState(null);
  const [dragOverDomainId, setDragOverDomainId] = useState(null);

  // Rush Day state variables
  const [rushDays, setRushDays] = useState(() => {
    const saved = localStorage.getItem('vibe_rushDays');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeRushDayId, setActiveRushDayId] = useState(() => {
    const saved = localStorage.getItem('vibe_activeRushDayId');
    if (saved) return saved;
    const savedRushDays = localStorage.getItem('vibe_rushDays');
    const parsed = savedRushDays ? JSON.parse(savedRushDays) : [];
    return parsed.length > 0 ? parsed[0].id : '';
  });

  // Collapsible sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('vibe_sidebarCollapsed') === 'true';
  });

  // Resizable column widths state
  const [columnWidths, setColumnWidths] = useState(() => {
    const saved = localStorage.getItem('vibe_columnWidths');
    return saved ? JSON.parse(saved) : {};
  });

  // Adjustable text size state (in pixels)
  const [globalFontSize, setGlobalFontSize] = useState(() => {
    return localStorage.getItem('vibe_globalFontSize') || '15';
  });

  // Very Important Task Reminders state
  const [importantReminders, setImportantReminders] = useState(() => {
    const saved = localStorage.getItem('vibe_importantReminders');
    return saved ? JSON.parse(saved) : [];
  });

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('vibe_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('vibe_viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('vibe_domains', JSON.stringify(domains));
  }, [domains]);

  useEffect(() => {
    localStorage.setItem('vibe_activeDomainId', activeDomainId);
  }, [activeDomainId]);

  useEffect(() => {
    localStorage.setItem('vibe_showcaseLimits', JSON.stringify(showcaseLimits));
  }, [showcaseLimits]);

  useEffect(() => {
    localStorage.setItem('vibe_sidebarCollapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('vibe_rushDays', JSON.stringify(rushDays));
  }, [rushDays]);

  useEffect(() => {
    localStorage.setItem('vibe_activeRushDayId', activeRushDayId);
  }, [activeRushDayId]);

  useEffect(() => {
    localStorage.setItem('vibe_columnWidths', JSON.stringify(columnWidths));
  }, [columnWidths]);

  useEffect(() => {
    localStorage.setItem('vibe_globalFontSize', globalFontSize);
  }, [globalFontSize]);

  useEffect(() => {
    localStorage.setItem('vibe_importantReminders', JSON.stringify(importantReminders));
  }, [importantReminders]);

  // Adjust root document font size dynamically
  useEffect(() => {
    document.documentElement.style.setProperty('--page-font-size', `${globalFontSize}px`);
  }, [globalFontSize]);

  // Add a new broad topic (domain)
  const handleAddDomain = (e) => {
    e.preventDefault();
    if (!newDomainTitle.trim()) return;

    const newDomain = {
      id: `d-${Date.now()}`,
      title: newDomainTitle.trim(),
      tasks: []
    };

    setDomains(prev => [...prev, newDomain]);
    setActiveDomainId(newDomain.id);
    setNewDomainTitle('');
    setActiveTab('dashboard'); // Auto redirect to dashboard when added
  };

  // Delete a broad topic (domain)
  const handleDeleteDomain = (domainId) => {
    if (!window.confirm('Are you sure you want to delete this topic and all its active/completed tasks?')) return;
    
    const remaining = domains.filter(d => d.id !== domainId);
    setDomains(remaining);
    
    if (activeDomainId === domainId) {
      setActiveDomainId(remaining.length > 0 ? remaining[0].id : '');
    }
  };

  // Rename a domain title
  const handleRenameDomainSubmit = (e, domainId) => {
    e.preventDefault();
    const newTitle = e.target.elements[`renameTitle-${domainId}`].value.trim();
    if (!newTitle) return;

    setDomains(prev => prev.map(d => {
      if (d.id === domainId) {
        return { ...d, title: newTitle };
      }
      return d;
    }));
    alert('Topic renamed successfully!');
  };

  // Add a task to a specific domain (Works for both Kanban columns & Focus panel)
  const handleAddTask = (e, domainId) => {
    e.preventDefault();
    const form = e.target;
    const title = form.elements[`taskTitle-${domainId}`].value.trim();
    const desc = form.elements[`taskDesc-${domainId}`].value.trim();
    const deadline = form.elements[`taskDeadline-${domainId}`].value;

    if (!title) return;

    const newTask = {
      id: `t-${Date.now()}`,
      title,
      description: desc,
      deadline: deadline || new Date().toISOString().split('T')[0],
      completed: false
    };

    setDomains(prev => prev.map(domain => {
      if (domain.id === domainId) {
        return {
          ...domain,
          tasks: [...domain.tasks, newTask]
        };
      }
      return domain;
    }));

    form.reset();
  };

  // Delete a task (incomplete or complete)
  const handleDeleteTask = (domainId, taskId) => {
    if (!window.confirm('Are you sure you want to permanently delete this goal?')) return;
    setDomains(prev => prev.map(domain => {
      if (domain.id === domainId) {
        return {
          ...domain,
          tasks: domain.tasks.filter(t => t.id !== taskId)
        };
      }
      return domain;
    }));
  };

  // Toggle Complete / Incomplete state of task
  const handleToggleTaskComplete = (domainId, taskId) => {
    const domain = domains.find(d => d.id === domainId);
    if (!domain) return;
    const task = domain.tasks.find(t => t.id === taskId);
    if (!task) return;

    const message = task.completed
      ? 'Are you sure you want to restore this goal back to active?'
      : 'Are you sure you want to mark this goal as completed?';

    if (!window.confirm(message)) return;

    setDomains(prev => prev.map(d => {
      if (d.id === domainId) {
        return {
          ...d,
          tasks: d.tasks.map(t => {
            if (t.id === taskId) {
              return { ...t, completed: !t.completed };
            }
            return t;
          })
        };
      }
      return d;
    }));
  };

  // Set the showcase limit of tasks for a domain
  const handleSetShowcaseLimit = (domainId, limit) => {
    setShowcaseLimits(prev => ({
      ...prev,
      [domainId]: limit
    }));
  };

  // Horizontal column mouse dragging resize helper
  const initResize = (mouseDownEvent, domainId) => {
    mouseDownEvent.preventDefault();
    const startX = mouseDownEvent.clientX;
    const colElement = mouseDownEvent.target.parentElement;
    const startWidth = colElement.offsetWidth;

    const doDrag = (mouseMoveEvent) => {
      const deltaX = mouseMoveEvent.clientX - startX;
      const newWidth = Math.max(220, Math.min(600, startWidth + deltaX));
      setColumnWidths(prev => ({
        ...prev,
        [domainId]: newWidth
      }));
    };

    const stopDrag = () => {
      window.removeEventListener('mousemove', doDrag);
      window.removeEventListener('mouseup', stopDrag);
    };

    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);
  };

  // Start a new Rush Day checklist
  const handleCreateRushDay = () => {
    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    const newDay = {
      id: `rd-${Date.now()}`,
      title: `Rush Day - ${todayStr}`,
      date: new Date().toISOString().split('T')[0],
      tasks: []
    };
    setRushDays(prev => [newDay, ...prev]);
    setActiveRushDayId(newDay.id);
    setActiveTab('rush-day');
    alert('New Rush Day started!');
  };

  // Delete a past Rush Day record
  const handleDeleteRushDay = (id) => {
    if (!window.confirm('Are you sure you want to delete this past Rush Day permanently?')) return;
    const remaining = rushDays.filter(d => d.id !== id);
    setRushDays(remaining);
    if (activeRushDayId === id) {
      setActiveRushDayId(remaining.length > 0 ? remaining[0].id : '');
    }
  };

  // Add a task to the active Rush Day
  const handleAddRushTask = (e, rushDayId) => {
    e.preventDefault();
    const form = e.target;
    const title = form.elements.rushTaskTitle.value.trim();
    if (!title) return;

    const newTask = {
      id: `rt-${Date.now()}`,
      title,
      completed: false
    };

    setRushDays(prev => prev.map(d => {
      if (d.id === rushDayId) {
        return {
          ...d,
          tasks: [...d.tasks, newTask]
        };
      }
      return d;
    }));
    form.reset();
  };

  // Toggle Rush task completion state on the same page
  const handleToggleRushTask = (rushDayId, taskId) => {
    const day = rushDays.find(d => d.id === rushDayId);
    if (!day) return;
    const task = day.tasks.find(t => t.id === taskId);
    if (!task) return;

    const message = task.completed
      ? 'Are you sure you want to restore this task back to pending?'
      : 'Are you sure you want to mark this task as completed?';

    if (!window.confirm(message)) return;

    setRushDays(prev => prev.map(d => {
      if (d.id === rushDayId) {
        return {
          ...d,
          tasks: d.tasks.map(t => {
            if (t.id === taskId) {
              return { ...t, completed: !t.completed };
            }
            return t;
          })
        };
      }
      return d;
    }));
  };

  // Delete a task from the active Rush Day
  const handleDeleteRushTask = (rushDayId, taskId) => {
    if (!window.confirm('Are you sure you want to permanently delete this task?')) return;
    setRushDays(prev => prev.map(d => {
      if (d.id === rushDayId) {
        return {
          ...d,
          tasks: d.tasks.filter(t => t.id !== taskId)
        };
      }
      return d;
    }));
  };

  // Create an Important Reminder event task
  const handleAddReminder = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.elements.reminderTitle.value.trim();
    const date = form.elements.reminderDate.value;
    if (!title || !date) return;

    const newReminder = {
      id: `rem-${Date.now()}`,
      title,
      date
    };

    setImportantReminders(prev => [...prev, newReminder]);
    form.reset();
    alert('Important Reminder added!');
  };

  // Delete an Important Reminder task
  const handleDeleteReminder = (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder permanently?')) return;
    setImportantReminders(prev => prev.filter(r => r.id !== id));
  };

  // Retrieve active reminder alerts (within [0, 2] days window)
  const getActiveAlerts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return importantReminders
      .map(rem => {
        const remDate = new Date(rem.date);
        remDate.setHours(0, 0, 0, 0);

        const diffTime = remDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return { ...rem, diffDays };
      })
      .filter(rem => rem.diffDays >= 0 && rem.diffDays <= 2)
      .sort((a, b) => a.diffDays - b.diffDays);
  };

  // Native Drag and Drop Logic (Cross-Domain and Reordering)
  const handleDragStart = (e, domainId, index) => {
    setDraggedIndex(index);
    setDraggedSourceDomainId(domainId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'task', domainId, index }));
  };

  const handleColumnDragStart = (e, domainId) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'column', id: domainId }));
  };

  const handleDragOver = (e, domainId) => {
    e.preventDefault();
    if (dragOverDomainId !== domainId) {
      setDragOverDomainId(domainId);
    }
  };

  const handleDragLeave = () => {
    setDragOverDomainId(null);
  };

  // Dropped directly on another task (specifies target reorder position)
  const handleDropOnTask = (e, targetDomainId, targetIndex) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        if (data.type === 'column') {
          const sourceId = data.id;
          if (sourceId === targetDomainId) return;

          const sourceIndex = domains.findIndex(d => d.id === sourceId);
          const targetIndex = domains.findIndex(d => d.id === targetDomainId);
          if (sourceIndex !== -1 && targetIndex !== -1) {
            setDomains(prev => {
              const updated = [...prev];
              const [removed] = updated.splice(sourceIndex, 1);
              updated.splice(targetIndex, 0, removed);
              return updated;
            });
          }
          return;
        }
      }
    } catch (err) {}
    
    if (draggedIndex === null || draggedSourceDomainId === null) return;

    setDomains(prev => {
      const newDomains = prev.map(d => ({
        ...d,
        tasks: [...d.tasks]
      }));

      const sourceDomain = newDomains.find(d => d.id === draggedSourceDomainId);
      const targetDomain = newDomains.find(d => d.id === targetDomainId);

      if (!sourceDomain || !targetDomain) return prev;

      // Extract the task from source domain list
      const [movedTask] = sourceDomain.tasks.splice(draggedIndex, 1);

      // Insert it into target domain list at target index
      targetDomain.tasks.splice(targetIndex, 0, movedTask);

      return newDomains;
    });

    resetDragState();
  };

  // Dropped on the column area itself (appends task to bottom of column)
  const handleDropOnColumn = (e, targetDomainId) => {
    e.preventDefault();

    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        if (data.type === 'column') {
          const sourceId = data.id;
          if (sourceId === targetDomainId) return;

          const sourceIndex = domains.findIndex(d => d.id === sourceId);
          const targetIndex = domains.findIndex(d => d.id === targetDomainId);
          if (sourceIndex !== -1 && targetIndex !== -1) {
            setDomains(prev => {
              const updated = [...prev];
              const [removed] = updated.splice(sourceIndex, 1);
              updated.splice(targetIndex, 0, removed);
              return updated;
            });
          }
          return;
        }
      }
    } catch (err) {}

    if (draggedIndex === null || draggedSourceDomainId === null) return;
    
    // If dropped on the same domain, do nothing (handled by reorder drops)
    if (draggedSourceDomainId === targetDomainId) {
      resetDragState();
      return;
    }

    setDomains(prev => {
      const newDomains = prev.map(d => ({
        ...d,
        tasks: [...d.tasks]
      }));

      const sourceDomain = newDomains.find(d => d.id === draggedSourceDomainId);
      const targetDomain = newDomains.find(d => d.id === targetDomainId);

      if (!sourceDomain || !targetDomain) return prev;

      const [movedTask] = sourceDomain.tasks.splice(draggedIndex, 1);
      targetDomain.tasks.push(movedTask);

      return newDomains;
    });

    resetDragState();
  };

  const resetDragState = () => {
    setDraggedIndex(null);
    setDraggedSourceDomainId(null);
    setDragOverDomainId(null);
  };

  // Select active domain for Focus View
  const activeDomain = domains.find(d => d.id === activeDomainId) || domains[0];

  // Extract completed tasks grouped by domain
  const hasCompletedTasks = domains.some(d => d.tasks.some(t => t.completed));

  return (
    <div className="app-wrapper">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Sidebar Header toggle controls */}
        <div className="sidebar-header">
          <button 
            className="sidebar-toggle-btn"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? '▶' : '◀'}
          </button>
        </div>
        
        {/* Page Nav Links */}
        <nav className="sidebar-nav">
          <button 
            className={`sidebar-btn ${activeTab === 'landing' ? 'active' : ''}`}
            onClick={() => setActiveTab('landing')}
          >
            <span className="sidebar-btn-icon">🏠</span>
            <span className="sidebar-btn-text">Home</span>
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="sidebar-btn-icon">📊</span>
            <span className="sidebar-btn-text">Dashboard</span>
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'rush-day' ? 'active' : ''}`}
            onClick={() => setActiveTab('rush-day')}
          >
            <span className="sidebar-btn-icon">📅</span>
            <span className="sidebar-btn-text">Rush Day</span>
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'reminders' ? 'active' : ''}`}
            onClick={() => setActiveTab('reminders')}
          >
            <span className="sidebar-btn-icon">🔔</span>
            <span className="sidebar-btn-text">Reminders</span>
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <span className="sidebar-btn-icon">✅</span>
            <span className="sidebar-btn-text">Completed</span>
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'manage-domains' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage-domains')}
          >
            <span className="sidebar-btn-icon">⚙️</span>
            <span className="sidebar-btn-text">Manage Topics</span>
          </button>
        </nav>

        {/* Sidebar Footer containing the optimized "Add Topic" form */}
        <div className="sidebar-footer">
          <h4 className="sidebar-footer-title">New Topic</h4>
          <form onSubmit={handleAddDomain} className="sidebar-add-form">
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Health & Gym" 
              value={newDomainTitle}
              onChange={(e) => setNewDomainTitle(e.target.value)}
              maxLength={30}
              required
            />
            <button type="submit" className="action-btn">Add Topic</button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        <main className="page-container">
          
          {/* LANDING / START PAGE */}
          {activeTab === 'landing' && (
            <div className="hero-container">
              <div className="hero-glow"></div>
              <h1 className="hero-title">
                Organize your goals, master your <span>domains</span>
              </h1>
              <p className="hero-subtitle">
                A minimalist SaaS tool designed for clear minds. Define your subjects, track goals with deadlines, and switch between Focus and horizontal Kanban Board layouts.
              </p>
              <button 
                className="start-btn"
                onClick={() => setActiveTab('dashboard')}
              >
                Start Organizing
              </button>
            </div>
          )}

          {/* DASHBOARD PAGE */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="dashboard-header">
                {/* Renamed "Broad Topics" to "Goals" */}
                <h2 className="section-title">Goals</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {/* Font Size Selector */}
                  <div className="display-settings">
                    <span className="display-label">Text size:</span>
                    <select 
                      className="select-dropdown"
                      value={globalFontSize}
                      onChange={(e) => setGlobalFontSize(e.target.value)}
                    >
                      <option value="13">Small</option>
                      <option value="15">Medium</option>
                      <option value="17">Large</option>
                      <option value="19">X-Large</option>
                    </select>
                  </div>

                  {/* Board / Focus View Switcher */}
                  <div className="view-toggle-container">
                    <button 
                      className={`view-toggle-btn ${viewMode === 'board' ? 'active' : ''}`}
                      onClick={() => setViewMode('board')}
                    >
                      Board View
                    </button>
                    <button 
                      className={`view-toggle-btn ${viewMode === 'focus' ? 'active' : ''}`}
                      onClick={() => setViewMode('focus')}
                    >
                      Focus View
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Warning Alerts Banner */}
              {(() => {
                const activeAlerts = getActiveAlerts();
                if (activeAlerts.length === 0) return null;
                return (
                  <div className="reminder-alert-container">
                    {activeAlerts.map(alert => (
                      <div key={alert.id} className="reminder-alert-banner">
                        <div className="reminder-alert-title">
                          <span>⚠️</span>
                          <span><strong>CRUCIAL EVENT DUE:</strong> {alert.title}</span>
                        </div>
                        <div className="reminder-alert-right">
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Deadline: {alert.date}</span>
                          <span className={`reminder-alert-badge ${alert.diffDays === 0 ? 'today' : 'warning'}`}>
                            {alert.diffDays === 0 ? 'TODAY!' : alert.diffDays === 1 ? 'TOMORROW' : 'IN 2 DAYS'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {domains.length === 0 ? (
                <div className="empty-state">
                  No active domains. Add a broad topic on the sidebar to start.
                </div>
              ) : (
                <>
                  {/* 1. HORIZONTAL KANBAN BOARD VIEW (Default) */}
                  {viewMode === 'board' && (
                    <div className="board-wrapper">
                      {domains.map(domain => {
                        const activeTasks = domain.tasks.filter(t => !t.completed);
                        const limitVal = showcaseLimits[domain.id] || '5';
                        const maxDisplay = limitVal === 'all' ? activeTasks.length : parseInt(limitVal, 10);
                        const displayedTasks = activeTasks.slice(0, maxDisplay);

                        return (
                          <div 
                            key={domain.id} 
                            className={`domain-column ${dragOverDomainId === domain.id ? 'drag-over' : ''}`}
                            style={columnWidths[domain.id] ? { width: `${columnWidths[domain.id]}px`, flex: '0 0 auto' } : {}}
                            onDragOver={(e) => handleDragOver(e, domain.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDropOnColumn(e, domain.id)}
                          >
                            {/* Column Resizer Handle */}
                            <div 
                              className="column-resizer" 
                              onMouseDown={(e) => initResize(e, domain.id)}
                              title="Drag to resize column width"
                            />
                            {/* Column Header */}
                            <div className="column-header">
                              <div className="column-header-left" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.4rem', minWidth: 0, flex: 1 }}>
                                <span 
                                  className="column-drag-grip"
                                  draggable
                                  onDragStart={(e) => handleColumnDragStart(e, domain.id)}
                                  title="Drag to reorder columns"
                                >
                                  ⠿
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                                  <h3 className="column-title" title={domain.title}>{domain.title}</h3>
                                  <span className="column-count-badge">
                                    {activeTasks.length} goals
                                  </span>
                                </div>
                              </div>
                              
                              {/* Showcase Limit Selector inside Column Header */}
                              <select 
                                className="select-dropdown"
                                value={limitVal}
                                onChange={(e) => handleSetShowcaseLimit(domain.id, e.target.value)}
                                title="Showcase limit"
                              >
                                <option value="3">Show 3</option>
                                <option value="5">Show 5</option>
                                <option value="10">Show 10</option>
                                <option value="all">Show All</option>
                              </select>
                            </div>

                            {/* Column Tasks List Area */}
                            <div className="column-tasks-scroll">
                              {activeTasks.length === 0 ? (
                                <div className="empty-state" style={{ padding: '1.5rem 0', fontSize: '0.8rem' }}>
                                  No pending goals
                                </div>
                              ) : (
                                <>
                                  {displayedTasks.map((task, idx) => (
                                    <div 
                                      key={task.id}
                                      className={`task-card ${draggedIndex === idx && draggedSourceDomainId === domain.id ? 'dragging' : ''}`}
                                      draggable
                                      onDragStart={(e) => handleDragStart(e, domain.id, idx)}
                                      onDragOver={(e) => e.preventDefault()}
                                      onDrop={(e) => handleDropOnTask(e, domain.id, idx)}
                                      onDragEnd={resetDragState}
                                    >
                                      {/* Task Main visible row */}
                                      <div className="task-main-row">
                                        <div className="task-left">
                                          <div className="drag-handle" title="Drag to reorder/move">⋮⋮</div>
                                          
                                          <div className="task-checkbox-container">
                                            <input 
                                              type="checkbox" 
                                              className="task-checkbox" 
                                              checked={task.completed}
                                              onChange={() => handleToggleTaskComplete(domain.id, task.id)}
                                            />
                                          </div>

                                          <h4 className="task-title" title={task.title}>{task.title}</h4>
                                        </div>

                                        <div className="task-right">
                                          <button 
                                            className="delete-task-btn"
                                            onClick={() => handleDeleteTask(domain.id, task.id)}
                                            title="Delete goal"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      </div>

                                      {/* Task Hover reveal details (Description & Deadline) */}
                                      <div className="task-hover-details">
                                        {task.description && <p className="task-desc">{task.description}</p>}
                                        <span className="deadline-badge">Due {task.deadline}</span>
                                      </div>
                                    </div>
                                  ))}

                                  {activeTasks.length > maxDisplay && (
                                    <div className="display-label" style={{ textAlign: 'center', fontSize: '0.72rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                                      + {activeTasks.length - maxDisplay} more goals hidden
                                    </div>
                                  )}
                                </>
                              )}
                            </div>

                            {/* Column Inline Task Creation Form */}
                            <div className="column-add-task-box">
                              <form onSubmit={(e) => handleAddTask(e, domain.id)} className="column-task-form">
                                <input 
                                  type="text" 
                                  name={`taskTitle-${domain.id}`} 
                                  className="input-field" 
                                  placeholder="Goal title..." 
                                  required 
                                />
                                <input 
                                  type="text" 
                                  name={`taskDesc-${domain.id}`} 
                                  className="input-field" 
                                  placeholder="Description..." 
                                />
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  <input 
                                    type="date" 
                                    name={`taskDeadline-${domain.id}`} 
                                    className="input-field" 
                                    style={{ flex: 1 }}
                                  />
                                  <button type="submit" className="action-btn" style={{ padding: '0.45rem 0.8rem' }}>Add</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 2. FOCUS VIEW (Tab based single domain layout) */}
                  {viewMode === 'focus' && (
                    <div>
                      {/* Horizontal scroll cards */}
                      <div className="horizontal-scroll-container">
                        {domains.map(d => {
                          const activeTasksCount = d.tasks.filter(t => !t.completed).length;
                          return (
                            <div 
                              key={d.id}
                              className={`domain-tab-card ${activeDomainId === d.id ? 'active' : ''}`}
                              onClick={() => setActiveDomainId(d.id)}
                            >
                              <h3 className="domain-tab-title">{d.title}</h3>
                              <span className="domain-tab-count">
                                {activeTasksCount} goals pending
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Active Domain Panel */}
                      {activeDomain && (
                        <div className="active-domain-section">
                          <div className="active-domain-header">
                            <div className="active-domain-info">
                              <h2 className="active-domain-title">{activeDomain.title}</h2>
                            </div>

                            <div className="display-settings">
                              <span className="display-label">Showcase limit:</span>
                              <select 
                                className="select-dropdown"
                                value={showcaseLimits[activeDomain.id] || '5'}
                                onChange={(e) => handleSetShowcaseLimit(activeDomain.id, e.target.value)}
                              >
                                <option value="3">3 goals</option>
                                <option value="5">5 goals</option>
                                <option value="10">10 goals</option>
                                <option value="all">All goals</option>
                              </select>
                            </div>
                          </div>

                          {/* Task List with Hover details */}
                          <div className="tasks-list">
                            {(() => {
                              const activeTasks = activeDomain.tasks.filter(t => !t.completed);
                              const limitVal = showcaseLimits[activeDomain.id] || '5';
                              const maxDisplay = limitVal === 'all' ? activeTasks.length : parseInt(limitVal, 10);
                              const displayedTasks = activeTasks.slice(0, maxDisplay);

                              if (activeTasks.length === 0) {
                                return (
                                  <div className="empty-state" style={{ padding: '2rem 0' }}>
                                    No pending goals in this topic. Add one below to get started!
                                  </div>
                                );
                              }

                              return (
                                <>
                                  {displayedTasks.map((task, idx) => (
                                    <div 
                                      key={task.id}
                                      className={`task-card ${draggedIndex === idx && draggedSourceDomainId === activeDomain.id ? 'dragging' : ''}`}
                                      draggable
                                      onDragStart={(e) => handleDragStart(e, activeDomain.id, idx)}
                                      onDragOver={(e) => e.preventDefault()}
                                      onDrop={(e) => handleDropOnTask(e, activeDomain.id, idx)}
                                      onDragEnd={resetDragState}
                                    >
                                      <div className="task-main-row">
                                        <div className="task-left">
                                          <div className="drag-handle">⋮⋮</div>
                                          
                                          <div className="task-checkbox-container">
                                            <input 
                                              type="checkbox" 
                                              className="task-checkbox" 
                                              checked={task.completed}
                                              onChange={() => handleToggleTaskComplete(activeDomain.id, task.id)}
                                            />
                                          </div>

                                          <h4 className="task-title">{task.title}</h4>
                                        </div>

                                        <div className="task-right">
                                          <button 
                                            className="delete-task-btn"
                                            onClick={() => handleDeleteTask(activeDomain.id, task.id)}
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      </div>

                                      <div className="task-hover-details">
                                        {task.description && <p className="task-desc">{task.description}</p>}
                                        <span className="deadline-badge">Due {task.deadline}</span>
                                      </div>
                                    </div>
                                  ))}

                                  {activeTasks.length > maxDisplay && (
                                    <div className="display-label" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                      Showing first {maxDisplay} of {activeTasks.length} pending goals. (Adjust limit above)
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>

                          {/* Add Goal Box */}
                          <div className="add-task-box">
                            <h3 className="add-task-box-title">Add New Goal</h3>
                            <form onSubmit={(e) => handleAddTask(e, activeDomain.id)} className="task-form">
                              <input 
                                type="text" 
                                name={`taskTitle-${activeDomain.id}`}
                                className="input-field" 
                                placeholder="Goal title..." 
                                required 
                              />
                              <input 
                                type="text" 
                                name={`taskDesc-${activeDomain.id}`}
                                className="input-field" 
                                placeholder="Brief description..." 
                              />
                              <input 
                                type="date" 
                                name={`taskDeadline-${activeDomain.id}`}
                                className="input-field" 
                              />
                              <button type="submit" className="action-btn">Add Goal</button>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* COMPLETED TASKS PAGE */}
          {activeTab === 'completed' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: '2rem' }}>Completed Goals</h2>
              
              {!hasCompletedTasks ? (
                <div className="empty-state">
                  No goals completed yet. Go to your active dashboard and complete some goals!
                </div>
              ) : (
                <div className="completed-groups">
                  {domains.map(domain => {
                    const completedTasks = domain.tasks.filter(t => t.completed);
                    if (completedTasks.length === 0) return null;

                    return (
                      <div key={domain.id} className="completed-domain-group">
                        <div className="completed-domain-header">
                          <h3 className="completed-domain-title">{domain.title}</h3>
                        </div>
                        
                        <div className="completed-tasks-list">
                          {completedTasks.map(task => (
                            <div key={task.id} className="completed-task-card">
                              <div className="completed-task-info">
                                <h4 className="completed-task-title">{task.title}</h4>
                                {task.description && <p className="completed-task-desc">{task.description}</p>}
                              </div>
                              <div className="completed-actions">
                                <button 
                                  className="restore-btn"
                                  onClick={() => handleToggleTaskComplete(domain.id, task.id)}
                                >
                                  Restore
                                </button>
                                <button 
                                  className="delete-task-btn"
                                  onClick={() => handleDeleteTask(domain.id, task.id)}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* MANAGE DOMAINS PAGE (50-50 horizontal layout) */}
          {activeTab === 'manage-domains' && (
            <div className="manage-page-grid">
              {/* Left Column: Manage Topics */}
              <div>
                <h2 className="section-title" style={{ marginBottom: '1rem' }}>Manage Topics</h2>
                
                {domains.length === 0 ? (
                  <div className="empty-state" style={{ padding: '1.5rem 0' }}>
                    No topics available. Add a topic on the sidebar to get started.
                  </div>
                ) : (
                  <div className="manage-domains-panel">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Rename your subjects or delete them permanently. Deleting a topic removes all of its active and completed goals.
                    </p>
                    
                    <div className="domain-manage-list">
                      {domains.map(domain => (
                        <div key={domain.id} className="domain-manage-item">
                          <form onSubmit={(e) => handleRenameDomainSubmit(e, domain.id)} className="domain-rename-form">
                            <input 
                              type="text" 
                              name={`renameTitle-${domain.id}`}
                              className="input-field domain-rename-input"
                              defaultValue={domain.title}
                              maxLength={30}
                              required
                            />
                            <button type="submit" className="action-btn">Rename</button>
                          </form>
                          
                          <button 
                            type="button"
                            className="delete-icon-btn"
                            onClick={() => handleDeleteDomain(domain.id)}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Rush Days History */}
              <div className="manage-rush-logs">
                <h2 className="section-title" style={{ marginBottom: '1rem' }}>Rush Days History</h2>
                {rushDays.length === 0 ? (
                  <div className="empty-state" style={{ padding: '1.5rem 0' }}>
                    No Rush Days logged yet. Click "Rush Day" in the sidebar to start a new checklist.
                  </div>
                ) : (
                  <div className="manage-domains-panel">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Review previous Rush Days, jump back into their checklist view, or delete them from the logs.
                    </p>
                    
                    <div className="domain-manage-list">
                      {rushDays.map(day => {
                        const pendingCount = day.tasks.filter(t => !t.completed).length;
                        const doneCount = day.tasks.filter(t => t.completed).length;

                        return (
                          <div key={day.id} className="domain-manage-item">
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{day.title}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Created: {day.date} &bull; {pendingCount} active / {doneCount} done tasks
                              </span>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                type="button" 
                                className="action-btn"
                                onClick={() => {
                                  setActiveRushDayId(day.id);
                                  setActiveTab('rush-day');
                                }}
                              >
                                View
                              </button>
                              <button 
                                type="button"
                                className="delete-icon-btn"
                                onClick={() => handleDeleteRushDay(day.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RUSH DAY PAGE */}
          {activeTab === 'rush-day' && (
            <div>
              <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                <h2 className="section-title">Rush Day Checklist</h2>
                <button 
                  className="action-btn"
                  onClick={handleCreateRushDay}
                >
                  + Start New Rush Day
                </button>
              </div>

              {rushDays.length === 0 ? (
                <div className="empty-state" style={{ padding: '4rem 1rem' }}>
                  <p style={{ marginBottom: '1.5rem' }}>No Rush Days active. Create a fresh list to start rapid-fire tasks!</p>
                  <button className="action-btn" onClick={handleCreateRushDay}>Start Your First Rush Day</button>
                </div>
              ) : (
                <div className="rush-day-layout">
                  {/* Right Column: Active Rush Day Tasks - Occupies Full Width */}
                  {(() => {
                    const activeDayObj = rushDays.find(d => d.id === activeRushDayId) || rushDays[0];
                    if (!activeDayObj) return null;

                    const pendingTasks = activeDayObj.tasks.filter(t => !t.completed);
                    const completedTasks = activeDayObj.tasks.filter(t => t.completed);

                    return (
                      <div className="rush-active-panel">
                        <div className="rush-active-header">
                          <h3 className="rush-active-title">{activeDayObj.title}</h3>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {pendingTasks.length} pending / {completedTasks.length} done
                          </span>
                        </div>

                        {/* Rapid Task Adder Form */}
                        <form 
                          onSubmit={(e) => handleAddRushTask(e, activeDayObj.id)} 
                          className="rush-add-form"
                        >
                          <input 
                            type="text" 
                            name="rushTaskTitle"
                            className="input-field" 
                            placeholder="Add task line-by-line..." 
                            required 
                          />
                          <button type="submit" className="action-btn">Add</button>
                        </form>

                        {/* Split checklist area on the same page */}
                        <div className="rush-tasks-container">
                          
                          {/* Pending Tasks Section */}
                          <div>
                            <h4 className="rush-section-title">Pending ({pendingTasks.length})</h4>
                            {pendingTasks.length === 0 ? (
                              <p className="empty-state" style={{ padding: '1rem 0' }}>No pending tasks. You are all caught up!</p>
                            ) : (
                              <div className="rush-list">
                                {pendingTasks.map(task => (
                                  <div key={task.id} className="rush-task-card">
                                    <div className="task-left">
                                      <div className="task-checkbox-container">
                                        <input 
                                          type="checkbox" 
                                          className="task-checkbox" 
                                          checked={task.completed}
                                          onChange={() => handleToggleRushTask(activeDayObj.id, task.id)}
                                        />
                                      </div>
                                      <span className="task-title" style={{ fontSize: '0.88rem' }}>{task.title}</span>
                                    </div>
                                    <button 
                                      className="delete-task-btn" 
                                      onClick={() => handleDeleteRushTask(activeDayObj.id, task.id)}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Completed/Done Tasks Section */}
                          <div>
                            <h4 className="rush-section-title">Done ({completedTasks.length})</h4>
                            {completedTasks.length === 0 ? (
                              <p className="empty-state" style={{ padding: '1rem 0' }}>No completed tasks yet. Finish a task above!</p>
                            ) : (
                              <div className="rush-list">
                                {completedTasks.map(task => (
                                  <div key={task.id} className="rush-task-card completed">
                                    <div className="task-left">
                                      <div className="task-checkbox-container">
                                        <input 
                                          type="checkbox" 
                                          className="task-checkbox" 
                                          checked={task.completed}
                                          onChange={() => handleToggleRushTask(activeDayObj.id, task.id)}
                                        />
                                      </div>
                                      <span className="task-title" style={{ fontSize: '0.88rem' }}>{task.title}</span>
                                    </div>
                                    <button 
                                      className="delete-task-btn" 
                                      onClick={() => handleDeleteRushTask(activeDayObj.id, task.id)}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* DEDICATED REMINDERS PAGE */}
          {activeTab === 'reminders' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Important Reminders</h2>
              
              <div className="reminders-panel">
                <div className="reminder-form-box">
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-active)' }}>Add Important Task</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Set strict deadlines for critical events (like exams or presentations) to get warned in the Goals dashboard starting 2 days prior.
                  </p>
                  
                  <form onSubmit={handleAddReminder} className="reminder-form">
                    <input 
                      type="text" 
                      name="reminderTitle"
                      className="input-field" 
                      placeholder="E.g., Math Final Exam, Project Presentation..." 
                      required 
                    />
                    <div className="reminder-form-row">
                      <input 
                        type="date" 
                        name="reminderDate"
                        className="input-field" 
                        required 
                      />
                      <button type="submit" className="action-btn">Create Reminder</button>
                    </div>
                  </form>
                </div>

                <div className="reminders-list-box">
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-active)' }}>Active Reminders ({importantReminders.length})</h3>
                  
                  {importantReminders.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem 0' }}>
                      No important reminders set. Add one above to activate countdown alerts.
                    </div>
                  ) : (
                    <div className="reminder-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {importantReminders.map(rem => (
                        <div key={rem.id} className="reminder-item">
                          <div className="reminder-item-info">
                            <span className="reminder-item-title">{rem.title}</span>
                            <span className="reminder-item-date">Target Date: {rem.date}</span>
                          </div>
                          <button 
                            className="delete-task-btn" 
                            onClick={() => handleDeleteReminder(rem.id)}
                            title="Remove reminder"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="footer">
          <p>Goals Organizer &copy; 2026. Built with Meadow Green light-mode aesthetics.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
