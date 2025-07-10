export type CoachResponse = {
  status: boolean;
  message: string;
  data: CoachData;
};

export type CoachData = {
  _id: string;
  firstName: string;
  lastName: string;
  role: 'COACH';
  email: string;
  password: string;
  phoneNumber: string;
  profileImage: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string; // ISO format string
  address: string;
  specialization: string;
  description: string;
  qualification: string;
  fieldOfExperiences: string;
  yearsOfExperience: number;
  accepted: boolean;
  stripeAccountId: string | null;
  stripeOnboarded: boolean;
  servicesOffered: ServiceOffered;
  certifications: Certification[];
  skills: Skill[];
  availability: Availability[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ServiceOffered = {
  _id: string;
  icon: string;
  title: string;
  description: string;
  price: number;
  overview: string;
  overviewImage: string;
  receive: string;
  receiveImage: string;
  whom: string;
  whomImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  coaches: string[];
};

export type Certification = {
  name: string;
};

export type Skill = {
  skillName: string;
  description: string;
};

export type Availability = {
  day: string; // e.g., "Monday"
  slots: TimeSlot[];
};

export type TimeSlot = {
  startTime: string; // e.g., "11:00 AM"
  endTime: string;   // e.g., "01:00 PM"
};
