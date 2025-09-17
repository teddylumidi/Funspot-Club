
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
  skill_level?: SkillLevel;
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

interface Transaction {
  id: string;
  userId: string;
  programId: string;
  amount_cents: number;
  currency: string;
  method: 'Card' | 'Mpesa';
  status: 'Completed';
  created_at: string;
}

interface AppNotification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'payment' | 'event' | 'message' | 'exam' | 'system';
}

type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};

interface ClubEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
}

interface TrainingReport {
    id: string;
    athlete_id: string;
    date: string; // YYYY-MM-DD
    score: number; // 1-100
    notes: string;
}

// --- SVG ICONS ---
const EyeIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-7.532a1.012 1.012 0 0 1 1.638 0l4.43 7.532a1.012 1.012 0 0 1 0 .639l-4.43 7.532a1.012 1.012 0 0 1-1.638 0l-4.43-7.532Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const UserPlusIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0 0 15 0h-15Z" /></svg>;
const PencilIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const TrashIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const XMarkIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const ExclamationTriangleIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>;
const SkateIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2c-1.42 0-2.84.4-4.24 1.2L16 2.29V2a1 1 0 0 0-2 0v1.29l-1.76-1.09C10.84.4 9.42 0 8 0 5.25 0 3 2.25 3 5c0 1.42.4 2.84 1.2 4.24L2.29 11H2a1 1 0 0 0 0 2h1.29l-1.09 1.76C.4 16.16 0 17.58 0 19c0 2.75 2.25 5 5 5 1.42 0 2.84-.4 4.24-1.2L11 21.71V22a1 1 0 0 0 2 0v-1.29l1.76 1.09c1.4.8 2.82 1.2 4.24 1.2 2.75 0 5-2.25 5-5 0-1.42-.4-2.84-1.2-4.24L21.71 13H22a1 1 0 0 0 0-2h-1.29l1.09-1.76C23.6 7.84 24 6.42 24 5c0-2.75-2.25-5-5-5zM9 19c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm6 0c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" /></svg>;
const BellIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>;
const CreditCardIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 21Z" /></svg>;
const PhoneIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>;
const CheckCircleIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;


// --- MOCK DATA ---
const initialUsers: User[] = [
  { id: 'user_01', name: 'Admin User', email: 'admin@funspot.com', dob: '1985-01-15', role: 'Admin', photo_url: `https://i.pravatar.cc/150?u=user_01`, created_at: '2023-01-10' },
  { id: 'user_02', name: 'Coach Davis', email: 'coach.d@funspot.com', dob: '1990-05-20', role: 'Coach', photo_url: `https://i.pravatar.cc/150?u=user_02`, created_at: '2023-02-20' },
  { id: 'user_03', name: 'Alice Smith (Parent)', email: 'alice.s@email.com', dob: '1988-08-08', role: 'Parent', photo_url: `https://i.pravatar.cc/150?u=user_03`, created_at: '2023-03-12' },
  { id: 'user_04', name: 'Bobby Smith', email: 'bobby.s@email.com', dob: '2015-06-30', role: 'Athlete', parent_id: 'user_03', coach_id: 'user_02', photo_url: `https://i.pravatar.cc/150?u=user_04`, created_at: '2023-03-12', skill_level: 'Beginner' },
  { id: 'user_05', name: 'Charlie Brown', email: 'charlie.b@email.com', dob: '2016-11-10', role: 'Athlete', parent_id: 'user_03', coach_id: 'user_02', photo_url: `https://i.pravatar.cc/150?u=user_05`, created_at: '2023-04-01', skill_level: 'Intermediate' },
];

