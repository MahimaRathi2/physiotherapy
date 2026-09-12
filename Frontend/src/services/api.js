const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

// Helper for standard JSON fetch requests
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem("satya_token");
  
  const headers = {
    ...options.headers
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include"
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "API Request Failed");
    }
    return data;
  } catch (err) {
    if (err.message === "Failed to fetch") {
      throw new Error("Unable to connect to backend server. Please verify backend is running on http://localhost:5000");
    }
    throw err;
  }
}

export const api = {
  // Public APIs
  getServices: (query = "") => fetchAPI(`/public/services${query}`),
  getServiceBySlug: (slug) => fetchAPI(`/public/services/${slug}`),
  getDoctors: (search = "", specialization = "all") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (specialization && specialization !== "all") params.append("specialization", specialization);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return fetchAPI(`/public/doctors${queryString}`);
  },
  getTestimonials: () => fetchAPI("/public/testimonials"),
  getFAQs: () => fetchAPI("/public/faqs"),
  getClinicInfo: () => fetchAPI("/public/clinic-info"),
  getBlogs: () => fetchAPI("/public/blogs"),
  getBlogBySlug: (slug) => fetchAPI(`/public/blogs/${slug}`),

  // Auth APIs
  register: (userData) => fetchAPI("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  login: (credentials) => fetchAPI("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  logout: () => fetchAPI("/auth/logout", { method: "POST" }),
  getMe: () => fetchAPI("/auth/me"),
  updateProfile: (profileData) => fetchAPI("/auth/profile", { method: "PUT", body: JSON.stringify(profileData) }),
  changePassword: (passwordData) => fetchAPI("/auth/change-password", { method: "PUT", body: JSON.stringify(passwordData) }),

  // Inquiries & Appointments APIs
  submitInquiry: (inquiryData) => fetchAPI("/inquiries", { method: "POST", body: JSON.stringify(inquiryData) }),
  createAppointment: (appointmentData) => fetchAPI("/appointments", { method: "POST", body: JSON.stringify(appointmentData) }),
  getMyAppointments: () => fetchAPI("/appointments/my-appointments"),
  cancelAppointment: (id) => fetchAPI(`/appointments/${id}/cancel`, { method: "PUT" }),

  // Online Consultation Requests API (supports FormData for Medical Report upload)
  createOnlineConsultation: (formData) => fetchAPI("/online-consultations", { method: "POST", body: formData }),
  getMyOnlineConsultations: () => fetchAPI("/online-consultations/my-consultations"),

  // Notifications API
  getNotifications: () => fetchAPI("/notifications"),
  markNotificationRead: (id) => fetchAPI(`/notifications/${id}/read`, { method: "PUT" }),

  // Doctor / Physiotherapist APIs
  getDoctorProfile: () => fetchAPI("/doctor/profile"),
  updateDoctorProfile: (data) => fetchAPI("/doctor/profile", { method: "PUT", body: JSON.stringify(data) }),
  getDoctorAppointments: () => fetchAPI("/doctor/appointments"),
  updateAppointmentStatus: (id, status, note = "") => fetchAPI(`/doctor/appointments/${id}/status`, { method: "PUT", body: JSON.stringify({ status, note }) }),
  rescheduleDoctorAppointment: (id, date, timeSlot) => fetchAPI(`/doctor/appointments/${id}/reschedule`, { method: "PUT", body: JSON.stringify({ date, timeSlot }) }),
  updatePaymentStatus: (id, paymentStatus) => fetchAPI(`/doctor/appointments/${id}/payment`, { method: "PUT", body: JSON.stringify({ paymentStatus }) }),

  // Admin APIs
  getAdminStats: () => fetchAPI("/admin/stats"),
  getAdminAppointments: () => fetchAPI("/admin/appointments"),
  updateAdminAppointmentStatus: (id, status, note = "") => fetchAPI(`/admin/appointments/${id}/status`, { method: "PUT", body: JSON.stringify({ status, note }) }),
  updateAdminPaymentStatus: (id, paymentStatus) => fetchAPI(`/admin/appointments/${id}/payment`, { method: "PUT", body: JSON.stringify({ paymentStatus }) }),
  getAdminDoctors: () => fetchAPI("/admin/doctors"),
  verifyDoctor: (id) => fetchAPI(`/admin/doctors/${id}/verify`, { method: "PUT" }),
  createAdminDoctor: (doctorData) => fetchAPI("/admin/doctors", { method: "POST", body: JSON.stringify(doctorData) }),
  getAdminUsers: () => fetchAPI("/admin/users"),
  updateUserRole: (id, role) => fetchAPI(`/admin/users/${id}/role`, { method: "PUT", body: JSON.stringify({ role }) }),
  getAdminServices: () => fetchAPI("/admin/services"),
  createAdminService: (serviceData) => fetchAPI("/admin/services", { method: "POST", body: JSON.stringify(serviceData) }),
  deleteAdminService: (id) => fetchAPI(`/admin/services/${id}`, { method: "DELETE" }),
  getAdminOnlineConsultations: () => fetchAPI("/admin/online-consultations"),
  getAdminTestimonials: () => fetchAPI("/admin/testimonials"),
  createAdminTestimonial: (data) => fetchAPI("/admin/testimonials", { method: "POST", body: JSON.stringify(data) }),
  deleteAdminTestimonial: (id) => fetchAPI(`/admin/testimonials/${id}`, { method: "DELETE" }),
  getAdminInquiries: () => fetchAPI("/admin/inquiries"),
  getSystemSettings: () => fetchAPI("/admin/settings"),
  updateSystemSettings: (data) => fetchAPI("/admin/settings", { method: "PUT", body: JSON.stringify(data) }),
  getAdminBlogs: () => fetchAPI("/admin/blogs"),
  createAdminBlog: (data) => fetchAPI("/admin/blogs", { method: "POST", body: JSON.stringify(data) }),
  updateAdminBlog: (id, data) => fetchAPI(`/admin/blogs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAdminBlog: (id) => fetchAPI(`/admin/blogs/${id}`, { method: "DELETE" })
};
