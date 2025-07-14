// src/components/chatWorkflow.ts
export type ChatStep =
  | 'welcome'
  | 'SelectBudget'
  | 'ShowBrands'
  | 'ShowCars'
  | 'ShowDetails'
  | 'ScheduleTestDrive'
  | 'contact_form'
  | 'test_drive_location'
  | 'custom_location_input'
  | 'completed';

export interface UserData {
  budget?: string;
  type?: string;
  brand?: string;
  selectedCarId?: string;
  [key: string]: any;
}

interface ChatStepConfig {
  message: string | ((data: UserData) => string);
  options?: { id: string; text: string }[];
  nextStep?: (id: string) => ChatStep;
}

export const chatWorkflow: Record<ChatStep, ChatStepConfig> = {
  welcome: {
    message: 'Welcome to AutoSherpa! What budget are you considering for your next car?',
    options: [
      { id: 'under_5L', text: 'Under ₹5 Lakhs' },
      { id: '5_10L', text: '₹5 - ₹10 Lakhs' },
      { id: '10_20L', text: '₹10 - ₹20 Lakhs' },
      { id: 'above_20L', text: 'Above ₹20 Lakhs' },
    ],
    nextStep: () => 'SelectBudget',
  },
  SelectBudget: {
    message: 'Great! What type of car are you looking for?',
    options: [
      { id: 'suv', text: 'SUV' },
      { id: 'sedan', text: 'Sedan' },
      { id: 'hatchback', text: 'Hatchback' },
    ],
    nextStep: () => 'ShowBrands',
  },
  ShowBrands: {
    message: 'Please choose from these brands:',
    options: [], // dynamically filled
    nextStep: () => 'ShowCars',
  },
  ShowCars: {
    message: 'Here are some cars based on your preferences. Tap one to view details:',
    nextStep: () => 'ShowDetails',
  },
  ShowDetails: {
    message: (data) => `Would you like to book a test drive for car ID ${data.selectedCarId}?`,
    options: [
      { id: 'yes', text: 'Yes, schedule a test drive' },
      { id: 'no', text: 'No, show other cars' },
    ],
    nextStep: (id) => (id === 'yes' ? 'ScheduleTestDrive' : 'ShowCars'),
  },
  ScheduleTestDrive: {
    message: 'Please fill out the form below to schedule your test drive.',
    nextStep: () => 'contact_form',
  },
  contact_form: {
    message: 'Thank you for providing your details!',
    nextStep: () => 'test_drive_location',
  },
  test_drive_location: {
  message: 'Lastly, please select your preferred location for the test drive:',
  options: [
    { id: 'home', text: 'Home Pickup' },
    { id: 'dealership', text: 'Nearest Dealership' },
    { id: 'office', text: 'Office Location' },
    { id: 'custom', text: 'Provide a Custom Location' }
  ],
  nextStep: (id) => (id === 'custom' ? 'custom_location_input' : 'completed'),
},

custom_location_input: {
  message: 'Please type your preferred location for the test drive:',
  nextStep: () => 'completed',
},

completed: {
  message: (data: UserData) => `
🎉 Your test drive has been successfully booked!

📍 Test Drive Details
- 🚗 Car: ${data.brand || 'Brand'} ${data.selectedCarName || 'Model'}
- 👤 Name: ${data.name || 'Customer Name'}
- 📞 Phone: ${data.phone || 'XXXXXXXXXX'}
- 🕒 Date & Time: ${data.time || 'To be confirmed'}
- 📍 Location: ${data.location || 'To be confirmed'}

📄 Please bring:
- Driving License (Original)
- Aadhaar Card / PAN Card (Photocopy)

👨‍💼 Your assigned agent:
- Name: Rahul Verma
- Phone: +91-9876543210

✅ We look forward to seeing you!
  `,
}

};