const initialPrograms: Program[] = [
  { id: 'prog_01', title: 'Beginner Skating', description: 'Learn fundamentals: balance, gliding, stopping.', coach_id: 'user_02', price_cents: 15000, currency: 'KES', duration_minutes: 90, skill_level: 'Beginner', capacity: 12, enrolled_count: 8, location_type: 'Outdoor', active: true, schedule: [{ day: 'Mon', time: '15:30' }, { day: 'Wed', time: '15:30' }] },
  { id: 'prog_02', title: 'Intermediate Tricks', description: 'Master ollies, shuvits, and grinds.', coach_id: 'user_02', price_cents: 20000, currency: 'KES', duration_minutes: 90, skill_level: 'Intermediate', capacity: 10, enrolled_count: 10, location_type: 'Outdoor', active: true, schedule: [{ day: 'Tue', time: '16:00' }, { day: 'Thu', time: '16:00' }] },
  { id: 'prog_03', title: 'Indoor Chess Club', description: 'Strategic thinking for all ages.', coach_id: 'user_02', price_cents: 10000, currency: 'KES', duration_minutes: 60, skill_level: 'All', capacity: 20, enrolled_count: 15, location_type: 'Indoor', active: true, schedule: [{ day: 'Fri', time: '17:00' }] }
];

const initialNotifications: AppNotification[] = [
    { id: 1, message: 'Welcome to Funspot Club! Your dashboard is ready.', timestamp: '1 day ago', read: true, type: 'system' },
    { id: 2, message: 'Coach Davis posted new exam results for Intermediate Tricks.', timestamp: '2 days ago', read: false, type: 'exam' }
];

const mockEvents: ClubEvent[] = (() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // getMonth() is 0-indexed
    const monthStr = month.toString().padStart(2, '0');
    return [
        { id: 'evt_01', title: 'Skate Jam', date: `${year}-${monthStr}-15` },
        { id: 'evt_02', title: 'Club Photoshoot', date: `${year}-${monthStr}-22` },
        { id: 'evt_03', title: 'End of Month BBQ', date: `${year}-${monthStr}-28` },
    ];
})();


const mockTrainingReports: TrainingReport[] = [
    { id: 'tr_01', athlete_id: 'user_04', date: '2024-03-15', score: 65, notes: 'Good balance.' },
    { id: 'tr_02', athlete_id: 'user_04', date: '2024-04-15', score: 72, notes: 'Improving speed.' },
    { id: 'tr_03', athlete_id: 'user_04', date: '2024-05-15', score: 78, notes: 'Better turns.' },
    { id: 'tr_04', athlete_id: 'user_04', date: '2024-06-15', score: 85, notes: 'Consistent performance.' },
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (userToEdit) {
      setFormData(userToEdit);
      setImagePreview(userToEdit.photo_url);
    } else {
      const newUserId = `user_${String(Date.now()).slice(-4)}`;
      const newPhotoUrl = `https://i.pravatar.cc/150?u=${newUserId}`;
      setFormData({
        id: newUserId,
        created_at: new Date().toISOString().split('T')[0],
        photo_url: newPhotoUrl,
      });
      setImagePreview(newPhotoUrl);
    }
  }, [userToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
            ...(prev[parent as keyof typeof prev] as object || {}),
            [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setImagePreview(result);
            setFormData(prev => ({ ...prev, photo_url: result }));
        };
        reader.readAsDataURL(file);
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
              <div className="form-group"><label>Skill Level</label><select name="skill_level" value={formData.skill_level || ''} onChange={handleChange}><option value="">Select Level</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
            </div>
          )}
          <div className="form-group"><label>Phone Number</label><input name="phone" value={formData.phone || ''} onChange={handleChange} /></div>
          <div className="form-group"><label>Address</label><input name="address" value={formData.address || ''} onChange={handleChange} /></div>
          <div className="form-grid">
            <div className="form-group"><label>Emergency Contact Name</label><input name="emergencyContact.name" value={formData.emergencyContact?.name || ''} onChange={handleChange} /></div>
            <div className="form-group"><label>Emergency Contact Phone</label><input name="emergencyContact.phone" value={formData.emergencyContact?.phone || ''} onChange={handleChange} /></div>
          </div>
          <div className="form-group"><label>Bio</label><textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows={3}></textarea></div>
          <div className="form-group">
            <label>Profile Photo</label>
            <div className="photo-upload-container">
                {imagePreview && <img src={imagePreview} alt="Profile Preview" className="profile-preview" />}
                <input type="file" accept="image/*" onChange={handleImageChange}/>
            </div>
          </div>
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
  onBook: (program: Program) => void;
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
          <button className="btn btn-primary" disabled={isFull} onClick={() => onBook(program)}>
            {isFull ? 'Program Full' : 'Book Now'}
          </button>
        )}
      </div>
    </Modal>
  );
};

const PaymentModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  onConfirmPayment: (method: 'Card' | 'Mpesa') => void;
}> = ({ isOpen, onClose, program, onConfirmPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Mpesa'>('Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const handlePayment = (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);
      setError('');
      // Simulate API call
      setTimeout(() => {
          // Simulate a random failure for demonstration
          if (Math.random() < 0.1) {
              setError('Payment failed. Please try again.');
              setIsProcessing(false);
          } else {
              onConfirmPayment(paymentMethod);
              setIsProcessing(false);
          }
      }, 2000);
  };
  
  if (!program) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handlePayment}>
        <div className="modal-header">
          <h3>Complete Your Booking</h3>
          <button type="button" className="btn-icon" onClick={onClose}><XMarkIcon /></button>
        </div>
        <div className="modal-body">
            <div className="payment-summary">
                <h4>{program.title}</h4>
                <p className="price">{program.currency} {program.price_cents / 100}</p>
            </div>
            <div className="payment-tabs">
                <button type="button" className={paymentMethod === 'Card' ? 'active' : ''} onClick={() => setPaymentMethod('Card')}><CreditCardIcon /> Card</button>
                <button type="button" className={paymentMethod === 'Mpesa' ? 'active' : ''} onClick={() => setPaymentMethod('Mpesa')}><PhoneIcon/> Mpesa</button>
            </div>
            {paymentMethod === 'Card' ? (
                <div className="payment-form">
                    <div className="form-group"><label>Card Number</label><input placeholder="0000 0000 0000 0000" required/></div>
                    <div className="form-grid">
                        <div className="form-group"><label>Expiry</label><input placeholder="MM/YY" required /></div>
                        <div className="form-group"><label>CVV</label><input placeholder="123" required /></div>
                    </div>
                </div>
            ) : (
                <div className="payment-form">
                    <div className="form-group"><label>Mpesa Phone Number</label><input placeholder="e.g., 254712345678" required /></div>
                    <p className="mpesa-instructions">You will receive an STK push on your phone to complete the payment.</p>
                </div>
            )}
            {error && <p className="form-error">{error}</p>}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isProcessing}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : `Pay ${program.currency} ${program.price_cents / 100}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};


const UserManagementWidget: FC<{
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onAdd: () => void;
}> = ({ users, onEdit, onDelete, onAdd }) => {
  const [filter, setFilter] = useState<Role | 'All'>('All');

  const filteredUsers = useMemo(() => {
    if (filter === 'All') return users;
    return users.filter(user => user.role === filter);
  }, [filter, users]);

  return (
    <div className="widget widget-span-3">
      <div className="widget-header">
        <h3>User Management</h3>
        <div className="widget-controls">
            <select value={filter} onChange={e => setFilter(e.target.value as Role | 'All')}>
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Coach">Coach</option>
                <option value="Parent">Parent</option>
                <option value="Athlete">Athlete</option>
            </select>
            <button className="btn btn-primary btn-sm" onClick={onAdd}><UserPlusIcon /> Add User</button>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>User</th><th>Role</th><th>Created On</th><th>Contact</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
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
  
  const getProgramItemClass = (p: Program) => {
    const percentage = p.capacity > 0 ? (p.enrolled_count / p.capacity) * 100 : 0;
    if (percentage === 100) return 'program-list-item full';
    if (percentage > 75) return 'program-list-item nearing-capacity';
    return 'program-list-item';
  }

  return (
    <div className="widget widget-span-3">
      <div className="widget-header">
        <h3>Available Programs</h3>
      </div>
      <div className="program-list">
        {programs.map(p => (
          <div key={p.id} className={getProgramItemClass(p)}>
            <div className="program-item-header">
                <h4>{p.title} <SkillBadge level={p.skill_level} /></h4>
                {p.enrolled_count / p.capacity > 0.75 && p.enrolled_count < p.capacity && <span className="capacity-warning">Filling up fast!</span>}
                {p.enrolled_count >= p.capacity && <span className="capacity-full">Full</span>}
            </div>
            <p>Coach: {getCoachName(p.coach_id)} | Location: {p.location_type}</p>
            <p>Capacity: {p.enrolled_count}/{p.capacity}</p>
            <button className="btn btn-secondary btn-sm" style={{marginTop: '8px'}} onClick={() => onViewDetails(p)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const TransactionLogWidget: FC<{ transactions: Transaction[], users: User[], programs: Program[] }> = ({ transactions, users, programs }) => {
    const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'N/A';
    const getProgramName = (id: string) => programs.find(p => p.id === id)?.title || 'N/A';

    return (
        <div className="widget widget-span-3">
            <div className="widget-header"><h3>Transaction Log</h3></div>
            <div className="table-container">
                <table>
                    <thead><tr><th>Date</th><th>User</th><th>Program</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id}>
                                <td data-label="Date">{t.created_at}</td>
                                <td data-label="User">{getUserName(t.userId)}</td>
                                <td data-label="Program">{getProgramName(t.programId)}</td>
                                <td data-label="Amount">{t.currency} {t.amount_cents / 100}</td>
                                <td data-label="Method">{t.method}</td>
                                <td data-label="Status"><span className="status-completed">{t.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AnalyticsWidget: FC<{users: User[], transactions: Transaction[], programs: Program[]}> = ({ users, transactions, programs }) => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount_cents, 0) / 100;
    const totalEnrollments = programs.reduce((sum, p) => sum + p.enrolled_count, 0);
    const roleCounts = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {} as Record<Role, number>);

    return (
        <div className="widget widget-span-3">
            <div className="widget-header"><h3>Club Analytics</h3></div>
            <div className="analytics-grid">
                <div className="stat-card"><h4>Total Revenue</h4><p>KES {totalRevenue.toLocaleString()}</p></div>
                <div className="stat-card"><h4>Total Enrollments</h4><p>{totalEnrollments}</p></div>
                <div className="stat-card"><h4>Total Users</h4><p>{users.length}</p></div>
                <div className="stat-card">
                    <h4>User Roles</h4>
                    <div className="role-breakdown">
                        {Object.entries(roleCounts).map(([role, count]) => <span key={role}>{role}: {count}</span>)}
                    </div>
                </div>
            </div>
        </div>
    );
};


const NotificationsWidget: FC<{ notifications: AppNotification[], onMarkAsRead: (id: number) => void }> = ({ notifications, onMarkAsRead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="notifications-widget" ref={widgetRef}>
            <button className="btn-icon" onClick={() => setIsOpen(!isOpen)}>
                <BellIcon />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            {isOpen && (
                <div className="notifications-dropdown">
                    <div className="dropdown-header"><h4>Notifications</h4></div>
                    <div className="dropdown-content">
                        {notifications.length === 0 ? <p className="no-notifications">No new notifications</p> :
                        notifications.map(n => (
                            <div key={n.id} className={`notification-item ${n.read ? 'read' : ''}`} onClick={() => onMarkAsRead(n.id)}>
                                <div className="notification-icon"><CheckCircleIcon/></div>
                                <div className="notification-body">
                                    <p>{n.message}</p>
                                    <span>{n.timestamp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const EventsCalendarWidget: FC<{ events: ClubEvent[] }> = ({ events }) => {
    const [date, setDate] = useState(new Date());

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0=Sun, 1=Mon
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const eventsByDay = useMemo(() => {
        const map = new Map<number, ClubEvent[]>();
        events.forEach(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            if(eventDate.getMonth() === date.getMonth() && eventDate.getFullYear() === date.getFullYear()){
                const day = eventDate.getDate();
                if (!map.has(day)) map.set(day, []);
                map.get(day)!.push(event);
            }
        });
        return map;
    }, [events, date]);

    const calendarDays = [];
    // Adjust for Sunday start
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const isEventDay = eventsByDay.has(day);
        calendarDays.push(
            <div key={day} className={`calendar-day ${isEventDay ? 'event-day' : ''}`}>
                {day}
            </div>
        );
    }

    return (
        <div className="widget widget-span-1">
            <div className="widget-header"><h3>{monthName} {year}</h3></div>
            <div className="calendar-grid">
                <div className="calendar-header">Mon</div>
                <div className="calendar-header">Tue</div>
                <div className="calendar-header">Wed</div>
                <div className="calendar-header">Thu</div>
                <div className="calendar-header">Fri</div>
                <div className="calendar-header">Sat</div>
                <div className="calendar-header">Sun</div>
                {calendarDays}
            </div>
        </div>
    );
};

const AthleteProgressWidget: FC<{ reports: TrainingReport[], athleteId: string }> = ({ reports, athleteId }) => {
    const athleteReports = reports.filter(r => r.athlete_id === athleteId);
    
    return (
        <div className="widget widget-span-2">
            <div className="widget-header"><h3>Progress Tracker</h3></div>
            {athleteReports.length > 0 ? (
                 <div className="progress-chart">
                    {athleteReports.map(report => (
                        <div key={report.id} className="chart-bar-wrapper">
                            <div className="chart-bar" style={{ height: `${report.score}%` }} title={`Score: ${report.score}`}></div>
                            <div className="chart-label">{new Date(report.date).toLocaleString('default', {month: 'short'})}</div>
                        </div>
                    ))}
                </div>
            ) : <p>No training reports available yet.</p>}
        </div>
    );
};

const ParentPaymentsWidget: FC<{}> = () => {
    // Mock data for demonstration
    const totalPaid = 35000;
    const outstanding = 5000;

    return (
        <div className="widget widget-span-1">
             <div className="widget-header"><h3>Financial Overview</h3></div>
             <div className="payments-overview-grid">
                <div className="stat-card">
                    <h4>Total Paid</h4>
                    <p>KES {totalPaid.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h4>Outstanding</h4>
                    <p className="outstanding">KES {outstanding.toLocaleString()}</p>
                </div>
             </div>
        </div>
    );
}

const AthleteProfileWidget: FC<{athlete: User}> = ({athlete}) => {
    return (
        <div className="widget widget-span-1">
            <div className="widget-header"><h3>My Profile</h3></div>
            <div className="athlete-profile-widget">
                <img src={athlete.photo_url} alt={athlete.name}/>
                <h4>{athlete.name}</h4>
                {athlete.skill_level && <SkillBadge level={athlete.skill_level} />}
            </div>
        </div>
    )
}

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
  transactions: Transaction[];
  events: ClubEvent[];
  trainingReports: TrainingReport[];
  handleUserAdd: () => void;
  handleUserEdit: (user: User) => void;
  handleUserDelete: (userId: string) => void;
  handleProgramView: (program: Program) => void;
}> = ({ currentUser, users, programs, transactions, events, trainingReports, handleUserAdd, handleUserEdit, handleUserDelete, handleProgramView }) => {
    const isParent = currentUser.role === 'Parent';
    const isAthlete = currentUser.role === 'Athlete';
    const isCoach = currentUser.role === 'Coach';
    
    return (
      <>
        <h2>Welcome, {currentUser.name.split(' ')[0]}!</h2>
        <div className="dashboard-grid">
            {currentUser.role === 'Admin' && (
              <>
                <AnalyticsWidget users={users} transactions={transactions} programs={programs} />
                <UserManagementWidget 
                  users={users} 
                  onAdd={handleUserAdd}
                  onEdit={handleUserEdit}
                  onDelete={handleUserDelete}
                />
                <TransactionLogWidget transactions={transactions} users={users} programs={programs}/>
              </>
            )}
            
            {isParent && <ParentPaymentsWidget />}
            {isAthlete && <AthleteProfileWidget athlete={currentUser} />}

            <EventsCalendarWidget events={events} />

            {(isAthlete || isParent || isCoach) && (
                <AthleteProgressWidget reports={trainingReports} athleteId={'user_04'} />
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
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [isProgramModalOpen, setProgramModalOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Simulate real-time notifications from a WebSocket
    useEffect(() => {
        const interval = setInterval(() => {
            const messages = [
                'A new session for Beginner Skating has been added.',
                'Maintenance alert: The indoor rink will be closed this Sunday.',
                'Don\'t forget to sign up for the Summer Skate Jam!',
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            addNotification(randomMessage, 'system');
        }, 30000); // Every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    };
    
    const addNotification = (message: string, type: AppNotification['type']) => {
        const newNotification: AppNotification = {
            id: Date.now(),
            message,
            type,
            read: false,
            timestamp: 'Just now'
        };
        setNotifications(prev => [newNotification, ...prev]);
    }

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
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setUsers(users.filter(u => u.id !== userId));
            addToast('User has been deleted.', 'info');
        }
    };

    const handleViewProgramDetails = (program: Program) => {
      setSelectedProgram(program);
      setProgramModalOpen(true);
    };
    
    const handleInitiateBooking = (program: Program) => {
        setSelectedProgram(program);
        setProgramModalOpen(false);
        setPaymentModalOpen(true);
    }
    
    const handleConfirmPayment = (method: 'Card' | 'Mpesa') => {
        if (!selectedProgram || !currentUser) return;

        // Update program enrollment
        setPrograms(prev => prev.map(p => {
            if (p.id === selectedProgram.id) {
                return {...p, enrolled_count: p.enrolled_count + 1 };
            }
            return p;
        }));
        
        // Create transaction record
        const newTransaction: Transaction = {
            id: `txn_${Date.now()}`,
            userId: currentUser.id,
            programId: selectedProgram.id,
            amount_cents: selectedProgram.price_cents,
            currency: selectedProgram.currency,
            method,
            status: 'Completed',
            created_at: new Date().toISOString().split('T')[0]
        };
        setTransactions(prev => [newTransaction, ...prev]);

        addToast(`Successfully booked ${selectedProgram.title}!`, 'success');
        addNotification(`Your payment for ${selectedProgram.title} was successful.`, 'payment');
        
        setPaymentModalOpen(false);
        setSelectedProgram(null);
    };

    const handleMarkNotificationAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
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
                          <NotificationsWidget notifications={notifications} onMarkAsRead={handleMarkNotificationAsRead} />
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
                          transactions={transactions}
                          events={mockEvents}
                          trainingReports={mockTrainingReports}
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
              onBook={handleInitiateBooking}
              currentUser={currentUser}
            />
            
            <PaymentModal 
              isOpen={isPaymentModalOpen}
              onClose={() => { setPaymentModalOpen(false); setSelectedProgram(null); }}
              program={selectedProgram}
              onConfirmPayment={handleConfirmPayment}
            />

            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast} onDismiss={id => setToasts(t => t.filter(t => t.id !== id))} />
                ))}
            </div>
        </>
    );
};
