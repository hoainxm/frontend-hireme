export const FEATURES = [
  { key: 'jobPosting', label: 'Đăng tin tuyển dụng' },
  { key: 'jobSuggestions', label: 'Gợi ý công việc phù hợp' },
  { key: 'customerSupport', label: 'Hỗ trợ chăm sóc khách hàng' },
  { key: 'searchPriority', label: 'Hiển thị ưu tiên trong tìm kiếm' },
  { key: 'markApplications', label: 'Đánh dấu tin tuyển dụng ứng viên' },
  { key: 'unlimitedPosts', label: 'Không giới hạn số lượng bài đăng' },
];

export const PLAN_OPTIONS = {
  lite: {
    name: 'Gói LITE',
    jobPosting: true,
    jobSuggestions: true,
    customerSupport: false,
    searchPriority: false,
    markApplications: false,
    unlimitedPosts: false,
  },
  plus: {
    name: 'Gói PLUS',
    jobPosting: true,
    jobSuggestions: true,
    customerSupport: true,
    searchPriority: true,
    markApplications: false,
    unlimitedPosts: false,
  },
  max: {
    name: 'Gói MAX',
    jobPosting: true,
    jobSuggestions: true,
    customerSupport: true,
    searchPriority: true,
    markApplications: true,
    unlimitedPosts: true,
  },
};
