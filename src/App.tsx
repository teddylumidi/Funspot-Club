
import React, { useState, useEffect, useMemo, FC, useRef } from 'react';

// --- TYPES ---
type Role = 'Admin' | 'Coach' | 'Athlete' | 'Parent';
type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All';
type LocationType = 'Indoor' | 'Outdoor';

interface User {
  id: string;
  name: string;
  email: string;
  dob: string;
  role: Role;
  parent_id?: string;
  coach_id?: string;
  bio?: string;
  phone?: string;
  address?: string;
  emergencyContact?: { name: string; phone: string };
  photo_url: string;
  created_at: string;
}

interface Program {
  id: string;
  title: string;
  description: string;
  coach_id: string;
  price_cents: number;
  currency: string;
  duration_minutes: number;
  schedule: { day: string; time: string }[];
  skill_level: SkillLevel;
  capacity: number;
  enrolled_count: number;
  location_type: LocationType;
  active: boolean;
}

type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};

// --- SVG ICONS ---
const EyeIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-7.532a1.012 1.012 0 0 1 1.638 0l4.43 7.532a1.012 1.012 0 0 1 0 .639l-4.43 7.532a1.012 1.012 0 0 1-1.638 0l-4.43-7.532Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const UserPlusIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0 0 15 0h-15Z" /></svg>;
const PencilIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const TrashIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const XMarkIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const ExclamationTriangleIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>;
const SkateIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2c-1.42 0-2.84.4-4.24 1.2L16 2.29V2a1 1 0 0 0-2 0v1.29l-1.76-1.09C10.84.4 9.42 0 8 0 5.25 0 3 2.25 3 5c0 1.42.4 2.84 1.2 4.24L2.29 11H2a1 1 0 0 0 0 2h1.29l-1.09 1.76C.4 16.16 0 17.58 0 19c0 2.75 2.25 5 5 5 1.42 0 2.84-.4 4.24-1.2L11 21.71V22a1 1 0 0 0 2 0v-1.29l1.76 1.09c1.4.8 2.82 1.2 4.24 1.2 2.75 0 5-2.25 5-5 0-1.42-.4-2.84-1.2-4.24L21.71 13H22a1 1 0 0 0 0-2h-1.29l1.09-1.76C23.6 7.84 24 6.42 24 5c0-2.75-2.25-5-5-5zM9 19c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm6 0c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" /></svg>;


// --- MOCK DATA ---
const initialUsers: User[] = [
  { id: 'user_01', name: 'Admin User', email: 'admin@funspot.com', dob: '1985-01-15', role: 'Admin', photo_url: `https://i.pravatar.cc/150?u=user_01`, created_at: '2023-01-10' },
  { id: 'user_02', name: 'Coach Davis', email: 'coach.d@funspot.com', dob: '1990-05-20', role: 'Coach', photo_url: `https://i.pravatar.cc/150?u=user_02`, created_at: '2023-02-20' },
  { id: 'user_03', name: 'Alice Smith (Parent)', email: 'alice.s@email.com', dob: '1988-08-08', role: 'Parent', photo_url: `https://i.pravatar.cc/150?u=user_03`, created_at: '2023-03-12' },
  { id: 'user_04', name: 'Bobby Smith', email: 'bobby.s@email.com', dob: '2015-06-30', role: 'Athlete', parent_id: 'user_03', coach_id: 'user_02', photo_url: `https://i.pravatar.cc/150?u=user_04`, created_at: '2023-03-12' },
  { id: 'user_05', name: 'Charlie Brown', email: 'charlie.b@email.com', dob: '2016-11-10', role: 'Athlete', parent_id: 'user_03', coach_id: 'user_02', photo_url: `https://i.pravatar.cc/150?u=user_05`, created_at: '2023-04-01' },
];

const initialPrograms: Program[] = [
  { id: 'prog_01', title: 'Beginner Skating', description: 'Learn fundamentals: balance, gliding, stopping.', coach_id: 'user_02', price_cents: 15000, currency: 'KES', duration_minutes: 90, skill_level: 'Beginner', capacity: 12, enrolled_count: 8, location_type: 'Outdoor', active: true, schedule: [{ day: 'Mon', time: '15:30' }, { day: 'Wed', time: '15:30' }] },
  { id: 'prog_02', title: 'Intermediate Tricks', description: 'Master ollies, shuvits, and grinds.', coach_id: 'user_02', price_cents: 20000, currency: 'KES', duration_minutes: 90, skill_level: 'Intermediate', capacity: 10, enrolled_count: 10, location_type: 'Outdoor', active: true, schedule: [{ day: 'Tue', time: '16:00' }, { day: 'Thu', time: '16:00' }] },
  { id: 'prog_03', title: 'Indoor Chess Club', description: 'Strategic thinking for all ages.', coach_id: 'user_02', price_cents: 10000, currency: 'KES', duration_minutes: 60, skill_level: 'All', capacity: 20, enrolled_count: 15, location_type: 'Indoor', active: true, schedule: [{ day: 'Fri', time: '17:00' }] }
];


