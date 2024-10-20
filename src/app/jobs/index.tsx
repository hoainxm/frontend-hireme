import React, { FC, HTMLAttributes, useEffect, useState, useTransition } from 'react';
import MainLayout from '../../common/ui/layout/main-layout';
import { PageName, SectionID } from '../../models/enum';
import { useDispatch } from 'react-redux';
import { updateSectionDot } from '@layout/slice';
import { BackToTop } from '@base/button/BackToTop';
import { useTranslation } from 'react-i18next';
import style from './jobs.module.scss';
import JobFilter from './components/JobFilter';
import JobList from './components/JobList';
import JobDetail from './components/JobDetail';
import { mockJobs } from '../../app/jobs/jobData';
import { PartnerSection } from '../../app/home/PartnerSection';
import { UpdateSection } from '../../app/home/UpdateSection';
import { Job } from '../jobs/model';

interface Props extends HTMLAttributes<HTMLDivElement> {
  sectionId: string;
  currentPage: number;
}

export const Jobs: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { sectionId } = props;
  const { t } = useTranslation();

  const scrollToTop = () => {
    dispatch(updateSectionDot(SectionID.HOME_BANNER));
  };

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  const handleFilter = (filters: any) => {
    let filtered = jobs;

    if (filters.location) {
      filtered = filtered.filter((job) => job.location.includes(filters.location));
    }

    if (filters.level) {
      filtered = filtered.filter((job) => job.level === filters.level);
    }

    if (filters.minSalary) {
      filtered = filtered.filter((job) => job.salary >= filters.minSalary);
    }

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter((job) => filters.skills.every((skill: string) => job.skills.includes(skill)));
    }

    setFilteredJobs(filtered);
  };

  const mockJobData = {
    name: 'Tuyển NestJS công ty Product Nhật Bản',
    skills: ['Node.JS', 'Nest.JS', 'MongoDB'],
    company: {
      _id: '647b65a7464dc26d92730e4c',
      name: 'Tây Nguyên 12',
      logo: 'https://example.com/company-logo.png',
      industry: 'Công nghệ thông tin',
      size: '10-24 nhân viên',
      address: 'Hồ Chí Minh',
    },
    location: 'Hồ Chí Minh',
    salary: 15000000,
    quantity: 10,
    level: 'FRESHER',
    experience: 'Không yêu cầu kinh nghiệm',
    employmentType: 'Toàn thời gian',
    genderRequirement: 'Không yêu cầu',
    description:
      'Công ty Tây Nguyên 12 đang tìm kiếm lập trình viên NestJS làm việc tại Hồ Chí Minh. Với yêu cầu về các kỹ năng Node.JS, Nest.JS, và MongoDB, vị trí này phù hợp với các ứng viên cấp độ Fresher mong muốn học hỏi và phát triển trong môi trường sản phẩm.',
    jobRequirement: [
      '1. Hoạch định:',
      '● Phối hợp với BOD xây dựng và triển khai tầm nhìn, sứ mệnh, giá trị cốt lõi, mục tiêu, chiến lược dài hạn',
      '● Điều hành các bộ phận để xây dựng mục tiêu, chỉ tiêu cho từng bộ phận đảm bảo hoàn thành mục tiêu chung của công ty.',
      '',
      '2. Quản trị:',
      '● Phân tích, điều chỉnh và đưa ra chiến lược phù hợp để đạt được mục tiêu của chung của công ty;',
      '● Xây dựng hệ thống quy trình quy định cấp công ty',
      '● Chịu trách nhiệm về các mặt hoạt động của công ty trước CEO',
      '',
      '3. Marketing:',
      '● Hướng dẫn và quản lý việc xây dựng chiến lược, mục tiêu marketing dài và ngắn hạn nhằm đạt được mục tiêu chung của công ty;',
      '● Hướng dẫn xây dựng, triển khai các kế hoạch, hoạt động marketing nhằm đẩy mạnh thương hiệu trên thị trường theo đúng định hướng phát triển thương hiệu của công ty;',
      '',
      '4. Phát triển kinh doanh:',
      '● Giám sát và quản lý tất cả các hoạt động phát triển kinh doanh của công ty;',
      '● Phối hợp với BOD để lập hoạch định, mục tiêu, chiến lược, chính sách phát triển kinh doanh hiệu quả;',
      '',
      '5. Nhân sự:',
      '● Có hiểu biết chuyên sâu về quản lý nhân sự',
      '● Xây dựng kế hoạch nguồn nhân lực dài và ngắn hạn;',
      '● Xây dựng và quản lý các chương trình xây dựng văn hóa doanh nghiệp của công ty;',
      '● Xây dựng cơ chế lương, khen thưởng phù hợp với chiến lược và mục tiêu của công ty.',
      '',
      '6. Tài chính:',
      '● Quản lý ngân sách, định mức chi phí theo từng giải pháp của công ty.',
      '● Định kỳ theo dõi kiểm soát và đánh giá, điều chỉnh ngân sách và định mức chi phí.',
      '',
      '7. Kiểm soát:',
      '● Kiểm tra, đánh giá hệ thống quy trình vận hành theo định kỳ để mang lại môi trường làm việc hiệu quả cao.',
      '',
      'Yêu cầu ứng viên:',
      '● Có từ 2-5 năm kinh nghiệm ở vị trí Operating',
      '● Bằng cấp: tốt nghiệp Đại học trở lên',
      '● Năng động, sáng tạo, nhạy bén, kiên trì trong công việc',
      '● Có tố chất lãnh đạo, có khả năng giao tiếp, diễn thuyết, thuyết phục',
      '● Kỹ năng; Kỹ năng quản lý rủi ro; Kỹ năng quản lý mối quan hệ khách hàng; Kỹ năng hướng dẫn, đào tạo, nhân viên.',
      '● Ưu tiên: CV gửi kèm Portfolio',
      '',
      'Quyền lợi:',
      '● Mức lương: 20 - 25 triệu (Tùy theo năng lực và kinh nghiệm)',
      '● Tinh thần chia sẻ, hỗ trợ, và học hỏi lẫn nhau trong công việc',
      '● Thưởng theo ngày lễ, tết, dự án',
      '● Chính sách phúc lợi tốt. Ký hợp đồng lao động và hưởng các quyền lợi theo đúng luật lao động (đóng BHXH, BHYT, BHTN...).',
      '● Team Building',
      '',
      'Địa điểm làm việc:',
      '● Đà Nẵng',
      '',
      'Hạn nộp hồ sơ: 09/11/2024',
    ],
    startDate: '2023-01-26T13:51:50.417-07:00',
    endDate: '2023-01-27T13:51:50.417-07:00',
    isActive: true,
  };

  return (
    <MainLayout active={PageName.JOBS}>
      <section id={sectionId} className={style.bannerSection}>
        <div className={style.bannerContainer}>
          <div className={style.top}>
            <h1 className={style.topTitle}>
              {t('joblist')}
              <h5>{t('joblist.title')}</h5>
            </h1>
          </div>
        </div>
      </section>
      <JobFilter onFilter={handleFilter} />
      {/* <JobList jobs={filteredJobs.length > 0 ? filteredJobs : jobs} /> */}
      <JobList jobs={mockJobs} />
      <JobDetail job={mockJobData} />
      <BackToTop resetScrollNavigation={scrollToTop} />
      <PartnerSection sectionId={sectionId} />
      <UpdateSection sectionId={sectionId} />
    </MainLayout>
  );
};

export default Jobs;
