import React, { FC, HTMLAttributes, useEffect, useState } from 'react';
import style from './breadcrumb.module.scss';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageURL } from '@models/enum';

interface Props extends HTMLAttributes<HTMLElement> {}

type BreadcrumbItem = {
  label: string;
  path: string;
};

export const Breadcrumb: FC<Props> = (props) => {
  const { t } = useTranslation();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const BREADCRUMBS_MAPPING: { [key: string]: string } = {
    'license-management': 'user.license.management',
  };

  const updateBreadcrumbs = () => {
    const path = window.location.pathname;
    const pathParts = path.split('/').filter((part) => part !== '');

    const items: BreadcrumbItem[] = pathParts.map((part, index) => {
      const fullPath = `/${pathParts.slice(0, index + 1).join('/')}`;
      return {
        label: BREADCRUMBS_MAPPING[part],
        path: fullPath,
      };
    });

    setBreadcrumbs(items);
  };

  // Listen for route changes and update the breadcrumbs
  useEffect(() => {
    updateBreadcrumbs();
    window.addEventListener('popstate', updateBreadcrumbs);

    return () => {
      window.removeEventListener('popstate', updateBreadcrumbs);
    };
  }, []);

  return (
    <nav>
      <ol className={`breadcrumb ${style.breadcrumbContainer}`}>
        <li className='breadcrumb-item'>
          <Link to={PageURL.HOME}>{t('user.home')}</Link>
        </li>
        {breadcrumbs.map((item, index) => (
          <li className='breadcrumb-item' key={item.path}>
            {index === breadcrumbs.length - 1 ? <span>{t(item.label)}</span> : <Link to={item.path}>{t(item.label)}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
};