// --- HELPER COMPONENTS ---

const Modal: FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }> = ({ isOpen, onClose, children, size = 'md' }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal-content modal-${size}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const Toast: FC<{ message: ToastMessage; onDismiss: (id: number) => void }> = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(message.id), 5000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className={`toast toast-${message.type}`}>
      <p>{message.message}</p>
      <button onClick={() => onDismiss(message.id)} className="toast-close-btn"><XMarkIcon /></button>
    </div>
  );
};

const RoleBadge: FC<{ role: Role }> = ({ role }) => <span className={`role-badge role-${role.toLowerCase()}`}>{role}</span>;
const SkillBadge: FC<{ level: SkillLevel }> = ({ level }) => <span className={`skill-badge skill-${level.toLowerCase()}`}>{level}</span>;


// --- MAIN FEATURE COMPONENTS ---

const AddEditUserModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  userToEdit: User | null;
  users: User[];
  addToast: (message: string, type: ToastMessage['type']) => void;
}> = ({ isOpen, onClose, onSave, userToEdit, users, addToast }) => {
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    if (userToEdit) {
      setFormData(userToEdit);
    } else {
      setFormData({
        id: `user_${String(Date.now()).slice(-4)}`,
        created_at: new Date().toISOString().split('T')[0],
        photo_url: `https://i.pravatar.cc/150?u=user_${String(Date.now()).slice(-4)}`
      });
    }
  }, [userToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...(prev as any)[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role || !formData.dob) {
      addToast('Please fill all required fields.', 'error');
      return;
    }
    onSave(formData as User);
    onClose();
  };

  const parentOptions = useMemo(() => users.filter(u => u.role === 'Parent'), [users]);
  const coachOptions = useMemo(() => users.filter(u => u.role === 'Coach'), [users]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="modal-header">
          <h3>{userToEdit ? 'Edit User Profile' : 'Add New User'}</h3>
          <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group"><label>Full Name</label><input name="name" value={formData.name || ''} onChange={handleChange} required /></div>
            <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email || ''} onChange={handleChange} required /></div>
          </div>
          <div className="form-grid">
             <div className="form-group"><label>Date of Birth</label><input type="date" name="dob" value={formData.dob || ''} onChange={handleChange} required /></div>
            <div className="form-group"><label>Role</label><select name="role" value={formData.role || ''} onChange={handleChange} required><option value="">Select Role</option><option>Admin</option><option>Coach</option><option>Parent</option><option>Athlete</option></select></div>
          </div>
          {formData.role === 'Athlete' && (
            <div className="form-grid">
              <div className="form-group"><label>Parent/Guardian</label><select name="parent_id" value={formData.parent_id || ''} onChange={handleChange}><option value="">Assign Parent</option>{parentOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              <div className="form-group"><label>Coach</label><select name="coach_id" value={formData.coach_id || ''} onChange={handleChange}><option value="">Assign Coach</option>{coachOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            </div>
          )}
          <div className="form-group"><label>Phone Number</label><input name="phone" value={formData.phone || ''} onChange={handleChange} /></div>
          <div className="form-group"><label>Address</label><input name="address" value={formData.address || ''} onChange={handleChange} /></div>
          <div className="form-grid">
            <div className="form-group"><label>Emergency Contact Name</label><input name="emergencyContact.name" value={formData.emergencyContact?.name || ''} onChange={handleChange} /></div>
            <div className="form-group"><label>Emergency Contact Phone</label><input name="emergencyContact.phone" value={formData.emergencyContact?.phone || ''} onChange={handleChange} /></div>
          </div>
          <div className="form-group"><label>Bio</label><textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows={3}></textarea></div>
          <div className="form-group"><label>Profile Photo</label><input type="file" accept="image/*" /></div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </Modal>
  );
};

const ProgramDetailsModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  coach?: User;
  onBook: (programId: string) => void;
  currentUser: User | null;
}> = ({ isOpen, onClose, program, coach, onBook, currentUser }) => {
  if (!program) return null;
  const isBookable = currentUser && ['Parent', 'Athlete'].includes(currentUser.role);
  const isFull = program.enrolled_count >= program.capacity;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="modal-header">
        <h3>{program.title}</h3>
        <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
      </div>
      <div className="modal-body program-details">
        <p>{program.description}</p>
        <p><strong>Coach:</strong> {coach?.name || 'N/A'}</p>
        <p><strong>Price:</strong> {program.currency} {program.price_cents / 100}</p>
        <p><strong>Duration:</strong> {program.duration_minutes} minutes</p>
        <p><strong>Skill Level:</strong> <SkillBadge level={program.skill_level} /></p>
        <p><strong>Location:</strong> {program.location_type}</p>
        <p><strong>Schedule:</strong> {program.schedule.map(s => `${s.day} at ${s.time}`).join(', ')}</p>
        <p><strong>Availability:</strong> {program.enrolled_count} / {program.capacity} spots filled</p>
      </div>
      <div className="modal-actions">
        {isBookable && (
          <button className="btn btn-primary" disabled={isFull} onClick={() => onBook(program.id)}>
            {isFull ? 'Program Full' : 'Book Now'}
          </button>
        )}
      </div>
    </Modal>
  );
};


