import React, { FC, useState } from 'react';
import { Form, Input, Select, AutoComplete, Row, Col, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import locationData from './location.json';
import { SkillsOptions, experienceOptions } from '../constant';
import style from '../jobs.module.scss';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

interface JobFilterProps {
  onFilter: (filters: any) => void;
}

const JobFilter: FC<JobFilterProps> = ({ onFilter }) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<string[]>(SkillsOptions);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [provinceSuggestions, setProvinceSuggestions] = useState<string[]>(locationData.map((prov) => prov.Name));

  const handleProvinceChange = (input: string) => {
    const suggestions = locationData.filter((province) => province.Name.includes(input)).map((prov) => prov.Name);
    setProvinceSuggestions(suggestions);
    setSelectedProvince(input);
  };

  const handleSkillSearch = (input: string) => {
    if (input) {
      const suggestions = SkillsOptions.filter((skill) => skill.toLowerCase().includes(input.toLowerCase()));
      setFilteredSkills(suggestions);
    } else {
      setFilteredSkills(SkillsOptions);
    }
  };

  const handleFilter = () => {
    const filters = {
      position,
      experience: selectedExperience,
      skills: selectedSkills.map((skill) => skill.toLowerCase()),
      province: selectedProvince,
    };
    onFilter(filters);
  };

  return (
    <Form layout='vertical' onFinish={handleFilter} className={style.jobfilter}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item>
            <Input
              placeholder={t('field.positionPlaceholder')}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className={style.input}
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item>
            <AutoComplete
              placeholder={t('field.experiencePlaceholder')}
              value={selectedExperience}
              options={experienceOptions.map((exp) => ({ value: exp }))}
              onChange={(value) => setSelectedExperience(value)}
              allowClear
              className={style.input}
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item className={style.skillsFilter}>
            <Select
              mode='multiple'
              placeholder={t('field.skillsPlaceholder')}
              value={selectedSkills}
              onChange={(value) => setSelectedSkills(value)}
              onSearch={handleSkillSearch}
              filterOption={false}
              allowClear
              className={style.select}
            >
              {filteredSkills.map((skill) => (
                <Option key={skill} value={skill}>
                  {skill}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item className={style.provinceFilter}>
            <AutoComplete
              placeholder={t('field.provincePlaceholder')}
              value={selectedProvince}
              options={provinceSuggestions.map((prov) => ({ value: prov }))}
              onChange={handleProvinceChange}
              allowClear
              className={style.input}
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Button type='primary' htmlType='submit' className={style.button}>
            <SearchOutlined />
            {t('field.search')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default JobFilter;
