import type { Review } from '../types';

export const mockReviews: Review[] = [
  {
    id: 'r-1', userId: 'u-1', userName: 'Vijay Rathinam', centerId: 'c-1', centerName: 'Green Earth Recycling',
    rating: 5, comment: 'Excellent facility! They handled my old laptop and phone disposal very professionally. Staff was courteous and even provided a disposal certificate.', createdAt: '2025-06-15T10:30:00Z', status: 'active',
  },
  {
    id: 'r-2', userId: 'u-2', userName: 'Priya Sharma', centerId: 'c-1', centerName: 'Green Earth Recycling',
    rating: 5, comment: 'Very well-maintained center. The process was quick and easy. They accept a wide range of electronic items. Highly recommended for responsible e-waste disposal.', createdAt: '2025-05-20T14:15:00Z', status: 'active',
  },
  {
    id: 'r-3', userId: 'u-3', userName: 'Arjun Menon', centerId: 'c-1', centerName: 'Green Earth Recycling',
    rating: 4, comment: 'Good facility with proper certifications. Wait time can be a bit long during weekends but overall a great experience.', createdAt: '2025-04-10T09:45:00Z', status: 'active',
  },
  {
    id: 'r-4', userId: 'u-5', userName: 'Deepa Venkatesh', centerId: 'c-2', centerName: 'EcoSmart Collection Hub',
    rating: 5, comment: 'Love this place! They make recycling so convenient. The staff sorts the waste right there and gives you a summary of what was collected.', createdAt: '2025-06-01T11:00:00Z', status: 'active',
  },
  {
    id: 'r-5', userId: 'u-1', userName: 'Vijay Rathinam', centerId: 'c-2', centerName: 'EcoSmart Collection Hub',
    rating: 4, comment: 'Convenient location in Gandhipuram. Easy to find and the drop-off process is straightforward. Could use more parking space though.', createdAt: '2025-05-15T16:20:00Z', status: 'active',
  },
  {
    id: 'r-6', userId: 'u-6', userName: 'Karthik Rajan', centerId: 'c-3', centerName: 'Clean India E-Waste Solutions',
    rating: 4, comment: 'Government-partnered facility so you know your waste is being handled properly. The documentation process is thorough.', createdAt: '2025-03-25T13:30:00Z', status: 'active',
  },
  {
    id: 'r-7', userId: 'u-2', userName: 'Priya Sharma', centerId: 'c-4', centerName: 'Nila Battery Recyclers',
    rating: 5, comment: 'Dropped off a bunch of old car batteries and phone batteries. They weighed everything and gave a proper receipt. Very professional setup.', createdAt: '2025-06-10T10:15:00Z', status: 'active',
  },
  {
    id: 'r-8', userId: 'u-3', userName: 'Arjun Menon', centerId: 'c-4', centerName: 'Nila Battery Recyclers',
    rating: 4, comment: 'Specialized battery recycling is hard to find. Glad this place exists. They know what they are doing with hazardous battery waste.', createdAt: '2025-05-28T15:45:00Z', status: 'active',
  },
  {
    id: 'r-9', userId: 'u-5', userName: 'Deepa Venkatesh', centerId: 'c-5', centerName: 'RS Puram Recycle Point',
    rating: 3, comment: 'Decent community recycling point but could be better organized. The timings are a bit limited and they only take plastic and general recyclables.', createdAt: '2025-04-18T12:00:00Z', status: 'active',
  },
  {
    id: 'r-10', userId: 'u-1', userName: 'Vijay Rathinam', centerId: 'c-6', centerName: 'TechWaste India Pvt Ltd',
    rating: 5, comment: 'The best e-waste recycling facility I have visited. Industrial-grade equipment, proper certifications, and very knowledgeable staff. Worth the drive to Kurichi.', createdAt: '2025-06-20T09:30:00Z', status: 'active',
  },
  {
    id: 'r-11', userId: 'u-2', userName: 'Priya Sharma', centerId: 'c-6', centerName: 'TechWaste India Pvt Ltd',
    rating: 5, comment: 'Brought in a lot of old office equipment from our company. They provided bulk disposal services and proper documentation for CSR reporting.', createdAt: '2025-06-05T14:00:00Z', status: 'active',
  },
  {
    id: 'r-12', userId: 'u-3', userName: 'Arjun Menon', centerId: 'c-6', centerName: 'TechWaste India Pvt Ltd',
    rating: 5, comment: 'ISO certified facility with top-notch processing. They even showed me how they separate and recover precious metals from circuit boards. Fascinating!', createdAt: '2025-05-22T11:15:00Z', status: 'active',
  },
  {
    id: 'r-13', userId: 'u-6', userName: 'Karthik Rajan', centerId: 'c-7', centerName: 'Kovai Green Collect',
    rating: 4, comment: 'Nice neighborhood collection center. Part of a good initiative to keep Coimbatore clean. Simple process for dropping off plastic waste.', createdAt: '2025-04-30T10:45:00Z', status: 'active',
  },
  {
    id: 'r-14', userId: 'u-5', userName: 'Deepa Venkatesh', centerId: 'c-8', centerName: 'EnviroSafe Disposals',
    rating: 4, comment: 'Handles hazardous waste very carefully. The staff wear proper protective equipment and follow safety protocols. Good to see responsible waste management.', createdAt: '2025-05-10T13:20:00Z', status: 'active',
  },
  {
    id: 'r-15', userId: 'u-1', userName: 'Vijay Rathinam', centerId: 'c-8', centerName: 'EnviroSafe Disposals',
    rating: 5, comment: 'Took some old UPS batteries here. They have proper acid neutralization setup and ensure no environmental contamination. Trustworthy facility.', createdAt: '2025-03-15T09:00:00Z', status: 'active',
  },
  {
    id: 'r-16', userId: 'u-2', userName: 'Priya Sharma', centerId: 'c-9', centerName: 'Sulur Plastic Exchange',
    rating: 3, comment: 'They buy plastic by weight which is a nice incentive. However, they are quite far and only accept sorted clean plastic. Limited timings too.', createdAt: '2025-04-22T11:30:00Z', status: 'active',
  },
  {
    id: 'r-17', userId: 'u-3', userName: 'Arjun Menon', centerId: 'c-10', centerName: 'Zero Waste Coimbatore',
    rating: 5, comment: 'Amazing community initiative! They accept everything and the awareness programs they conduct are very educational. My kids learned so much about recycling.', createdAt: '2025-06-18T15:00:00Z', status: 'active',
  },
  {
    id: 'r-18', userId: 'u-5', userName: 'Deepa Venkatesh', centerId: 'c-10', centerName: 'Zero Waste Coimbatore',
    rating: 5, comment: 'This is what every city needs. Open long hours, accepts all kinds of waste, and run by passionate people who care about the environment.', createdAt: '2025-06-12T10:00:00Z', status: 'active',
  },
  {
    id: 'r-19', userId: 'u-6', userName: 'Karthik Rajan', centerId: 'c-10', centerName: 'Zero Waste Coimbatore',
    rating: 4, comment: 'Great concept and well-managed center. Weekend workshops are worth attending. Only suggestion is to add more collection bins outside for quick drops.', createdAt: '2025-05-30T16:30:00Z', status: 'active',
  },
  {
    id: 'r-20', userId: 'u-1', userName: 'Vijay Rathinam', centerId: 'c-10', centerName: 'Zero Waste Coimbatore',
    rating: 5, comment: 'My go-to recycling center in Coimbatore. The Bharathiar Road location is very accessible and the long operating hours make it convenient for working professionals.', createdAt: '2025-06-25T08:45:00Z', status: 'active',
  },
];