const UserManagementWidget: FC<{
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onAdd: () => void;
}> = ({ users, onEdit, onDelete, onAdd }) => {
  return (
    <div className="widget widget-span-3">
      <div className="widget-header">
        <h3>User Management</h3>
        <button className="btn btn-primary btn-sm" onClick={onAdd}><UserPlusIcon /> Add User</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>User</th><th>Role</th><th>Created On</th><th>Contact</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td data-label="User"><div className="user-name-cell"><img src={user.photo_url} alt={user.name} className="table-avatar" /><span>{user.name}</span></div></td>
                <td data-label="Role"><RoleBadge role={user.role} /></td>
                <td data-label="Created On">{user.created_at}</td>
                <td data-label="Contact">{user.email}</td>
                <td data-label="Actions">
                  <div className="action-buttons">
                    <button className="btn-icon" onClick={() => onEdit(user)} aria-label={`Edit ${user.name}`}><PencilIcon /></button>
                    <button className="btn-icon" onClick={() => onDelete(user.id)} aria-label={`Delete ${user.name}`}><TrashIcon /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProgramManagementWidget: FC<{
  programs: Program[],
  users: User[],
  onViewDetails: (program: Program) => void
}> = ({ programs, users, onViewDetails }) => {
  const getCoachName = (coachId: string) => users.find(u => u.id === coachId)?.name || 'Unknown';
  
  return (
    <div className="widget widget-span-3">
      <div className="widget-header">
        <h3>Available Programs</h3>
      </div>
      <div className="program-list">
        {programs.map(p => (
          <div key={p.id} className="program-list-item">
            <h4>{p.title} <SkillBadge level={p.skill_level} /></h4>
            <p>Coach: {getCoachName(p.coach_id)} | Location: {p.location_type}</p>
            <p>Capacity: {p.enrolled_count}/{p.capacity}</p>
            <button className="btn btn-secondary btn-sm" style={{marginTop: '8px'}} onClick={() => onViewDetails(p)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- LOGIN & LAYOUT ---

const LoginScreen: FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
    return (
        <div className="login-container">
            <div className="login-box">
                <SkateIcon />
                <h1>Funspot Club</h1>
                <p>Select your portal to continue</p>
                <div className="portal-selection">
                    {initialUsers.map(user => (
                        <button key={user.id} onClick={() => onLogin(user)} className="btn btn-primary btn-full">
                            Login as {user.name} ({user.role})
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Dashboard: FC<{ 
  currentUser: User; 
  users: User[]; 
  programs: Program[];
  handleUserAdd: () => void;
  handleUserEdit: (user: User) => void;
  handleUserDelete: (userId: string) => void;
  handleProgramView: (program: Program) => void;
}> = ({ currentUser, users, programs, handleUserAdd, handleUserEdit, handleUserDelete, handleProgramView }) => {
    return (
      <>
        <h2>Welcome, {currentUser.name.split(' ')[0]}!</h2>
        <div className="dashboard-grid">
            {currentUser.role === 'Admin' && (
              <UserManagementWidget 
                users={users} 
                onAdd={handleUserAdd}
                onEdit={handleUserEdit}
                onDelete={handleUserDelete}
              />
            )}
             <ProgramManagementWidget 
                programs={programs}
                users={users}
                onViewDetails={handleProgramView}
              />
        </div>
      </>
    );
};


export const App: FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [impersonatingUser, setImpersonatingUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [programs, setPrograms] = useState<Program[]>(initialPrograms);

    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [isProgramModalOpen, setProgramModalOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    };

    const handleLogin = (user: User) => setCurrentUser(user);
    const handleLogout = () => {
        setCurrentUser(null);
        setImpersonatingUser(null);
    };

    const handleSaveUser = (user: User) => {
        const exists = users.some(u => u.id === user.id);
        if (exists) {
            setUsers(users.map(u => (u.id === user.id ? user : u)));
            addToast('User updated successfully!', 'success');
        } else {
            setUsers([...users, user]);
            addToast('User created successfully!', 'success');
        }
        setUserToEdit(null);
    };

    const handleAddUserClick = () => {
        setUserToEdit(null);
        setUserModalOpen(true);
    };

    const handleEditUserClick = (user: User) => {
        setUserToEdit(user);
        setUserModalOpen(true);
    };
    
    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== userId));
            addToast('User deleted.', 'info');
        }
    };

    const handleViewProgramDetails = (program: Program) => {
      setSelectedProgram(program);
      setProgramModalOpen(true);
    };
    
    const handleBookProgram = (programId: string) => {
        setPrograms(prev => prev.map(p => {
            if (p.id === programId && p.enrolled_count < p.capacity) {
                return {...p, enrolled_count: p.enrolled_count + 1 };
            }
            return p;
        }));
        addToast('Successfully booked program!', 'success');
        setProgramModalOpen(false);
    };

    if (!currentUser) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <>
            <div className="dashboard-layout">
                <aside className="sidebar">
                    <div className="sidebar-content">
                        <div className="sidebar-header">
                            <h3>FUNSPOT</h3>
                        </div>
                        <nav className="sidebar-nav">
                            <ul>
                                <li><a href="#" className="active">Dashboard</a></li>
                                <li><a href="#">Programs</a></li>
                                <li><a href="#">Events</a></li>
                                <li><a href="#">Payments</a></li>
                                <li><a href="#">Messages</a></li>
                            </ul>
                        </nav>
                        <div className="sidebar-footer">
                            <button onClick={handleLogout} className="btn btn-secondary btn-full">Logout</button>
                        </div>
                    </div>
                </aside>
                <div className="main-content">
                    {impersonatingUser && (
                        <div className="impersonation-banner">
                            <ExclamationTriangleIcon />
                            <span>Viewing as {impersonatingUser.name}.</span>
                            <button onClick={() => setImpersonatingUser(null)} className="btn btn-sm btn-secondary">End Impersonation</button>
                        </div>
                    )}
                    <header className="header">
                      <div className="header-content">
                        <div>{/* Header Left - Breadcrumbs, etc */}</div>
                        <div className="header-right">
                          <div className="header-user-info">
                            <span>{currentUser.name}</span>
                            <span className="user-role">{currentUser.role}</span>
                          </div>
                          <img src={currentUser.photo_url} alt={currentUser.name} className="header-avatar" />
                        </div>
                      </div>
                    </header>
                    <main className="content-area">
                        <Dashboard
                          currentUser={impersonatingUser || currentUser}
                          users={users}
                          programs={programs}
                          handleUserAdd={handleAddUserClick}
                          handleUserEdit={handleEditUserClick}
                          handleUserDelete={handleDeleteUser}
                          handleProgramView={handleViewProgramDetails}
                        />
                    </main>
                </div>
            </div>
            
            <AddEditUserModal
              isOpen={isUserModalOpen}
              onClose={() => setUserModalOpen(false)}
              onSave={handleSaveUser}
              userToEdit={userToEdit}
              users={users}
              addToast={addToast}
            />

            <ProgramDetailsModal
              isOpen={isProgramModalOpen}
              onClose={() => setProgramModalOpen(false)}
              program={selectedProgram}
              coach={users.find(u => u.id === selectedProgram?.coach_id)}
              onBook={handleBookProgram}
              currentUser={currentUser}
            />

            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast} onDismiss={id => setToasts(t => t.filter(t => t.id !== id))} />
                ))}
            </div>
        </>
    );
};
