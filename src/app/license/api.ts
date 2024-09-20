import { doGet, doPost } from "../../common/utils/baseAPI";

export const getLicense = ({ page, page_size = 10, license_type }: { page: number, page_size: number, license_type: number }) => {
  return doGet("api/license/user/api-key/", {
    page,
    page_size,
    license_type
  });
};

export const renewLicense = (api_key: string) => {
  return doPost("api/license/user/api-key/renew", { api_key });
};