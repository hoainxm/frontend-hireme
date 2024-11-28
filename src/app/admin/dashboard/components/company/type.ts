export interface Company {
  id: string;
  name: string;
  address: string;
  logo?: string;
  description?: string;
  scale: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyFormValues {
  name: string;
  address: string;
  logo: string;
  description: string;
  scale: number;
}

export interface CreateCompanyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (values: CreateCompanyFormValues) => void;
  form: any;
}
