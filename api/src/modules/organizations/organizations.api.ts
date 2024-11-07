import axios from 'axios';

const API_URL = 'http://localhost:3000/organizations';

export const getOrganizations = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createOrganization = async (orgData: { org_name: string; org_comment?: string }) => {
    const response = await axios.post(API_URL, orgData);
    return response.data;
};

export const updateOrganization = async (id: number, orgData: { org_name: string; org_comment?: string }) => {
    const response = await axios.put(`${API_URL}/${id}`, orgData);
    return response.data;
};

export const deleteOrganization = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
};