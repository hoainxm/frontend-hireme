import React, { FC, HTMLAttributes, useEffect, useState, useTransition } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { updateSectionDot } from '@layout/slice';
import { BackToTop } from '@base/button/BackToTop';
import { useTranslation } from 'react-i18next';
import style from '../jobs.module.scss';
import Back from '@icon/Back.svg';
import locationData from './location.json';
import { Form } from 'react-bootstrap';
import { Job } from '../model';

// import { Province, District, Ward } from '../model';

interface Ward {
  Id: string;
  Name: string;
  Level?: string;
}

interface District {
  Id: string;
  Name: string;
  Wards: Ward[];
}

interface Province {
  Id: string;
  Name: string;
  Districts: District[];
}

interface JobFilterProps {
  onFilter: (filters: any) => void;
}

const JobFilter: React.FC<JobFilterProps> = ({ onFilter }) => {
  const { t } = useTranslation();
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [salaryRange, setSalaryRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000000 });
  const [level, setLevel] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean | ''>('');

  const locationData: Province[] = [];

  // Ensure `find` works correctly with the typed locationData
  useEffect(() => {
    const province = locationData.find((p: Province) => p.Id === selectedProvince);
    if (province) {
      setDistricts(province.Districts);
      setSelectedDistrict(''); // Reset district when province changes
      setWards([]); // Reset wards when province changes
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  // Update wards based on selected district
  useEffect(() => {
    const district = districts.find((d: District) => d.Id === selectedDistrict);
    if (district) {
      setWards(district.Wards);
      setSelectedWard(''); // Reset ward when district changes
    } else {
      setWards([]);
    }
  }, [selectedDistrict, districts]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    const filters = {
      location: { province: selectedProvince, district: selectedDistrict, ward: selectedWard },
      skills: selectedSkills,
      company: selectedCompany,
      salaryRange,
      level,
      isActive,
    };
    onFilter(filters); // Pass the filters to the parent component
  };

  return (
    <Form className={style.jobfilter} onSubmit={handleFilter}>
      <div className={style.location}>
        <div className={style.filterGroup}>
          <label htmlFor='province'>{t('field.selectProvince')}</label>
          <select id='province' value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
            <option value=''>{t('field.selectProvince')}</option>
            {locationData.map((province: Province) => (
              <option key={province.Id} value={province.Id}>
                {province.Name}
              </option>
            ))}
          </select>
        </div>

        <div className={style.filterGroup}>
          <label htmlFor='district'>{t('field.selectDistrict')}</label>
          <select id='district' value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedProvince}>
            <option value=''>{t('field.selectDistrict')}</option>
            {districts.map((district: District) => (
              <option key={district.Id} value={district.Id}>
                {district.Name}
              </option>
            ))}
          </select>
        </div>

        <div className={style.filterGroup}>
          <label htmlFor='ward'>{t('field.selectWard')}</label>
          <select id='ward' value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} disabled={!selectedDistrict}>
            <option value=''>{t('field.selectWard')}</option>
            {wards.map((ward: Ward) => (
              <option key={ward.Id} value={ward.Id}>
                {ward.Name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={style.group}>
        <div className={style.filterGroup}>
          <label>{t('field.skills')}</label>
          <input placeholder={t('skills')} type='text' onChange={(e) => setSelectedSkills(e.target.value.split(','))} />
        </div>

        <div className={style.filterGroup}>
          <label>{t('field.company')}</label>
          <input placeholder={t('company')} type='text' value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} />
        </div>

        <div className={style.filterGroup}>
          <label htmlFor='level'>{t('field.level')}</label>
          <select id='level' value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value=''>{t('selectLevel')}</option>
            <option value='INTERN'>{t('level.intern')}</option>
            <option value='FRESHER'>{t('level.fresher')}</option>
            <option value='JUNIOR'>{t('level.junior')}</option>
            <option value='SENIOR'>{t('level.senior')}</option>
          </select>
        </div>
      </div>

      <button type='submit' className={style.filterButton}>
        {t('field.filter')}
      </button>
    </Form>
  );
};

export default JobFilter;
